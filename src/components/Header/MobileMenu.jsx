import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store';
import { categories } from '../../constants';

const MobileMenu = () => {
  const { setShowMobileMenu } = useUIStore();

  return (
    <div className="lg:hidden bg-white border-t border-light shadow-soft-lg">
      <nav className="container mx-auto px-4 py-4 space-y-3">
        <Link
          to="/"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Home
        </Link>
        <Link
          to="/medicines"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Medicines
        </Link>
        <Link
          to="/ayurvedic"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Ayurvedic
        </Link>
        <Link
          to="/wellness"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Wellness
        </Link>
        <Link
          to="/offers"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Offers
        </Link>
        <Link
          to="/health-info"
          onClick={() => setShowMobileMenu(false)}
          className="block py-2 text-dark hover:text-primary font-medium"
        >
          Health Information
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;