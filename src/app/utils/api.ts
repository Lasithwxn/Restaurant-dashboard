/**
 * API UTILITIES
 * Helper functions for interacting with the backend API
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5c1c75e3`;

/**
 * Common headers for API requests
 */
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
});

/**
 * Order API Interface
 */
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer_first_name: string;
  customer_last_name: string;
  pickup_type: 'Dine-In' | 'Take-Out';
  items: OrderItem[];
  extra_charges: number;
  notes?: string;
}

export interface Order {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  pickup_type: 'Dine-In' | 'Take-Out';
  items: OrderItem[];
  extra_charges: number;
  notes: string;
  total_price: number;
  status: 'ACTIVE' | 'COMPLETED';
  created_at: string;
  completed_at?: string;
}

export interface Analytics {
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
  mostOrderedItems: Array<{
    name: string;
    count: number;
  }>;
  ordersOverTime: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * API Client Class
 */
export class OrderAPI {
  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    const result = await response.json();
    return result.order;
  }

  /**
   * Get all active orders
   */
  static async getActiveOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/active`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active orders');
    }

    const result = await response.json();
    return result.orders;
  }

  /**
   * Get all completed orders
   */
  static async getCompletedOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/completed`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completed orders');
    }

    const result = await response.json();
    return result.orders;
  }

  /**
   * Mark an order as completed
   */
  static async completeOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/complete`, {
      method: 'PUT',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete order');
    }

    const result = await response.json();
    return result.order;
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return await response.json();
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  }
}

/**
 * Utility functions
 */

/**
 * Format price to USD currency
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date to localized string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate service charge (10% for Dine-In)
 */
export const calculateServiceCharge = (
  subtotal: number,
  pickupType: 'Dine-In' | 'Take-Out'
): number => {
  return pickupType === 'Dine-In' ? subtotal * 0.10 : 0;
};

/**
 * Calculate total price
 */
export const calculateTotalPrice = (
  items: OrderItem[],
  pickupType: 'Dine-In' | 'Take-Out',
  extraCharges: number = 0
): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceCharge = calculateServiceCharge(subtotal, pickupType);
  return subtotal + serviceCharge + extraCharges;
};

/**
 * Get order status badge color
 */
export const getOrderStatusColor = (status: 'ACTIVE' | 'COMPLETED'): string => {
  return status === 'ACTIVE'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-green-100 text-green-700';
};

/**
 * Get pickup type badge color
 */
export const getPickupTypeColor = (pickupType: 'Dine-In' | 'Take-Out'): string => {
  return pickupType === 'Dine-In'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-orange-100 text-orange-700';
};

/**
 * Validate order form
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateOrderForm = (
  firstName: string,
  lastName: string,
  items: OrderItem[],
  extraCharges: number
): ValidationResult => {
  if (!firstName.trim()) {
    return { valid: false, error: 'First name is required' };
  }

  if (!lastName.trim()) {
    return { valid: false, error: 'Last name is required' };
  }

  const hasItems = items.some(item => item.quantity > 0);
  if (!hasItems) {
    return { valid: false, error: 'Please select at least one item' };
  }

  if (isNaN(extraCharges) || extraCharges < 0) {
    return { valid: false, error: 'Extra charges must be a valid positive number' };
  }

  return { valid: true };
};

/**
 * Default export
 */
export default OrderAPI;
