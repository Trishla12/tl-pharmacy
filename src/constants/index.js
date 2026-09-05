export const categories = {
  allopathic: [
    { id: 'generic', label: 'Generic Medicines', icon: '💊' },
    { id: 'pain-relief', label: 'Pain Relief', icon: '🩹' },
    { id: 'fever-cold', label: 'Fever & Cold', icon: '🌡️' },
    { id: 'cough-respiratory', label: 'Cough & Respiratory', icon: '🫁' },
    { id: 'digestive', label: 'Digestive Care', icon: '🔄' },
    { id: 'vitamins', label: 'Vitamins & Supplements', icon: '🥤' },
    { id: 'diabetes', label: 'Diabetes Care', icon: '🩺' },
    { id: 'bp', label: 'Blood Pressure Care', icon: '❤️' },
    { id: 'skin', label: 'Skin Care', icon: '✨' },
    { id: 'allergy', label: 'Allergy Care', icon: '🤧' },
    { id: 'womens', label: "Women's Health", icon: '👩' },
    { id: 'mens', label: "Men's Health", icon: '👨' },
  ],
  ayurvedic: [
    { id: 'ayurvedic-medicines', label: 'Ayurvedic Medicines', icon: '🌿' },
    { id: 'herbal', label: 'Herbal Products', icon: '🪴' },
    { id: 'immunity', label: 'Immunity', icon: '💪' },
    { id: 'digestive-wellness', label: 'Digestive Wellness', icon: '🌾' },
    { id: 'hair-care', label: 'Hair Care', icon: '💇' },
    { id: 'skin-wellness', label: 'Skin Care', icon: '🌸' },
    { id: 'joint-care', label: 'Joint Care', icon: '🦴' },
    { id: 'stress-sleep', label: 'Stress & Sleep Wellness', icon: '😴' },
  ],
  wellness: [
    { id: 'personal-care', label: 'Personal Care', icon: '🧴' },
    { id: 'oral-care', label: 'Oral Care', icon: '🦷' },
    { id: 'baby-care', label: 'Baby Care', icon: '👶' },
    { id: 'hygiene', label: 'Hygiene', icon: '🧼' },
    { id: 'first-aid', label: 'First Aid', icon: '⚕️' },
    { id: 'health-devices', label: 'Health Devices', icon: '📱' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
    { id: 'fitness', label: 'Fitness & Wellness', icon: '🏃' },
  ],
};

export const priceRanges = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 - ₹500', min: 100, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: Infinity },
];

export const sortOptions = [
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Best Rated' },
];

export const paymentMethods = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📲' },
  { id: 'wallet', label: 'Digital Wallet', icon: '👛' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export const trackingStages = [
  { id: 'placed', label: 'Order Placed', icon: '✓' },
  { id: 'confirmed', label: 'Payment Confirmed', icon: '✓' },
  { id: 'preparing', label: 'Preparing', icon: '📦' },
  { id: 'shipped', label: 'Out for Delivery', icon: '🚚' },
  { id: 'delivered', label: 'Delivered', icon: '✓' },
];