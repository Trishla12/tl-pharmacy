import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import AIAssistant from './components/AIAssistant/AIAssistant';
import { useUIStore } from './store';

// Pages
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetail from './components/Products/ProductDetail';
import Checkout from './components/Checkout/Checkout';
import OrderConfirmation from './components/Checkout/OrderConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const { initializeAuth } = useAuthStore();
  const { showCart } = useUIStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Header />
      <main className="min-h-screen bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/ayurvedic" element={<Medicines />} />
          <Route path="/wellness" element={<Medicines />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      {showCart && <Cart />}
      <AIAssistant />
    </Router>
  );
}

export default App;