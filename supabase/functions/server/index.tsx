import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5c1c75e3/health", (c) => {
  return c.json({ status: "ok" });
});

// Create a new order
app.post("/make-server-5c1c75e3/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { customer_first_name, customer_last_name, pickup_type, items, extra_charges, notes } = body;
    
    // Validate required fields
    if (!customer_first_name || !customer_last_name || !pickup_type || !items || !Array.isArray(items)) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate total price
    let subtotal = 0;
    for (const item of items) {
      if (item.quantity > 0) {
        subtotal += item.price * item.quantity;
      }
    }
    
    // Add service charge for Dine-In (10%)
    const serviceCharge = pickup_type === "Dine-In" ? subtotal * 0.10 : 0;
    const totalPrice = subtotal + serviceCharge + (parseFloat(extra_charges) || 0);
    
    // Create order object
    const order = {
      id: orderId,
      customer_first_name,
      customer_last_name,
      pickup_type,
      items: items.filter((item: any) => item.quantity > 0), // Only save items with quantity > 0
      extra_charges: parseFloat(extra_charges) || 0,
      notes: notes || "",
      total_price: totalPrice,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    };
    
    // Save to KV store
    await kv.set(`order:${orderId}`, order);
    
    console.log(`Order created: ${orderId}`);
    return c.json({ success: true, order }, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: "Failed to create order", details: String(error) }, 500);
  }
});

// Get all active orders
app.get("/make-server-5c1c75e3/orders/active", async (c) => {
  try {
    const allOrders = await kv.getByPrefix("order:");
    const activeOrders = allOrders.filter((order: any) => order.status === "ACTIVE");
    
    // Sort by created_at descending (newest first)
    activeOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return c.json({ orders: activeOrders });
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return c.json({ error: "Failed to fetch active orders", details: String(error) }, 500);
  }
});

// Get all completed orders
app.get("/make-server-5c1c75e3/orders/completed", async (c) => {
  try {
    const allOrders = await kv.getByPrefix("order:");
    const completedOrders = allOrders.filter((order: any) => order.status === "COMPLETED");
    
    // Sort by created_at descending (newest first)
    completedOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return c.json({ orders: completedOrders });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    return c.json({ error: "Failed to fetch completed orders", details: String(error) }, 500);
  }
});

// Mark order as completed
app.put("/make-server-5c1c75e3/orders/:id/complete", async (c) => {
  try {
    const orderId = c.req.param("id");
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    // Update status
    order.status = "COMPLETED";
    order.completed_at = new Date().toISOString();
    
    await kv.set(`order:${orderId}`, order);
    
    console.log(`Order completed: ${orderId}`);
    return c.json({ success: true, order });
  } catch (error) {
    console.error("Error completing order:", error);
    return c.json({ error: "Failed to complete order", details: String(error) }, 500);
  }
});

// Get analytics
app.get("/make-server-5c1c75e3/analytics", async (c) => {
  try {
    const allOrders = await kv.getByPrefix("order:");
    
    // Calculate statistics
    const totalOrders = allOrders.length;
    const activeOrders = allOrders.filter((order: any) => order.status === "ACTIVE");
    const completedOrders = allOrders.filter((order: any) => order.status === "COMPLETED");
    
    // Calculate revenue
    const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + order.total_price, 0);
    
    // Pickup type distribution
    const dineInCount = allOrders.filter((order: any) => order.pickup_type === "Dine-In").length;
    const takeOutCount = allOrders.filter((order: any) => order.pickup_type === "Take-Out").length;
    
    // Revenue by pickup type
    const dineInRevenue = allOrders
      .filter((order: any) => order.pickup_type === "Dine-In")
      .reduce((sum: number, order: any) => sum + order.total_price, 0);
    const takeOutRevenue = allOrders
      .filter((order: any) => order.pickup_type === "Take-Out")
      .reduce((sum: number, order: any) => sum + order.total_price, 0);
    
    // Most ordered food items
    const foodItemCounts: { [key: string]: { count: number; name: string } } = {};
    for (const order of allOrders) {
      for (const item of order.items || []) {
        if (!foodItemCounts[item.name]) {
          foodItemCounts[item.name] = { name: item.name, count: 0 };
        }
        foodItemCounts[item.name].count += item.quantity;
      }
    }
    
    const mostOrderedItems = Object.values(foodItemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 items
    
    // Orders over time (group by date)
    const ordersByDate: { [key: string]: number } = {};
    for (const order of allOrders) {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    }
    
    const ordersOverTime = Object.entries(ordersByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return c.json({
      totalOrders,
      activeOrdersCount: activeOrders.length,
      completedOrdersCount: completedOrders.length,
      totalRevenue,
      pickupTypeDistribution: {
        dineIn: dineInCount,
        takeOut: takeOutCount,
      },
      revenueByPickupType: {
        dineIn: dineInRevenue,
        takeOut: takeOutRevenue,
      },
      mostOrderedItems,
      ordersOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ error: "Failed to fetch analytics", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);