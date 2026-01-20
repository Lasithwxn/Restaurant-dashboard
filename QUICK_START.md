# ⚡ QUICK FIX: Make Your App Work

## 🎯 You Have TWO Options

---

## **OPTION 1: Use Local Backend (Easiest - Start Here!)** ✅

This is already set up and working!

### Run:
```bash
npm start
```

### What happens:
- Backend starts on `http://localhost:3001` 
- Frontend starts on `http://localhost:5174`
- Orders are saved to local memory
- Perfect for testing

### To use:
1. Go to http://localhost:5174
2. Click "Place Order"
3. Fill in details and submit
4. Go to "Dashboard" → See your order!
5. Click "Mark Complete"

---

## **OPTION 2: Use Real Supabase Database (For Production)** 🌐

This requires a few steps to set up.

### Step 1: Create Tables in Supabase

1. Open: https://app.supabase.com/projects/nckjhlqglzsljkyzhoee
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy-paste all SQL from this file:
   ```
   /SUPABASE_SETUP.sql
   ```
5. Click **Run**

### Step 2: Get Your API Key

1. Go to **Settings** → **API**
2. Find `Project URL` and `anon public` key
3. Copy both

### Step 3: Update .env

Edit `/workspaces/Restaurant-dashboard/.env`:
```env
VITE_SUPABASE_URL=https://nckjhlqglzsljkyzhoee.supabase.co
VITE_SUPABASE_ANON_KEY=<paste-your-key-here>
```

### Step 4: Run the App

```bash
npm run dev
```

Then go to http://localhost:5173 and test!

---

## 📊 Which Option Should You Choose?

| Feature | Local Backend | Supabase |
|---------|---|---|
| **Setup Time** | ✅ 0 min | 10 min |
| **Data Persists** | ❌ Only while running | ✅ Forever |
| **Production Ready** | ❌ No | ✅ Yes |
| **Cost** | ✅ Free (local) | ✅ Free (generous limits) |
| **Recommended** | ✅ For now | Later |

---

## 🚀 Start Here (Recommended)

```bash
# Terminal 1: Start everything
npm start

# Then open browser
# http://localhost:5174
```

That's it! Your app is ready to use! 🎉

---

## 🐛 Having Issues?

### "Failed to place order"
- Make sure `npm start` is running
- Check browser console (F12)
- Look for error messages

### "Port 5173/5174 already in use"
```bash
pkill -f "vite"   # Kill old dev server
npm start         # Start fresh
```

### "Backend not responding"
```bash
# Check if backend is running
curl http://localhost:3001/make-server-5c1c75e3/health

# Should return: {"status":"ok"}
```

---

**Questions? Check:** `SUPABASE_SETUP_GUIDE.md` for detailed info
