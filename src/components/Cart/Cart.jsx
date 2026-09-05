import React from 'react';
import { useCartStore, useUIStore } from '../../store';
import { formatPrice } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { setShowCart } = useUIStore();

  const deliveryCharge = items.length > 0 ? (total > 500 ? 0 : 50) : 0;
  const finalTotal = total + deliveryCharge;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setShowCart(false)}
    >
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-soft-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-light">
          <h2 className="text-2xl font-bold text-dark">Shopping Cart</h2>
          <button
            onClick={() => setShowCart(false)}
            className="p-2 hover:bg-light rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-secondary text-lg font-medium">Your cart is empty</p>
                <p className="text-secondary text-sm mt-2">Add products to get started</p>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 bg-light rounded-xl p-3"
                >
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-dark text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-secondary">{item.brand}</p>
                    <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 hover:bg-white rounded transition text-error"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        {items.length > 0 && <div className="border-b border-light"></div>}

        {/* Summary */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-3"
          >
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-semibold text-dark">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Delivery</span>
              <span className="font-semibold text-dark">
                {deliveryCharge === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatPrice(deliveryCharge)
                )}
              </span>
            </div>
            {total > 0 && total <= 500 && (
              <p className="text-xs text-warning font-medium">
                Add {formatPrice(500 - total)} more for free delivery
              </p>
            )}
            <div className="border-t border-light pt-3 flex justify-between">
              <span className="font-bold text-dark">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-3 border-t border-light"
          >
            <Link
              to="/checkout"
              onClick={() => setShowCart(false)}
              className="w-full btn-primary text-center"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setShowCart(false)}
              className="w-full btn-secondary text-center"
            >
              Continue Shopping
            </button>
            <button
              onClick={clearCart}
              className="w-full btn-outline text-error border-error text-center"
            >
              Clear Cart
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Cart;