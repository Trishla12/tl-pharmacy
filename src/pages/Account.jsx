import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag, MapPin, Bell, Settings } from 'lucide-react';
import { trackingStages } from '../../constants';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders] = useState([
    {
      id: 'TLP1725545600123',
      date: '2026-09-05',
      total: 1250,
      status: 'delivered',
      items: 2,
      products: [
        { name: 'Aspirin 500mg', quantity: 1, price: 650 },
        { name: 'Vitamin C Tablets', quantity: 1, price: 600 },
      ],
    },
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">Please log in to view your account</h2>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-soft p-6">
            {/* User Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-dark text-center">{user.email}</p>
            </div>

            {/* Navigation */}
            <div className="space-y-2 mb-8">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 8 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-dark hover:bg-light'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error bg-opacity-10 text-error rounded-lg hover:bg-opacity-20 transition font-semibold"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="lg:col-span-3"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-light rounded-lg bg-light text-dark"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-soft p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-dark">Order ID: {order.id}</h3>
                        <p className="text-sm text-secondary">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">₹{order.total}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-success bg-opacity-10 text-success'
                            : 'bg-warning bg-opacity-10 text-warning'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-light">
                      {order.products.map((product, i) => (
                        <p key={i} className="text-sm text-dark">
                          {product.quantity}x {product.name} - ₹{product.price}
                        </p>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-dark mb-3">Order Progress</p>
                      <div className="flex gap-2 text-xs">
                        {trackingStages.map((stage, index) => (
                          <div key={stage.id} className="flex-1 text-center">
                            <div className={`h-2 rounded-full mb-1 ${
                              index <= 4 ? 'bg-success' : 'bg-light'
                            }`}></div>
                            <span className="text-xs text-secondary">{stage.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <ShoppingBag size={48} className="text-secondary opacity-30 mx-auto mb-4" />
                  <p className="text-secondary">No orders yet</p>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Saved Addresses</h2>
              <p className="text-secondary">No saved addresses. Add one during checkout.</p>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Notifications</h2>
              <p className="text-secondary">No new notifications</p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  <span className="text-dark">Email notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  <span className="text-dark">Order updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-primary" />
                  <span className="text-dark">Promotional emails</span>
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Account;