/**
 * SYSTEM CONFIGURATION
 * Centralized configuration for the Restaurant Order Dashboard
 * 
 * Modify these values to customize the system behavior
 */

/**
 * ============================================================================
 * MENU CONFIGURATION
 * ============================================================================
 */

export interface MenuItem {
  name: string;
  price: number;
  category?: string;
  description?: string;
}

/**
 * Restaurant Menu Items
 * 
 * Add, remove, or modify menu items here.
 * Changes will automatically reflect in the Place Order page.
 */
export const MENU_ITEMS: MenuItem[] = [
  { 
    name: 'Margherita Pizza', 
    price: 12.99,
    category: 'Pizza',
    description: 'Classic tomato, mozzarella, and basil'
  },
  { 
    name: 'Pepperoni Pizza', 
    price: 14.99,
    category: 'Pizza',
    description: 'Loaded with pepperoni slices'
  },
  { 
    name: 'Caesar Salad', 
    price: 8.99,
    category: 'Salad',
    description: 'Fresh romaine with Caesar dressing'
  },
  { 
    name: 'Pasta Carbonara', 
    price: 13.99,
    category: 'Pasta',
    description: 'Creamy pasta with bacon and parmesan'
  },
  { 
    name: 'Grilled Chicken', 
    price: 15.99,
    category: 'Main Course',
    description: 'Tender grilled chicken breast'
  },
  { 
    name: 'Beef Burger', 
    price: 11.99,
    category: 'Burgers',
    description: 'Juicy beef patty with lettuce and tomato'
  },
  { 
    name: 'Fish & Chips', 
    price: 14.49,
    category: 'Seafood',
    description: 'Crispy battered fish with fries'
  },
  { 
    name: 'Vegetable Stir Fry', 
    price: 10.99,
    category: 'Vegetarian',
    description: 'Mixed vegetables in savory sauce'
  },
  { 
    name: 'Garlic Bread', 
    price: 5.99,
    category: 'Sides',
    description: 'Toasted bread with garlic butter'
  },
  { 
    name: 'French Fries', 
    price: 4.99,
    category: 'Sides',
    description: 'Crispy golden fries'
  },
];

/**
 * ============================================================================
 * PRICING CONFIGURATION
 * ============================================================================
 */

/**
 * Service Charge Rate
 * Applied only to Dine-In orders
 * 
 * Example: 0.10 = 10%, 0.15 = 15%
 */
export const SERVICE_CHARGE_RATE = 0.10;

/**
 * Service Charge Display Name
 */
export const SERVICE_CHARGE_LABEL = 'Service Charge';

/**
 * Tax Rate (if applicable)
 * Set to 0 if not used
 */
export const TAX_RATE = 0.00;

/**
 * Currency Configuration
 */
export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
};

/**
 * ============================================================================
 * ORDER CONFIGURATION
 * ============================================================================
 */

/**
 * Available Pickup Types
 */
export const PICKUP_TYPES = {
  DINE_IN: 'Dine-In',
  TAKE_OUT: 'Take-Out',
} as const;

/**
 * Order Status Options
 */
export const ORDER_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED', // For future use
} as const;

/**
 * Maximum quantity per item
 */
export const MAX_ITEM_QUANTITY = 99;

/**
 * Minimum order amount (set to 0 for no minimum)
 */
export const MIN_ORDER_AMOUNT = 0;

/**
 * ============================================================================
 * DASHBOARD CONFIGURATION
 * ============================================================================
 */

/**
 * Auto-refresh interval in milliseconds
 * 30000 = 30 seconds
 */
export const AUTO_REFRESH_INTERVAL = 30000;

/**
 * Number of top items to display in analytics
 */
export const TOP_ITEMS_COUNT = 10;

/**
 * Number of recent completed orders to display
 */
export const RECENT_COMPLETED_ORDERS_LIMIT = 10;

/**
 * Chart color palette
 */
export const CHART_COLORS = {
  primary: '#3b82f6',      // Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Orange
  danger: '#ef4444',       // Red
  purple: '#8b5cf6',       // Purple
  pink: '#ec4899',         // Pink
};

/**
 * ============================================================================
 * UI CONFIGURATION
 * ============================================================================
 */

/**
 * Restaurant Information
 */
export const RESTAURANT_INFO = {
  name: 'Restaurant Dashboard',
  tagline: 'Modern Order Management System',
  year: 2026,
};

/**
 * Toast Notification Configuration
 */
export const TOAST_CONFIG = {
  position: 'top-right' as const,
  duration: 4000, // milliseconds
  richColors: true,
};

/**
 * Loading States
 */
export const LOADING_MESSAGES = {
  placing_order: 'Processing...',
  loading_data: 'Loading dashboard...',
  refreshing: 'Refreshing...',
  completing_order: 'Completing order...',
};

/**
 * ============================================================================
 * VALIDATION CONFIGURATION
 * ============================================================================
 */

/**
 * Customer name validation
 */
export const NAME_VALIDATION = {
  minLength: 2,
  maxLength: 50,
  pattern: /^[a-zA-Z\s'-]+$/, // Letters, spaces, hyphens, apostrophes
};

/**
 * Notes field configuration
 */
export const NOTES_CONFIG = {
  maxLength: 500,
  placeholder: 'Special instructions or requests...',
};

/**
 * Extra charges validation
 */
export const EXTRA_CHARGES_CONFIG = {
  min: 0,
  max: 10000,
  step: 0.01,
};

/**
 * ============================================================================
 * API CONFIGURATION
 * ============================================================================
 */

/**
 * API Request Timeout (milliseconds)
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Retry Configuration
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
};

/**
 * ============================================================================
 * FEATURE FLAGS
 * ============================================================================
 */

/**
 * Enable/disable features
 */
export const FEATURES = {
  enableAutoRefresh: true,
  enableNotifications: true,
  enableCharts: true,
  enableExtraCharges: true,
  enableNotes: true,
  showCompletedOrders: true,
  enablePrintReceipt: false, // Future feature
  enableOrderEditing: false, // Future feature
};

/**
 * ============================================================================
 * DEVELOPMENT CONFIGURATION
 * ============================================================================
 */

/**
 * Debug mode
 * Set to true to enable console logging
 */
export const DEBUG_MODE = true;

/**
 * Demo data
 * Set to true to populate with sample orders on first load
 */
export const ENABLE_DEMO_DATA = false;

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
  }).format(amount);
};

/**
 * Calculate service charge
 */
export const calculateServiceCharge = (
  subtotal: number,
  pickupType: string
): number => {
  return pickupType === PICKUP_TYPES.DINE_IN ? subtotal * SERVICE_CHARGE_RATE : 0;
};

/**
 * Calculate tax
 */
export const calculateTax = (amount: number): number => {
  return amount * TAX_RATE;
};

/**
 * Calculate total
 */
export const calculateTotal = (
  subtotal: number,
  pickupType: string,
  extraCharges: number = 0
): number => {
  const serviceCharge = calculateServiceCharge(subtotal, pickupType);
  const tax = calculateTax(subtotal);
  return subtotal + serviceCharge + tax + extraCharges;
};

/**
 * Log debug message
 */
export const debugLog = (message: string, data?: any): void => {
  if (DEBUG_MODE) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

/**
 * Export default configuration
 */
export default {
  MENU_ITEMS,
  SERVICE_CHARGE_RATE,
  PICKUP_TYPES,
  ORDER_STATUS,
  AUTO_REFRESH_INTERVAL,
  RESTAURANT_INFO,
  FEATURES,
  formatCurrency,
  calculateServiceCharge,
  calculateTotal,
  debugLog,
};
