import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Check, X } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../../store';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlistItem = isInWishlist(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlist = () => {
    if (wishlistItem) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin">
          <div className="skeleton w-full h-96 rounded-2xl mb-4"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  const finalPrice = calculateDiscount(product.price, product.discount);
  const discountPercent = Math.round((product.discount || 0));
  const savings = product.price - finalPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-primary hover:text-primary-dark mb-6 font-medium"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-light rounded-2xl overflow-hidden mb-4">
            <motion.img
              key={selectedImage}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={product.imageUrl || 'https://via.placeholder.com/600x600'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category & Brand */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-primary font-bold uppercase">{product.category}</span>
            <span className="text-sm text-secondary">{product.brand}</span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-dark mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-warning">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-secondary">({product.reviewCount || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="bg-primary-light p-4 rounded-xl mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-dark">{formatPrice(finalPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-secondary line-through">{formatPrice(product.price)}</span>
                  <span className="text-lg font-bold text-error">{discountPercent}% OFF</span>
                </>
              )}
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-success font-semibold">You save {formatPrice(savings)}</p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <Check size={20} className="text-success" />
                <span className="text-success font-semibold">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                </span>
              </>
            ) : (
              <>
                <X size={20} className="text-error" />
                <span className="text-error font-semibold">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">Quantity</label>
              <div className="flex items-center border border-light rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-light transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-16 text-center border-l border-r border-light outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-light transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="inline mr-2" size={20} />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWishlist}
              className={`btn-outline ${
                wishlistItem
                  ? 'bg-error text-white border-error'
                  : ''
              }`}
            >
              <Heart size={20} fill={wishlistItem ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline"
            >
              <Share2 size={20} />
            </motion.button>
          </div>

          {/* Prescription Required */}
          {product.prescriptionRequired && (
            <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-3 mb-6">
              <p className="text-warning font-semibold text-sm">⚕️ Prescription Required</p>
              <p className="text-xs text-dark mt-1">This product requires a valid prescription for purchase</p>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-dark mb-2">Manufacturer</h3>
              <p className="text-secondary text-sm">{product.manufacturer}</p>
            </div>
            <div>
              <h3 className="font-bold text-dark mb-2">Pack Size</h3>
              <p className="text-secondary text-sm">{product.packSize}</p>
            </div>
            {product.storageInformation && (
              <div>
                <h3 className="font-bold text-dark mb-2">Storage Information</h3>
                <p className="text-secondary text-sm">{product.storageInformation}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Description & Ingredients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="bg-light rounded-2xl p-6">
          <h3 className="text-xl font-bold text-dark mb-4">Description</h3>
          <p className="text-secondary text-sm leading-relaxed">{product.description}</p>
        </div>

        {product.ingredients && (
          <div className="bg-light rounded-2xl p-6">
            <h3 className="text-xl font-bold text-dark mb-4">Ingredients</h3>
            <p className="text-secondary text-sm">{product.ingredients}</p>
          </div>
        )}
      </motion.div>

      {/* Safety Information */}
      {product.safetyInformation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 bg-warning bg-opacity-5 border border-warning border-opacity-30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-dark mb-3">⚠️ Important Safety Information</h3>
          <p className="text-secondary text-sm">{product.safetyInformation}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;