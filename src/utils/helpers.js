import { toast } from 'react-toastify';

export const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const calculateDiscount = (originalPrice, discount) => {
  if (typeof discount === 'number' && discount > 1) {
    return originalPrice - discount;
  }
  return originalPrice * (1 - (discount || 0) / 100);
};

export const getStarRating = (rating) => {
  if (!rating) return '★☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '⯨' : '') +
    '☆'.repeat(emptyStars)
  );
};

export const truncateText = (text, maxLength = 50) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/[^0-9]/g, ''));
};

export const generateOrderId = () => {
  return 'TLP' + Date.now() + Math.random().toString(36).substr(2, 9);
};