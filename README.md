# 🍽️ Restaurant Order Dashboard System

A professional, full-stack restaurant order management system with real-time analytics, interactive dashboards, and comprehensive order tracking.

---

## 🎯 **Project Overview**

This system provides a complete solution for restaurant order management with three main pages:

1. **Home Page** - Modern navigation hub with gradient UI
2. **Place Order Page** - Complete order form with live price calculations
3. **Dashboard Page** - Real-time analytics with charts and order management

---

## 🛠️ **Technology Stack**

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Charts**: Recharts (for interactive data visualization)
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### **Backend**
- **Runtime**: Deno (Edge Functions)
- **Framework**: Hono (lightweight web framework)
- **Database**: Supabase KV Store (key-value storage)
- **API**: RESTful endpoints with JSON responses

---

## 📊 **Database Design**

### **Data Structure**

The system uses a normalized key-value structure with the following schema:

#### **Order Object**
```typescript
{
  id: string;                    // Unique order ID
  customer_first_name: string;   // Customer's first name
  customer_last_name: string;    // Customer's last name
  pickup_type: 'Dine-In' | 'Take-Out';
  items: OrderItem[];            // Array of ordered items
  extra_charges: number;         // Additional charges
  notes: string;                 // Optional order notes
  total_price: number;           // Final calculated price
  status: 'ACTIVE' | 'COMPLETED';
  created_at: string;            // ISO timestamp
  completed_at?: string;         // ISO timestamp (optional)
}
```

#### **OrderItem Object**
```typescript
{
  name: string;      // Food item name
  price: number;     // Unit price
  quantity: number;  // Quantity ordered
}
```

---

## 🚀 **Features**

### **1. Home Page**
- ✅ Modern mirror-style UI with blue gradient background
- ✅ Two large navigation buttons with hover effects
- ✅ Responsive design
- ✅ Professional glass-morphism effects

### **2. Place Order Page**
- ✅ Customer information form (first name, last name)
- ✅ Pickup type selection (Dine-In / Take-Out)
- ✅ 10 predefined menu items with prices
- ✅ **Quantity controls** with + and - buttons
- ✅ **Live price calculation** that updates in real-time
- ✅ **Service charge** (10%) automatically applied for Dine-In orders
- ✅ Extra charges input field (numbers only)
- ✅ Optional notes textarea
- ✅ **Comprehensive form validation**:
  - Customer name required
  - At least one item must be selected
  - Negative quantities prevented
  - Numbers-only validation for extra charges
- ✅ Order summary sidebar with live totals
- ✅ Success notifications and automatic navigation to dashboard

### **3. Dashboard Page**
- ✅ **KPI Cards** displaying:
  - Total Revenue (all-time)
  - Active Orders (real-time count)
  - Completed Orders (all-time count)
- ✅ **Interactive Charts**:
  - **Pie Chart**: Dine-In vs Take-Out distribution
  - **Bar Chart**: Most ordered food items (top 5)
  - **Line Chart**: Orders over time (by date)
  - **Bar Chart**: Revenue by pickup type
- ✅ **Active Orders Table** with:
  - Order ID, Customer Name, Pickup Type
  - Food items list with quantities
  - Total price
  - Creation timestamp
  - **"Mark as Completed" button** for each order
- ✅ **Completed Orders Table** showing historical data
- ✅ **Auto-refresh** every 30 seconds
- ✅ Manual refresh button
- ✅ Real-time updates when orders are placed or completed

---

## 📡 **API Endpoints**

All endpoints are prefixed with `/make-server-5c1c75e3`

### **POST /orders**
Create a new order
- **Body**: `{ customer_first_name, customer_last_name, pickup_type, items, extra_charges, notes }`
- **Returns**: `{ success: true, order: Order }`

### **GET /orders/active**
Get all active orders
- **Returns**: `{ orders: Order[] }`

### **GET /orders/completed**
Get all completed orders
- **Returns**: `{ orders: Order[] }`

### **PUT /orders/:id/complete**
Mark an order as completed
- **Returns**: `{ success: true, order: Order }`

### **GET /analytics**
Get comprehensive analytics data
- **Returns**: Analytics object with:
  - Total orders count
  - Active/completed orders counts
  - Total revenue
  - Pickup type distribution
  - Revenue by pickup type
  - Most ordered items
  - Orders over time

---

## 🧮 **Business Logic**

### **Price Calculation Formula**

```
Subtotal = Σ(Item Price × Quantity)
Service Charge = Subtotal × 10% (Dine-In only)
Total Price = Subtotal + Service Charge + Extra Charges
```

