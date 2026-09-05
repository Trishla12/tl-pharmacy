import { create } from 'zustand';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => ({
  user: null,
  userRole: 'customer',
  loading: true,
  error: null,

  register: async (email, password, userData) => {
    try {
      set({ error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email,
        ...userData,
        createdAt: new Date(),
        role: 'customer',
      });
      
      set({ user: result.user, userRole: 'customer' });
      return result.user;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      set({ error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'customer';
      
      set({ user: result.user, userRole: role });
      return result.user;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, userRole: 'customer' });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  initializeAuth: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const role = userDoc.exists() ? userDoc.data().role : 'customer';
          set({ user, userRole: role, loading: false });
        } else {
          set({ user: null, userRole: 'customer', loading: false });
        }
        resolve(user);
      });
      return unsubscribe;
    });
  },
}));

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.productId);
      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.productId !== productId);
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: newTotal };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: newItems, total: newTotal };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));

export const useWishlistStore = create((set) => ({
  items: [],

  addToWishlist: (product) => {
    set((state) => ({
      items: state.items.some((item) => item.productId === product.productId)
        ? state.items
        : [...state.items, product],
    }));
  },

  removeFromWishlist: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some((item) => item.productId === productId);
  },
}));

export const useUIStore = create((set) => ({
  showCart: false,
  showAssistant: false,
  showMobileMenu: false,
  toasts: [],

  setShowCart: (value) => set({ showCart: value }),
  setShowAssistant: (value) => set({ showAssistant: value }),
  setShowMobileMenu: (value) => set({ showMobileMenu: value }),

  addToast: (toast) => {
    const id = Math.random();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
}));