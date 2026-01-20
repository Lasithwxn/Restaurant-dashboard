/**
 * Local Development Backend Server
 * Simulates Supabase Edge Functions for local development
 * Run with: node backend-server.cjs
 */

const express = require('express');

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory database (for development only)
const ordersDB = {};

// Health check
app.get('/make-server-5c1c75e3/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create order
app.post('/make-server-5c1c75e3/orders', (req, res) => {
  try {
    const { customer_first_name, customer_last_name, pickup_type, items, extra_charges, notes } = req.body;

    // Validate
    if (!customer_first_name || !customer_last_name || !pickup_type || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      if (item.quantity > 0) {
        subtotal += item.price * item.quantity;
      }
    }

    const serviceCharge = pickup_type === 'Dine-In' ? subtotal * 0.1 : 0;
    const totalPrice = subtotal + serviceCharge + (parseFloat(extra_charges) || 0);

    const order = {
      id: orderId,
      customer_first_name,
      customer_last_name,
      pickup_type,
      items: items.filter((item) => item.quantity > 0),
      extra_charges: parseFloat(extra_charges) || 0,
      notes: notes || '',
      total_price: totalPrice,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    ordersDB[orderId] = order;
    console.log(`✅ Order created: ${orderId}`);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get active orders
app.get('/make-server-5c1c75e3/orders/active', (req, res) => {
  try {
    const activeOrders = Object.values(ordersDB).filter((o) => o.status === 'ACTIVE');
    res.json({ orders: activeOrders });
  } catch (error) {
    console.error('Error fetching active orders:', error);
    res.status(500).json({ error: 'Failed to fetch active orders' });
  }
});

// Get completed orders
app.get('/make-server-5c1c75e3/orders/completed', (req, res) => {
  try {
    const completedOrders = Object.values(ordersDB).filter((o) => o.status === 'COMPLETED');
    res.json({ orders: completedOrders });
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ error: 'Failed to fetch completed orders' });
  }
});

// Mark order as completed
app.put('/make-server-5c1c75e3/orders/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const order = ordersDB[id];

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'COMPLETED';
    order.completed_at = new Date().toISOString();

    console.log(`✅ Order completed: ${id}`);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

// Get analytics
app.get('/make-server-5c1c75e3/analytics', (req, res) => {
  try {
    const allOrders = Object.values(ordersDB);
    const totalOrders = allOrders.length;
    const activeOrders = allOrders.filter((o) => o.status === 'ACTIVE');
    const completedOrders = allOrders.filter((o) => o.status === 'COMPLETED');

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total_price, 0);

    const dineInCount = allOrders.filter((o) => o.pickup_type === 'Dine-In').length;
    const takeOutCount = allOrders.filter((o) => o.pickup_type === 'Take-Out').length;

    const dineInRevenue = allOrders
      .filter((o) => o.pickup_type === 'Dine-In')
      .reduce((sum, o) => sum + o.total_price, 0);
    const takeOutRevenue = allOrders
      .filter((o) => o.pickup_type === 'Take-Out')
      .reduce((sum, o) => sum + o.total_price, 0);

    const foodCounts = {};
    for (const order of allOrders) {
      for (const item of order.items) {
        foodCounts[item.name] = (foodCounts[item.name] || 0) + item.quantity;
      }
    }

    const mostOrderedItems = Object.entries(foodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const ordersByDate = {};
    for (const order of allOrders) {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    }

    const ordersOverTime = Object.entries(ordersByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
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
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Local Backend Server running on http://localhost:${PORT}`);
  console.log(`\n📡 Endpoints available:`);
  console.log(`  POST   http://localhost:${PORT}/make-server-5c1c75e3/orders`);
  console.log(`  GET    http://localhost:${PORT}/make-server-5c1c75e3/orders/active`);
  console.log(`  GET    http://localhost:${PORT}/make-server-5c1c75e3/orders/completed`);
  console.log(`  PUT    http://localhost:${PORT}/make-server-5c1c75e3/orders/:id/complete`);
  console.log(`  GET    http://localhost:${PORT}/make-server-5c1c75e3/analytics`);
  console.log(`  GET    http://localhost:${PORT}/make-server-5c1c75e3/health\n`);
});
