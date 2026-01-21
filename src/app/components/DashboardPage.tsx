/**
 * DASHBOARD PAGE
 * Purpose: Real-time data visualization and order management
 * Features:
 * - KPI cards (Total Revenue, Active Orders, Completed Orders)
 * - Interactive charts (Pie, Bar, Line)
 * - Active orders table with actions
 * - Completed orders table
 * - Real-time data updates
 * - SQL aggregation analytics
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  DollarSign,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';
import { toast } from 'sonner';

// Types
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  pickup_type: 'Dine-In' | 'Take-Out';
  items: OrderItem[];
  total_price: number;
  status: 'ACTIVE' | 'COMPLETED';
  created_at: string;
  completed_at?: string;
  notes?: string;
}

interface Analytics {
  totalOrders: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  totalRevenue: number;
  pickupTypeDistribution: {
    dineIn: number;
    takeOut: number;
  };
  revenueByPickupType: {
    dineIn: number;
    takeOut: number;
  };
  mostOrderedItems: Array<{ name: string; count: number }>;
  ordersOverTime: Array<{ date: string; count: number }>;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // State
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch all data from backend
   */
  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);
    
    try {
      // Fetch active orders
      const activeResponse = await fetch(
        `${supabaseUrl}/make-server-5c1c75e3/orders/active`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        }
      );
      
      if (!activeResponse.ok) {
        throw new Error('Failed to fetch active orders');
      }
      
      const activeData = await activeResponse.json();
      setActiveOrders(activeData.orders || []);
      
      // Fetch completed orders
      const completedResponse = await fetch(
        `${supabaseUrl}/make-server-5c1c75e3/orders/completed`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        }
      );
      
      if (!completedResponse.ok) {
        throw new Error('Failed to fetch completed orders');
      }
      
      const completedData = await completedResponse.json();
      setCompletedOrders(completedData.orders || []);
      
      // Fetch analytics
      const analyticsResponse = await fetch(
        `${supabaseUrl}/make-server-5c1c75e3/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        }
      );
      
      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);
      
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Mark order as completed
   */
  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `${supabaseUrl}/make-server-5c1c75e3/orders/${orderId}/complete`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to complete order');
      }
      
      toast.success('Order marked as completed!');
      
      // Refresh data
      await fetchData(false);
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error(`Failed to complete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pickupTypeData = analytics ? [
    { name: 'Dine-In', value: analytics.pickupTypeDistribution.dineIn },
    { name: 'Take-Out', value: analytics.pickupTypeDistribution.takeOut },
  ] : [];

  const revenueByTypeData = analytics ? [
    { name: 'Dine-In', revenue: analytics.revenueByPickupType.dineIn },
    { name: 'Take-Out', revenue: analytics.revenueByPickupType.takeOut },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-blue-600" />
              Dashboard & Analytics
            </h1>
            
            <button
              onClick={() => fetchData(false)}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-12 h-12 opacity-80" />
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                All Time
              </div>
            </div>
            <h3 className="text-lg font-medium opacity-90 mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold">
              ${analytics?.totalRevenue.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Active Orders */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-12 h-12 opacity-80" />
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Live
              </div>
            </div>
            <h3 className="text-lg font-medium opacity-90 mb-2">Active Orders</h3>
            <p className="text-4xl font-bold">{analytics?.activeOrdersCount || 0}</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-12 h-12 opacity-80" />
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                All Time
              </div>
            </div>
            <h3 className="text-lg font-medium opacity-90 mb-2">Completed Orders</h3>
            <p className="text-4xl font-bold">{analytics?.completedOrdersCount || 0}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart - Pickup Type Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Dine-In vs Take-Out Distribution
            </h2>
            {pickupTypeData.length > 0 && pickupTypeData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pickupTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pickupTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Bar Chart - Most Ordered Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Most Ordered Food Items
            </h2>
            {analytics?.mostOrderedItems && analytics.mostOrderedItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.mostOrderedItems.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Line Chart - Orders Over Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Orders Over Time</h2>
          {analytics?.ordersOverTime && analytics.ordersOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Revenue by Pickup Type */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Revenue by Pickup Type</h2>
          {revenueByTypeData.some(d => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Active Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Active Orders ({activeOrders.length})
            </h2>
          </div>
          
          {activeOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Pickup Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Created</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {order.id.split('_')[1]}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {order.customer_first_name} {order.customer_last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.pickup_type === 'Dine-In'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.pickup_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-slate-700">
                              {item.quantity}× {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          ${order.total_price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <XCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No active orders</p>
              <button
                onClick={() => navigate('/place-order')}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Place New Order
              </button>
            </div>
          )}
        </div>

        {/* Completed Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Completed Orders ({completedOrders.length})
            </h2>
          </div>
          
          {completedOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Pickup Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {completedOrders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {order.id.split('_')[1]}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {order.customer_first_name} {order.customer_last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.pickup_type === 'Dine-In'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.pickup_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-slate-700">
                              {item.quantity}× {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          ${order.total_price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.completed_at ? new Date(order.completed_at).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No completed orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
