import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store';
import { formatPrice } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { paymentMethods } from '../../constants';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
  });

  const deliveryCharge = total > 500 ? 0 : 50;
  const finalTotal = total + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = () => {
    // Generate order ID
    const orderId = 'TLP' + Date.now();
    // Store order in Firestore
    // For now, clear cart and show success
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">Cart is Empty</h2>
        <button
          onClick={() => navigate('/medicines')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          {[
            { step: 1, label: 'Delivery' },
            { step: 2, label: 'Summary' },
            { step: 3, label: 'Payment' },
            { step: 4, label: 'Confirm' },
          ].map((item) => (
            <motion.div
              key={item.step}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  step >= item.step
                    ? 'bg-primary text-white'
                    : 'bg-light text-secondary'
                }`}
              >
                {step > item.step ? <Check size={20} /> : item.step}
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-dark">{item.label}</p>
              </div>
              {item.step < 4 && (
                <div
                  className={`hidden sm:block h-1 w-12 mx-2 transition ${
                    step > item.step ? 'bg-primary' : 'bg-light'
                  }`}
                ></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-soft"
          >
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-dark mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <textarea
                  name="address"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Order Summary */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-6">Order Summary</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between p-3 bg-light rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{item.name}</p>
                        <p className="text-sm text-secondary">{item.brand} x {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-6">Choose Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === method.id
                          ? 'border-primary bg-primary-light'
                          : 'border-light hover:border-primary'
                      }"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="ml-3 text-2xl">{method.icon}</span>
                      <span className="ml-3 font-semibold text-dark">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-6">Confirm Order</h2>
                <div className="space-y-4">
                  <div className="bg-primary-light rounded-lg p-4">
                    <p className="text-sm text-secondary mb-2">Delivery Address</p>
                    <p className="font-semibold text-dark">{formData.fullName}</p>
                    <p className="text-sm text-dark">{formData.address}</p>
                    <p className="text-sm text-dark">{formData.city}, {formData.state} {formData.pincode}</p>
                  </div>
                  <div className="bg-primary-light rounded-lg p-4">
                    <p className="text-sm text-secondary mb-2">Payment Method</p>
                    <p className="font-semibold text-dark">
                      {paymentMethods.find((m) => m.id === formData.paymentMethod)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrev}
                className="btn-outline"
              >
                Back
              </motion.button>
            )}
            {step < 4 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </motion.button>
            )}
            {step === 4 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                className="flex-1 btn-primary"
              >
                Place Order
              </motion.button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-light rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-dark mb-4">Order Total</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Delivery Charge</span>
                <span className="font-semibold">
                  {deliveryCharge === 0 ? <span className="text-success">Free</span> : formatPrice(deliveryCharge)}
                </span>
              </div>
            </div>
            <div className="border-t border-secondary border-opacity-30 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-dark">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <div className="mt-6 text-xs text-secondary space-y-1">
              <p>✓ Secure Payment</p>
              <p>✓ 100% Authentic Products</p>
              <p>✓ Easy Returns</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;