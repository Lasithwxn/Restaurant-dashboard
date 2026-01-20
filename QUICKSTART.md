# 🚀 Quick Start Guide

## Restaurant Order Dashboard System

### Getting Started in 3 Easy Steps

---

## Step 1️⃣: Understanding the System

This is a **complete restaurant order management system** with:

- 📱 **3 Pages**: Home, Place Order, Dashboard
- 💾 **Database**: Supabase KV Store (already connected)
- 📊 **Analytics**: Real-time charts and statistics
- ✅ **Production-Ready**: Full error handling and validation

---

## Step 2️⃣: Using the Application

### **Home Page** (Landing Page)
- Click **"View Database"** → Go to Dashboard
- Click **"Place an Order"** → Go to Order Form

### **Place Order Page**
1. Enter customer **first name** and **last name**
2. Select **Dine-In** or **Take-Out**
   - ⚠️ Dine-In adds 10% service charge automatically
3. Click **+** to add items, **−** to remove
4. Add **extra charges** if needed (optional)
5. Add **notes** if needed (optional)
6. Review the **Order Summary** on the right
7. Click **"Place Order"** button
8. You'll be redirected to the Dashboard

### **Dashboard Page**
- View **KPI Cards** at the top (Revenue, Active Orders, Completed Orders)
- Explore **interactive charts**:
  - Pie Chart: Dine-In vs Take-Out
  - Bar Charts: Most ordered items & Revenue by type
  - Line Chart: Orders over time
- Manage **Active Orders** table:
  - Click **"Complete"** to mark an order as done
- View **Completed Orders** history
- Click **"Refresh"** for manual data update
- Auto-refreshes every 30 seconds

---

## Step 3️⃣: System Features

### ✅ **What's Included**

#### **Backend (Supabase)**
- RESTful API with 5 endpoints
- Data persistence in KV Store
- SQL-style aggregation queries
- Comprehensive error handling

#### **Frontend (React + Tailwind)**
- Modern, responsive UI
- Live price calculations
- Form validation
- Toast notifications
- Interactive charts (Recharts)
- Real-time updates

#### **Business Logic**
- **Price Formula**: Subtotal + Service Charge + Extra Charges
- **Service Charge**: 10% for Dine-In, 0% for Take-Out
- **Order States**: ACTIVE → COMPLETED
- **Validation**: Names required, at least 1 item, positive numbers

---

## 📋 **Testing the System**

### Test Scenario 1: Place a Dine-In Order
```
1. Go to Home → Click "Place an Order"
2. Enter: John Doe
3. Select: Dine-In
4. Add: 2× Margherita Pizza, 1× Caesar Salad
5. Extra Charges: $5.00
6. Notes: "Extra napkins please"
7. Submit order
8. Verify it appears in Dashboard
```

### Test Scenario 2: Complete an Order
```
1. Go to Dashboard
2. Find an active order
3. Click "Complete" button
4. Verify order moves to Completed Orders section
5. Check that KPI cards update
```

### Test Scenario 3: View Analytics
```
1. Place multiple orders (mix Dine-In and Take-Out)
2. Go to Dashboard
3. Verify charts show correct data:
   - Pie chart shows distribution
   - Bar chart shows most ordered items
   - Line chart shows orders by date
```

---

## 🎯 **Menu Items Reference**

| Item | Price |
|------|-------|
| Margherita Pizza | $12.99 |
| Pepperoni Pizza | $14.99 |
| Caesar Salad | $8.99 |
| Pasta Carbonara | $13.99 |
| Grilled Chicken | $15.99 |
| Beef Burger | $11.99 |
| Fish & Chips | $14.49 |
| Vegetable Stir Fry | $10.99 |
| Garlic Bread | $5.99 |
| French Fries | $4.99 |

---

## 🔧 **Configuration**

### Service Charge Rate
Currently set to **10%** for Dine-In orders.

Location: `/src/app/components/PlaceOrderPage.tsx`
```typescript
const SERVICE_CHARGE_RATE = 0.10; // Change this value
```

### Auto-Refresh Interval
Currently set to **30 seconds**.

Location: `/src/app/components/DashboardPage.tsx`
```typescript
const interval = setInterval(() => {
  fetchData(false);
}, 30000); // Change this value (milliseconds)
```

---

## 📊 **Understanding the Analytics**

### KPI Cards
- **Total Revenue**: Sum of all order totals (ACTIVE + COMPLETED)
- **Active Orders**: Count of orders with status = ACTIVE
- **Completed Orders**: Count of orders with status = COMPLETED

### Charts
1. **Pie Chart**: Shows percentage split between Dine-In and Take-Out
2. **Bar Chart (Items)**: Top 5 most ordered food items by quantity
3. **Line Chart**: Number of orders per day over time
4. **Bar Chart (Revenue)**: Revenue comparison by pickup type

---

## 🐛 **Troubleshooting**

### Issue: Order not appearing in Dashboard
**Solution**: Click the "Refresh" button or wait for auto-refresh (30 seconds)

### Issue: Form validation error
**Solution**: 
- Ensure first and last name are filled
- Select at least one item (quantity > 0)
- Extra charges must be 0 or positive number

### Issue: Charts showing "No data available"
**Solution**: Place some orders first, then refresh the dashboard

### Issue: Total price seems wrong
**Solution**: 
- Remember Dine-In orders have 10% service charge
- Check if extra charges were added
- Formula: (Items Total) + (Service Charge) + (Extra Charges)

---

## 💡 **Pro Tips**

1. **Quick Navigation**: Use browser back button to go back to previous page
2. **Batch Testing**: Open multiple browser tabs to test concurrent orders
3. **Price Calculation**: Watch the Order Summary update in real-time as you change items
4. **Data Persistence**: All data is saved in Supabase and persists across sessions
5. **Mobile Friendly**: Try the app on mobile devices - it's fully responsive!

---

## 🎓 **For Developers**

### Project Structure
```
/src/app/
  ├── App.tsx                    # Main router
  ├── components/
  │   ├── HomePage.tsx           # Landing page
  │   ├── PlaceOrderPage.tsx     # Order form
  │   └── DashboardPage.tsx      # Analytics dashboard
  └── utils/
      └── api.ts                 # API client utilities

/supabase/functions/server/
  ├── index.tsx                  # Backend API server
  └── kv_store.tsx               # Database utilities (protected)

/src/styles/
  ├── index.css                  # Global styles
  ├── theme.css                  # Theme tokens
  └── tailwind.css               # Tailwind configuration
```

### Key Files to Explore
- **Backend Logic**: `/supabase/functions/server/index.tsx`
- **Price Calculation**: `/src/app/components/PlaceOrderPage.tsx` (line 50-70)
- **Analytics Queries**: `/supabase/functions/server/index.tsx` (line 136-206)
- **Chart Configuration**: `/src/app/components/DashboardPage.tsx` (line 200-400)

---

## 📚 **Additional Resources**

- **Full Documentation**: See `README.md`
- **Architecture Guide**: See `ARCHITECTURE.tsx`
- **API Reference**: See `README.md` → API Endpoints section

---

## ✅ **System Status**

✅ Backend Connected  
✅ Database Ready  
✅ All Features Working  
✅ Production-Ready Code  

**You're all set! Start by visiting the Home Page and placing your first order.**

---

**Need Help?** Check the console logs for detailed error messages if something goes wrong.
