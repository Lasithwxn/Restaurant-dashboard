# 🚀 Supabase Setup Guide

## Your Supabase Project Details
- **Project Name:** Restaurant Order Dashboard
- **Project ID:** `nckjhlqglzsljkyzhoee`
- **Dashboard URL:** https://app.supabase.com/projects/nckjhlqglzsljkyzhoee

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Create Database Tables**

1. Go to https://app.supabase.com/
2. Click on your project: **Restaurant Order Dashboard**
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**
5. Copy all the SQL from `/SUPABASE_SETUP.sql`
6. Paste it into the SQL editor
7. Click **Run** to execute

**Tables created:**
- ✅ `kv_store_5c1c75e3` - Key-value store for orders
- ✅ `orders` - Main orders table
- ✅ `order_items` - Individual items in each order
- ✅ `order_analytics` - Analytics view

---

### **STEP 2: Enable RLS Policies**

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. For each table (`kv_store_5c1c75e3`, `orders`, `order_items`):
   - ✅ Policies should already be created by the SQL script
   - ✅ They allow public access (for development)

---

### **STEP 3: Get Your API Keys**

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy:
   - `SUPABASE_URL` - Your project URL
   - `SUPABASE_ANON_KEY` - Your anonymous public key

---

### **STEP 4: Update .env File**

Update `/workspaces/Restaurant-dashboard/.env`:

```env
# Use PRODUCTION Supabase URL (not localhost)
VITE_SUPABASE_URL=https://nckjhlqglzsljkyzhoee.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-step-3>
```

---

### **STEP 5: Deploy Edge Functions (Optional)**

If you want to use the Supabase Edge Functions instead of the local backend:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy make-server-5c1c75e3 --project-id nckjhlqglzsljkyzhoee
   ```

4. The function will be available at:
   ```
   https://nckjhlqglzsljkyzhoee.supabase.co/functions/v1/make-server-5c1c75e3
   ```

---

## 🔄 LOCAL vs PRODUCTION SETUP

### **For Local Development (Current)**
```env
VITE_SUPABASE_URL=http://localhost:3001
VITE_SUPABASE_ANON_KEY=...
```
- Runs backend: `npm run backend`
- Runs frontend: `npm run dev`
- Command: `npm start`

### **For Production (Real Supabase)**
```env
VITE_SUPABASE_URL=https://nckjhlqglzsljkyzhoee.supabase.co
VITE_SUPABASE_ANON_KEY=<your-real-key>
```
- Runs only frontend: `npm run dev`
- Backend: Uses real Supabase Edge Functions

---

## ⚠️ IMPORTANT NOTES

1. **Never commit .env to Git** - It's in `.gitignore` ✅

2. **The local backend is perfect for development**:
   - No need to deploy Edge Functions
   - In-memory database (good for testing)
   - Instant feedback

3. **Switch to Supabase when ready**:
   - Update .env with production URL
   - Data persists in real database
   - Can be shared with team

4. **Database data persistence**:
   - Local backend: Only while running
   - Supabase: Persistent across sessions

---

## 🧪 TESTING

### **Test with Local Backend**
```bash
npm start
```
- Backend: http://localhost:3001
- Frontend: http://localhost:5174

### **Test with Real Supabase**
1. Update .env with production details
2. Run: `npm run dev`
3. Frontend will connect to real Supabase
4. Data will be saved to your real database

---

## 📊 DATABASE SCHEMA

### Orders Table
```sql
orders (
  id: UUID (primary key),
  order_id: TEXT (unique),
  customer_first_name: TEXT,
  customer_last_name: TEXT,
  pickup_type: TEXT ('Dine-In' | 'Take-Out'),
  total_price: DECIMAL,
  status: TEXT ('ACTIVE' | 'COMPLETED'),
  created_at: TIMESTAMP,
  completed_at: TIMESTAMP
)
```

### Order Items Table
```sql
order_items (
  id: UUID (primary key),
  order_id: UUID (foreign key → orders),
  food_name: TEXT,
  unit_price: DECIMAL,
  quantity: INTEGER,
  subtotal: DECIMAL
)
```

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Failed to fetch orders" | Check if backend is running or .env has correct URL |
| "Missing environment variables" | Update .env with correct SUPABASE_URL and SUPABASE_ANON_KEY |
| "Database error" | Make sure tables are created via SQL script |
| "RLS policy errors" | Verify policies are enabled on tables |

---

## 📞 NEXT STEPS

Choose one:

### **Option A: Keep Using Local Backend (Recommended for now)**
- ✅ Easier to test
- ✅ No external dependencies
- ✅ Perfect for development
```bash
npm start
```

### **Option B: Switch to Real Supabase**
1. Run the SQL setup script
2. Update .env with production keys
3. Restart the app
4. Data persists in your real database

**Recommendation:** Start with local backend, switch to Supabase later!

---