### **Service Charge Rules**
- **Dine-In**: 10% service charge applied
- **Take-Out**: No service charge

---

## 📈 **SQL Analytics Implementation**

The backend implements SQL-style aggregation queries using JavaScript:

### **Implemented Analytics**
1. **COUNT()** - Total orders, active orders, completed orders
2. **SUM()** - Total revenue, revenue by pickup type
3. **GROUP BY** - Orders grouped by:
   - Status (ACTIVE/COMPLETED)
   - Pickup type (Dine-In/Take-Out)
   - Date (orders over time)
4. **Aggregation** - Most ordered items with quantity counts

### **Example Analytics Query Logic**
```javascript
// Total Revenue (SUM aggregation)
const totalRevenue = allOrders.reduce((sum, order) => 
  sum + order.total_price, 0
);

// Group by pickup type (GROUP BY)
const dineInCount = allOrders.filter(order => 
  order.pickup_type === "Dine-In"
).length;

// Most ordered items (COUNT and GROUP BY)
const foodItemCounts = {};
for (const order of allOrders) {
  for (const item of order.items) {
    foodItemCounts[item.name] = 
      (foodItemCounts[item.name] || 0) + item.quantity;
  }
}
```

---

## 🎨 **UI/UX Features**

- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Color-coded Status**: Visual distinction for order types and statuses
- ✅ **Hover Effects**: Interactive buttons with smooth transitions
- ✅ **Loading States**: Spinners and disabled states during API calls
- ✅ **Error Handling**: User-friendly error messages via toast notifications
- ✅ **Professional Typography**: Clear, readable fonts with proper hierarchy
- ✅ **Gradient Backgrounds**: Modern aesthetic with blue/purple gradients
- ✅ **Glass-morphism**: Backdrop blur effects for modern UI
- ✅ **Smooth Animations**: Fade-in effects and scale transforms

---

## 🔧 **How to Use**

### **1. Navigate to Home Page**
- Click "View Database" to see analytics and manage orders
- Click "Place an Order" to create a new order

### **2. Place an Order**
1. Enter customer first and last name
2. Select pickup type (Dine-In or Take-Out)
3. Use + and - buttons to select food items
4. Add any extra charges if needed
5. Optionally add notes
6. Review the order summary on the right
7. Click "Place Order" to submit

### **3. Manage Orders on Dashboard**
- View real-time KPI metrics at the top
- Analyze data through interactive charts
- Find active orders in the table
- Click "Complete" to mark an order as done
- Completed orders move to the completed section automatically
- Dashboard auto-refreshes every 30 seconds

---

## 📝 **Code Quality**

### **Best Practices Implemented**
✅ **Modular Components**: Clean separation of concerns  
✅ **TypeScript Types**: Full type safety with interfaces  
✅ **Comprehensive Comments**: Detailed JSDoc-style comments  
✅ **Error Handling**: Try-catch blocks with detailed logging  
✅ **Validation**: Form validation on both frontend and backend  
✅ **Production-Ready**: Proper loading states and error messages  
✅ **DRY Principle**: Reusable functions and components  
✅ **MVC Architecture**: Clear separation of data, logic, and presentation  

---

## 🔐 **Important Notes**

⚠️ **Security Considerations**:
- This system is designed for prototyping and demonstration purposes
- For production use, implement proper authentication and authorization
- Customer data (names) should be handled according to privacy regulations
- Add input sanitization for production deployments

⚠️ **Data Persistence**:
- Data is stored in Supabase KV Store
- Data persists across sessions
- No automatic data cleanup is implemented

---

## 🎯 **Future Enhancements** (Optional)

Potential features for future development:
- User authentication for staff members
- Order editing and cancellation
- Print receipts functionality
- Email/SMS notifications
- Inventory management
- Custom menu item creation
- Multi-location support
- Payment processing integration
- Customer loyalty program
- Advanced filtering and search

---

## 📞 **Support**

This is a demonstration system built with React, Tailwind CSS, and Supabase. The code is production-ready with comprehensive error handling, validation, and documentation.

---

## 🏆 **System Highlights**

✅ **Professional Grade**: Clean, modular, well-commented code  
✅ **Full MVC Architecture**: Proper separation of concerns  
✅ **Real-time Updates**: Live dashboard with auto-refresh  
✅ **Comprehensive Analytics**: SQL-style aggregation queries  
✅ **Modern UI/UX**: Beautiful gradient designs with smooth animations  
✅ **Type-Safe**: Full TypeScript implementation  
✅ **Production-Ready**: Error handling, validation, and logging  

---

**Built with ❤️ using React, Tailwind CSS, Recharts, and Supabase**
