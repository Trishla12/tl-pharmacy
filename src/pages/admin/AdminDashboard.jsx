import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Image } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Allopathic',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: '',
    description: '',
    manufacturer: '',
    packSize: '',
    rating: 4.5,
    reviewCount: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!user || userRole !== 'admin') {
      navigate('/login');
    }
  }, [user, userRole, navigate]);

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
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';

      if (imageFile) {
        const storageRef = ref(storage, `products/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editingId) {
        // Update product
        await updateDoc(doc(db, 'products', editingId), {
          ...formData,
          imageUrl,
          updatedAt: new Date(),
        });
        setEditingId(null);
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...formData,
          imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Reset form
      setFormData({
        name: '',
        brand: '',
        category: 'Allopathic',
        price: '',
        originalPrice: '',
        discount: 0,
        stock: '',
        description: '',
        manufacturer: '',
        packSize: '',
        rating: 4.5,
        reviewCount: 0,
      });
      setImageFile(null);

      // Refresh products
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      stock: product.stock,
      description: product.description,
      manufacturer: product.manufacturer,
      packSize: product.packSize,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
    setEditingId(product.productId);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-white shadow-soft p-6 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
          <button
            onClick={() => logout()}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-light">
          {['products', 'inventory', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition border-b-4 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-dark'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-soft h-fit sticky top-24"
            >
              <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                <Plus size={24} />
                {editingId ? 'Edit' : 'Add'} Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                />
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="Allopathic">Allopathic</option>
                  <option value="Ayurvedic">Ayurvedic</option>
                  <option value="Wellness">Wellness</option>
                </select>
                <input
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                />
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="Original Price"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  type="number"
                  name="discount"
                  placeholder="Discount %"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="Manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  type="text"
                  name="packSize"
                  placeholder="Pack Size"
                  value={formData.packSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <label className="flex items-center gap-2 px-3 py-2 border border-light rounded-lg cursor-pointer hover:bg-light transition">
                  <Image size={18} className="text-primary" />
                  <span className="text-sm text-secondary">{imageFile?.name || 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </motion.button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: '',
                        brand: '',
                        category: 'Allopathic',
                        price: '',
                        originalPrice: '',
                        discount: 0,
                        stock: '',
                        description: '',
                        manufacturer: '',
                        packSize: '',
                        rating: 4.5,
                        reviewCount: 0,
                      });
                    }}
                    className="w-full btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </motion.div>

            {/* Products List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-light border-b border-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Product</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <motion.tr
                          key={product.productId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-light hover:bg-light transition"
                        >
                          <td className="px-6 py-4 text-sm text-dark font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-dark">₹{product.price}</td>
                          <td className="px-6 py-4 text-sm text-dark">{product.stock}</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditProduct(product)}
                              className="p-2 bg-warning bg-opacity-10 text-warning rounded-lg hover:bg-opacity-20 transition"
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteProduct(product.productId)}
                              className="p-2 bg-error bg-opacity-10 text-error rounded-lg hover:bg-opacity-20 transition"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {(activeTab === 'inventory' || activeTab === 'orders') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center shadow-soft"
          >
            <p className="text-secondary text-lg">Coming soon...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;