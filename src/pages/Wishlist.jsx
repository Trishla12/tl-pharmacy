import React from 'react';
import { useWishlistStore } from '../../store';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/Products/ProductCard';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlistStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-dark mb-8">Wishlist</h1>

      {items.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {items.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Heart size={64} className="text-primary opacity-30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Your wishlist is empty</h2>
          <p className="text-secondary mb-8">Save products you love to your wishlist</p>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;