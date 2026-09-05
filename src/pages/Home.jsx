import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ProductCard from '../Products/ProductCard';
import ProductSkeleton from '../Products/ProductSkeleton';
import { ArrowRight, Zap, Leaf, Heart, Shield, Truck, Clock } from 'lucide-react';
import { categories } from '../../constants';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [ayurvedic, setAyurvedic] = useState([]);
  const [generic, setGeneric] = useState([]);
  const [wellness, setWellness] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch best sellers
        const bestsellersQuery = query(
          collection(db, 'products'),
          limit(6)
        );
        const bestsellersSnap = await getDocs(bestsellersQuery);
        setBestSellers(bestsellersSnap.docs.map((doc) => ({ productId: doc.id, ...doc.data() })));

        // Fetch ayurvedic
        const ayurvedicQuery = query(
          collection(db, 'products'),
          where('category', '==', 'Ayurvedic'),
          limit(6)
        );
        const ayurvedicSnap = await getDocs(ayurvedicQuery);
        setAyurvedic(ayurvedicSnap.docs.map((doc) => ({ productId: doc.id, ...doc.data() })));

        // Fetch generic
        const genericQuery = query(
          collection(db, 'products'),
          where('category', '==', 'Allopathic'),
          limit(6)
        );
        const genericSnap = await getDocs(genericQuery);
        setGeneric(genericSnap.docs.map((doc) => ({ productId: doc.id, ...doc.data() })));

        // Fetch wellness
        const wellnessQuery = query(
          collection(db, 'products'),
          where('category', '==', 'Wellness'),
          limit(6)
        );
        const wellnessSnap = await getDocs(wellnessQuery);
        setWellness(wellnessSnap.docs.map((doc) => ({ productId: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-light to-secondary py-12 sm:py-20 px-4 sm:px-6"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-4 leading-tight">
              Your Health, Our Priority
            </h1>
            <p className="text-lg sm:text-xl text-secondary mb-8 max-w-2xl">
              Allopathic & Ayurvedic healthcare products at your fingertips. Trusted, authentic, and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/medicines" className="btn-primary inline-flex items-center gap-2">
                  Shop Medicines
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/ayurvedic" className="btn-outline inline-flex items-center gap-2">
                  Explore Ayurveda
                  <Leaf size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6 bg-white"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="flex bg-light rounded-2xl px-4 py-3 items-center gap-3">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search medicines, brands, wellness products..."
              className="flex-1 bg-transparent outline-none text-dark placeholder-secondary"
            />
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-8">Shop by Category</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.allopathic.slice(0, 6).map((cat) => (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/medicines?category=${cat.id}`}
                  className="bg-white p-6 rounded-2xl text-center hover:shadow-soft-lg transition group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition">{cat.icon}</div>
                  <p className="font-semibold text-dark text-sm">{cat.label}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Best Sellers */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6 bg-light"
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-dark">Best Sellers</h2>
            <Link to="/medicines" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {bestSellers.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Ayurvedic Products */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6"
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-dark">Ayurvedic Products</h2>
            <Link to="/ayurvedic" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1">
              Explore <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {ayurvedic.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6 bg-primary-light"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Why Choose TL Pharmacy</h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            {[
              { icon: Shield, label: 'Trusted Products', desc: '100% authentic & verified' },
              { icon: Zap, label: 'Easy Ordering', desc: 'Simple & fast checkout' },
              { icon: Clock, label: 'Quick Delivery', desc: 'Fast delivery to your door' },
              { icon: Heart, label: 'Customer Care', desc: '24/7 support team' },
              { icon: Truck, label: 'Easy Returns', desc: 'Hassle-free returns' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white p-6 rounded-2xl text-center shadow-soft"
              >
                <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-dark mb-2">{item.label}</h3>
                <p className="text-sm text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Wellness Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6"
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-dark">Wellness Products</h2>
            <Link to="/wellness" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1">
              Explore <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {wellness.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;