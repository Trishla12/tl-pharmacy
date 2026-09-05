import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../../store';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlistItem = isInWishlist(product.productId);

  const handleWishlist = () => {
    if (wishlistItem) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const finalPrice = calculateDiscount(product.price, product.discount);
  const discountPercent = Math.round((product.discount || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative h-64 bg-light overflow-hidden group">
        <Link to={`/product/${product.productId}`}>
          <motion.img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
          />
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-error text-white px-3 py-1 rounded-full text-sm font-bold"
          >
            {discountPercent}% OFF
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-300 ${
            wishlistItem
              ? 'bg-error text-white'
              : 'bg-white text-dark hover:bg-primary-light'
          }`}
        >
          <Heart size={20} fill={wishlistItem ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Stock Status */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <p className={`text-xs font-semibold ${
            product.stock > 10
              ? 'text-success'
              : product.stock > 0
              ? 'text-warning'
              : 'text-error'
          }`}>
            {product.stock > 10
              ? '✓ In Stock'
              : product.stock > 0
              ? `Only ${product.stock} left`
              : 'Out of Stock'}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-primary font-semibold uppercase tracking-wider">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product.productId}`}>
          <h3 className="font-bold text-dark mt-1 line-clamp-2 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        <p className="text-sm text-secondary mt-1">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-warning">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-xs text-secondary ml-1">({product.reviewCount || 0})</span>
        </div>

        {/* Price Section */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-dark">
            {formatPrice(finalPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-secondary line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock > 0
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-light text-secondary cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>

        {/* Prescription Badge */}
        {product.prescriptionRequired && (
          <p className="text-xs text-error font-semibold mt-2 text-center">
            ⚕️ Prescription Required
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;