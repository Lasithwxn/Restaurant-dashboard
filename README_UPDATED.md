# 🍽️ Restaurant Order Dashboard

> A full-stack restaurant order management system with real-time analytics and live price calculations.

## ✨ Features

- 📋 **Place Orders**: Create orders with live price calculation
  - Customer information form
  - Food item selection with quantities
  - Dine-In (10% service charge) or Take-Out options
  - Real-time total calculation
  
- 📊 **Dashboard Analytics**: Real-time order management and insights
  - Active and completed orders display
  - Total revenue tracking
  - Pickup type distribution (Dine-In vs Take-Out)
  - Top ordered items chart
  - Orders over time visualization
  - Mark orders as complete

- 🎨 **Modern UI**: Professional, responsive design
  - Tailwind CSS v4
  - Radix UI components
  - Beautiful gradients and animations
  - Mobile-friendly layout

- 🔔 **Notifications**: Toast messages with Sonner
- 📱 **Responsive**: Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone or navigate to project
cd /workspaces/Restaurant-dashboard

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

### Access the App
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3001
- **Admin**: http://localhost:5174/dashboard

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build**: Vite 6.3
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database Options**: 
  - Local (In-memory) - Development
  - Supabase - Production

### Database
- **Current**: In-memory (local backend)
- **Available**: Supabase (PostgreSQL + KV Store)

---

## 📁 Project Structure

```
restaurant-dashboard/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main router
│   │   ├── components/
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── PlaceOrderPage.tsx     # Order form
│   │   │   ├── DashboardPage.tsx      # Analytics
│   │   │   └── ui/                    # UI components
│   │   ├── lib/
│   │   │   └── supabase.ts            # Supabase config
│   │   ├── utils/
│   │   │   └── api.ts                 # API client
│   │   ├── config.ts                  # App config
│   │   └── styles/
│   └── main.tsx
├── backend-server.cjs                 # Local API backend
├── .env                               # Environment variables
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md

```

---

## 📝 Available Scripts

```bash
npm start          # Start backend + frontend together
npm run dev        # Start frontend only (localhost:5173)
npm run backend    # Start backend only (localhost:3001)
npm run build      # Build for production
npm install        # Install dependencies
```

---

## 🔌 API Endpoints

All endpoints run on `http://localhost:3001`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/make-server-5c1c75e3/health` | Health check |
| POST | `/make-server-5c1c75e3/orders` | Create order |
| GET | `/make-server-5c1c75e3/orders/active` | Get active orders |
| GET | `/make-server-5c1c75e3/orders/completed` | Get completed orders |
| PUT | `/make-server-5c1c75e3/orders/:id/complete` | Complete order |
| GET | `/make-server-5c1c75e3/analytics` | Get analytics data |

---

## 🎯 Usage

### Create an Order
1. Go to http://localhost:5174
2. Click "Place Order"
3. Enter customer information
4. Select pickup type (Dine-In/Take-Out)
5. Add food items
6. Review total (includes service charge if Dine-In)
7. Submit order

### View Analytics
1. Click "Dashboard"
2. View active and completed orders
3. Check real-time analytics:
   - Total revenue
   - Order distribution
   - Top items
   - Order timeline

### Manage Orders
1. In Dashboard, find your order
2. Click "Mark Complete" to finish

---

## 💾 Data Storage

### Current (Development)
- **Storage**: In-memory (local Node.js backend)
- **Persistence**: Data stored while server is running
- **Reset**: Restarts when you stop the app
- **Perfect for**: Testing, development, prototyping

### Production (Supabase)
- **Storage**: PostgreSQL database
- **Persistence**: Permanent, across sessions
- **Setup**: See `SUPABASE_SETUP_GUIDE.md`
- **Perfect for**: Production deployments

---

## 🔧 Environment Configuration

### .env File
```env
VITE_SUPABASE_URL=http://localhost:3001           # Backend URL
VITE_SUPABASE_ANON_KEY=<your-anon-key>           # API key
```

### To Use Real Supabase
1. Create tables: Run SQL from `SUPABASE_SETUP.sql`
2. Get API keys from Supabase dashboard
3. Update `.env`:
   ```env
   VITE_SUPABASE_URL=https://nckjhlqglzsljkyzhoee.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-real-key>
   ```
4. Restart the app

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| `HOW_TO_USE.txt` | Quick reference guide |
| `QUICK_START.md` | Getting started quickly |
| `SUPABASE_SETUP_GUIDE.md` | Detailed Supabase setup |
| `SUPABASE_SETUP.sql` | Database schema and queries |
| `SETUP_COMPLETE.md` | Setup completion checklist |
| `ARCHITECTURE.tsx` | Technical architecture |

---

## 🧪 Testing

### Test Locally
```bash
# Start the app
npm start

# Open browser
http://localhost:5174

# Create test order with:
# - Name: Lasith Bandara
# - Type: Dine-In
# - Items: 2x Pepperoni Pizza
# Expected total: $32.98 (29.98 + 3.00 service charge)
```

### Test Dashboard
1. Place multiple orders
2. Check analytics cards update
3. Verify charts display correct data
4. Mark orders complete

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
pkill -f "vite"
pkill -f "node"
npm start
```

### "Failed to fetch orders"
- Check backend is running: `curl http://localhost:3001/make-server-5c1c75e3/health`
- Check `.env` has correct URL
- Check browser console (F12) for errors

### "Dashboard not loading"
- Refresh the page
- Check backend logs
- Restart `npm start`

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Local**: `npm start`
- **Vercel**: Connect Git repository
- **Heroku**: Use Procfile
- **Docker**: Create Dockerfile

---

## 📊 Business Logic

### Price Calculation
```
Order Total = Subtotal + Service Charge + Extra Charges

Where:
  Subtotal = Sum of (item_price × quantity)
  Service Charge = 10% of Subtotal (Dine-In only)
  Service Charge = 0 (Take-Out)
  Extra Charges = Manual entry
```

### Order Status Flow
```
ACTIVE → COMPLETED
```

### Analytics Aggregations
- **COUNT**: Total orders, active orders, completed orders
- **SUM**: Total revenue, revenue by type
- **GROUP BY**: Orders by type, items count
- **ORDER BY**: Top items, orders over time

---

## 🔐 Security Notes

⚠️ **For Development Only**:
- Public API access enabled
- No authentication required
- In-memory data (not persistent)

✅ **For Production**:
- Use Supabase authentication
- Enable RLS policies
- Restrict CORS origins
- Add rate limiting
- Use HTTPS only

---

## 📝 Features Checklist

- [x] Home page navigation
- [x] Place order with live calculation
- [x] Dine-In service charge (10%)
- [x] Take-Out zero service charge
- [x] Dashboard with active orders
- [x] Completed orders view
- [x] Analytics cards
- [x] Revenue charts
- [x] Item distribution
- [x] Order timeline
- [x] Mark order complete
- [x] Toast notifications
- [x] Responsive design
- [x] Local backend
- [x] Supabase ready

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Modify the UI
- Add new features
- Improve analytics
- Deploy to production

---

## 📞 Support

### Quick Links
- 📂 [Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- 🗄️ [Database Schema](./SUPABASE_SETUP.sql)
- 🏗️ [Architecture](./ARCHITECTURE.tsx)

### Common Issues
See [HOW_TO_USE.txt](./HOW_TO_USE.txt) for troubleshooting

---

## 📄 License

MIT

---

## 🎉 Ready to Go!

```bash
npm start
```

Your restaurant dashboard is ready! Open http://localhost:5174 and start creating orders.

Enjoy! 🍽️
