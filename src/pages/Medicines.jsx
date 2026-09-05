import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProductCard from '../../components/Products/ProductCard';
import ProductSkeleton from '../../components/Products/ProductSkeleton';
import { Filter, X } from 'lucide-react';
import { categories, priceRanges, sortOptions } from '../../constants';

const Medicines = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        setFilteredProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price filter
    if (selectedPrice) {
      const range = priceRanges.find((r) => r.label === selectedPrice);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.brand?.toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedPrice, selectedBrand, selectedSort, searchTerm, products]);

  const uniqueBrands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-dark mb-8">Medicines</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 ${
            showFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto' : 'hidden lg:block'
          }`}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-dark">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-light rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark mb-3">Category</label>
            <div className="space-y-2">
              {categories.allopathic.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-dark">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark mb-3">Price Range</label>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={range.label}
                    checked={selectedPrice === range.label}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-dark">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark mb-3">Brand</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uniqueBrands.filter(Boolean).map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e.target.checked ? brand : '')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-dark">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedPrice || selectedBrand || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedPrice('');
                setSelectedBrand('');
                setSearchTerm('');
              }}
              className="w-full btn-outline text-error border-error"
            >
              Clear All Filters
            </button>
          )}
        </motion.div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="text-sm text-secondary">
              Showing <span className="font-bold text-dark">{filteredProducts.length}</span> products
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary flex items-center gap-2"
              >
                <Filter size={18} />
                Filters
              </button>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl text-secondary font-medium">No products found</p>
              <p className="text-sm text-secondary mt-2">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicines;