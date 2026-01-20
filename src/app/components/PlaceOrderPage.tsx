/**
 * PLACE ORDER PAGE
 * Purpose: Create new customer orders with live price calculation
 * Features:
 * - Customer information form
 * - Pickup type selection (Dine-In / Take-Out)
 * - Food items with quantity controls
 * - Live total price calculation
 * - Service charge for Dine-In orders (10%)
 * - Extra charges and notes
 * - Form validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey } from '@/app/lib/supabase';
import { toast } from 'sonner';

// Predefined food menu items
const MENU_ITEMS = [
  { name: 'Margherita Pizza', price: 12.99 },
  { name: 'Pepperoni Pizza', price: 14.99 },
  { name: 'Caesar Salad', price: 8.99 },
  { name: 'Pasta Carbonara', price: 13.99 },
  { name: 'Grilled Chicken', price: 15.99 },
  { name: 'Beef Burger', price: 11.99 },
  { name: 'Fish & Chips', price: 14.49 },
  { name: 'Vegetable Stir Fry', price: 10.99 },
  { name: 'Garlic Bread', price: 5.99 },
  { name: 'French Fries', price: 4.99 },
];

const SERVICE_CHARGE_RATE = 0.10; // 10% service charge for Dine-In

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pickupType, setPickupType] = useState<'Dine-In' | 'Take-Out'>('Dine-In');
  const [extraCharges, setExtraCharges] = useState('0');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Item quantities
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    MENU_ITEMS.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  );

  /**
   * Calculate subtotal from all items
   */
  const calculateSubtotal = (): number => {
    return MENU_ITEMS.reduce((sum, item) => {
      return sum + (item.price * (quantities[item.name] || 0));
    }, 0);
  };

  /**
   * Calculate service charge (10% for Dine-In only)
   */
  const calculateServiceCharge = (): number => {
    if (pickupType === 'Dine-In') {
      return calculateSubtotal() * SERVICE_CHARGE_RATE;
    }
    return 0;
  };

  /**
   * Calculate total price
   * Formula: (Item Price × Quantity) + Service Charge + Extra Charges
   */
  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const serviceCharge = calculateServiceCharge();
    const extra = parseFloat(extraCharges) || 0;
    return subtotal + serviceCharge + extra;
  };

  /**
   * Increment item quantity
   */
  const incrementQuantity = (itemName: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1
    }));
  };

  /**
   * Decrement item quantity (minimum = 0)
   */
  const decrementQuantity = (itemName: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(0, (prev[itemName] || 0) - 1)
    }));
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): { valid: boolean; error?: string } => {
    if (!firstName.trim()) {
      return { valid: false, error: 'First name is required' };
    }
    if (!lastName.trim()) {
      return { valid: false, error: 'Last name is required' };
    }
    
    const hasItems = Object.values(quantities).some(qty => qty > 0);
    if (!hasItems) {
      return { valid: false, error: 'Please select at least one item' };
    }
    
    const extraChargesNum = parseFloat(extraCharges);
    if (isNaN(extraChargesNum) || extraChargesNum < 0) {
      return { valid: false, error: 'Extra charges must be a valid positive number' };
    }
    
    return { valid: true };
  };

  /**
   * Submit order to backend
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order items (only items with quantity > 0)
      const items = MENU_ITEMS
        .filter(item => quantities[item.name] > 0)
        .map(item => ({
          name: item.name,
          price: item.price,
          quantity: quantities[item.name]
        }));
      
      const endpoint = `${supabaseUrl}/functions/v1/make-server-5c1c75e3/orders`;
      console.log('Sending order to:', endpoint);
      console.log('Request body:', {
        customer_first_name: firstName,
        customer_last_name: lastName,
        pickup_type: pickupType,
        items,
        extra_charges: parseFloat(extraCharges),
        notes
      });
      
      // Send order to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          customer_first_name: firstName,
          customer_last_name: lastName,
          pickup_type: pickupType,
          items,
          extra_charges: parseFloat(extraCharges),
          notes
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('Order created successfully:', data);
      
      toast.success('Order placed successfully!');
      
      // Reset form
      setFirstName('');
      setLastName('');
      setPickupType('Dine-In');
      setExtraCharges('0');
      setNotes('');
      setQuantities(MENU_ITEMS.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {}));
      
      // Navigate to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
            Place New Order
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Customer Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pickup Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                Pickup Type
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPickupType('Dine-In')}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    pickupType === 'Dine-In'
                      ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  🍽️ Dine-In
                  {pickupType === 'Dine-In' && (
                    <div className="text-xs mt-1 text-blue-500">+10% service charge</div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setPickupType('Take-Out')}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    pickupType === 'Take-Out'
                      ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  🥡 Take-Out
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                Select Food Items
              </h2>
              
              <div className="space-y-3">
                {MENU_ITEMS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementQuantity(item.name)}
                        className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantities[item.name] === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-lg text-slate-900">
                        {quantities[item.name] || 0}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => incrementQuantity(item.name)}
                        className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                Additional Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Extra Charges ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={extraCharges}
                    onChange={(e) => setExtraCharges(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Special instructions or requests..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {/* Customer Info */}
                <div className="pb-3 border-b border-slate-200">
                  <p className="text-sm text-slate-600">Customer</p>
                  <p className="font-semibold text-slate-900">
                    {firstName && lastName ? `${firstName} ${lastName}` : 'Not specified'}
                  </p>
                </div>
                
                {/* Pickup Type */}
                <div className="pb-3 border-b border-slate-200">
                  <p className="text-sm text-slate-600">Pickup Type</p>
                  <p className="font-semibold text-slate-900">{pickupType}</p>
                </div>
                
                {/* Selected Items */}
                <div className="pb-3 border-b border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Selected Items</p>
                  {Object.entries(quantities)
                    .filter(([_, qty]) => qty > 0)
                    .map(([name, qty]) => {
                      const item = MENU_ITEMS.find(i => i.name === name);
                      return (
                        <div key={name} className="flex justify-between text-sm mb-1">
                          <span className="text-slate-900">
                            {qty}× {name}
                          </span>
                          <span className="font-semibold text-slate-900">
                            ${(item!.price * qty).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  {Object.values(quantities).every(qty => qty === 0) && (
                    <p className="text-sm text-slate-400 italic">No items selected</p>
                  )}
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {pickupType === 'Dine-In' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Service Charge (10%):</span>
                    <span className="font-semibold">${calculateServiceCharge().toFixed(2)}</span>
                  </div>
                )}
                
                {parseFloat(extraCharges) > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Extra Charges:</span>
                    <span className="font-semibold">${parseFloat(extraCharges).toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-slate-900">Total:</span>
                <span className="text-3xl font-bold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
