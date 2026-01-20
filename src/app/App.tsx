/**
 * Restaurant Order Dashboard System
 * Main application entry point with routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from '@/app/components/HomePage';
import PlaceOrderPage from '@/app/components/PlaceOrderPage';
import DashboardPage from '@/app/components/DashboardPage';

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/place-order" element={<PlaceOrderPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </>
  );
}