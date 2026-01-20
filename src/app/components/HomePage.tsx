/**
 * HOME PAGE
 * Purpose: Navigation hub with modern mirror-style UI
 * Features:
 * - Blue gradient background
 * - Centered layout with two main navigation buttons
 * - Clean, professional design
 */

import { useNavigate } from 'react-router-dom';
import { ChefHat, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="w-20 h-20 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Restaurant Dashboard
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Modern Order Management System
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* View Database Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-12 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-6 rounded-full mb-6 group-hover:bg-white/30 transition-colors">
                <BarChart3 className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                View Database
              </h2>
              <p className="text-blue-100 text-lg">
                Access analytics, charts, and order management
              </p>
            </div>
          </button>

          {/* Place Order Button */}
          <button
            onClick={() => navigate('/place-order')}
            className="group relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-12 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-6 rounded-full mb-6 group-hover:bg-white/30 transition-colors">
                <ChefHat className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Place an Order
              </h2>
              <p className="text-blue-100 text-lg">
                Create new customer orders with live pricing
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-blue-100/80 text-sm">
            Professional Restaurant Management System © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
