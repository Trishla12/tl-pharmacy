import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Pill } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../../store';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { setShowCart, setShowMobileMenu, showMobileMenu } = useUIStore();

  const cartCount = items.length;

  return (
    <>
      <header className="bg-white shadow-soft sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-primary text-white py-2 px-4 sm:px-6 text-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div>Free delivery on orders above ₹500</div>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition">Track Order</a>
              <a href="#" className="hover:opacity-80 transition">Help</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Pill className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-dark text-lg">TL PHARMACY</div>
                <div className="text-xs text-primary">Your Health, Our Priority</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 ml-8">
              <Link to="/" className="text-dark hover:text-primary transition font-medium">Home</Link>
              <Link to="/medicines" className="text-dark hover:text-primary transition font-medium">Medicines</Link>
              <Link to="/ayurvedic" className="text-dark hover:text-primary transition font-medium">Ayurvedic</Link>
              <Link to="/wellness" className="text-dark hover:text-primary transition font-medium">Wellness</Link>
              <Link to="/offers" className="text-dark hover:text-primary transition font-medium">Offers</Link>
              <Link to="/health-info" className="text-dark hover:text-primary transition font-medium">Health Info</Link>
            </nav>

            {/* Search Bar */}
            <div className={`hidden md:flex flex-1 max-w-md mx-4 bg-light rounded-xl px-4 py-2 transition ${
              isSearchFocused ? 'ring-2 ring-primary' : ''
            }`}>
              <Search size={20} className="text-primary" />
              <input
                type="text"
                placeholder="Search medicines, brands..."
                className="bg-transparent ml-2 w-full outline-none text-dark text-sm"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* AI Assistant */}
              <button
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-secondary text-dark rounded-lg hover:bg-accent transition font-medium text-sm"
                title="AI Assistant"
              >
                <span>🤖</span>
                <span className="hidden md:inline">AI</span>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 hover:bg-light rounded-lg transition relative"
              >
                <Heart size={20} className="text-dark" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="p-2 hover:bg-light rounded-lg transition relative"
              >
                <ShoppingCart size={20} className="text-dark" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              {user ? (
                <Link
                  to="/account"
                  className="p-2 hover:bg-light rounded-lg transition"
                >
                  <User size={20} className="text-dark" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-light rounded-lg transition"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4 flex bg-light rounded-xl px-4 py-2">
            <Search size={20} className="text-primary" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="bg-transparent ml-2 w-full outline-none text-dark text-sm"
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && <MobileMenu />}
    </>
  );
};

export default Header;