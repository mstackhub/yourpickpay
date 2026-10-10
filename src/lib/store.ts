'use client';

import { useState, useEffect } from 'react';
import { Product, Category, InstallmentPlan, WebsiteSettings } from '@/types';
import { initialCategories, initialInstallmentPlans, initialProducts, initialWebsiteSettings } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'yp_products_v2',
  CATEGORIES: 'yp_categories_v2',
  INSTALLMENT_PLANS: 'yp_plans_v2',
  SETTINGS: 'yp_settings_v3',
  ADMIN_AUTH: 'yp_admin_session_v1',
};

// Global in-memory cache for synchronous SSR / Client first render
let memoryProducts: Product[] = [...initialProducts];
let memoryCategories: Category[] = [...initialCategories];
let memoryPlans: InstallmentPlan[] = [...initialInstallmentPlans];
let memorySettings: WebsiteSettings = { ...initialWebsiteSettings };

// Helper to safely access localStorage
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event for cross-component sync
    window.dispatchEvent(new Event('yp-store-updated'));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// Service methods
export const StoreService = {
  // Sync all data from Turso DB on startup
  async syncFromDatabase(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const [prodRes, catRes, planRes, setRes] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : null),
        fetch('/api/categories').then(r => r.ok ? r.json() : null),
        fetch('/api/installments').then(r => r.ok ? r.json() : null),
        fetch('/api/settings').then(r => r.ok ? r.json() : null),
      ]);

      if (prodRes && Array.isArray(prodRes) && prodRes.length > 0) {
        memoryProducts = prodRes;
        setLocalItem(STORAGE_KEYS.PRODUCTS, prodRes);
      }
      if (catRes && Array.isArray(catRes) && catRes.length > 0) {
        memoryCategories = catRes;
        setLocalItem(STORAGE_KEYS.CATEGORIES, catRes);
      }
      if (planRes && Array.isArray(planRes) && planRes.length > 0) {
        memoryPlans = planRes;
        setLocalItem(STORAGE_KEYS.INSTALLMENT_PLANS, planRes);
      }
      if (setRes && setRes.store_name) {
        memorySettings = setRes;
        setLocalItem(STORAGE_KEYS.SETTINGS, setRes);
      }
    } catch (e) {
      console.error('Error syncing from database:', e);
    }
  },

  // PRODUCTS
  getProducts(): Product[] {
    if (typeof window === 'undefined') return memoryProducts;
    const local = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
    memoryProducts = local;
    return local;
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    let updated: Product[];
    
    const savedProduct: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...products];
      updated[index] = savedProduct;
    } else {
      updated = [savedProduct, ...products];
    }
    
    memoryProducts = updated;
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);

    // Sync to Turso API
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedProduct),
    }).catch(err => console.error('Turso product sync error:', err));

    return savedProduct;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== id);
    memoryProducts = updated;
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);

    // Sync to Turso API
    fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    }).catch(err => console.error('Turso product delete error:', err));
  },

  // CATEGORIES
  getCategories(): Category[] {
    if (typeof window === 'undefined') return memoryCategories;
    const local = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
    memoryCategories = local;
    return local;
  },

  saveCategory(category: Category): Category {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    let updated: Category[];

    const savedCategory: Category = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
      created_at: category.created_at || new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...categories];
      updated[index] = savedCategory;
    } else {
      updated = [...categories, savedCategory];
    }

    memoryCategories = updated;
    setLocalItem(STORAGE_KEYS.CATEGORIES, updated);

    // Sync to Turso API
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedCategory),
    }).catch(err => console.error('Turso category sync error:', err));

    return savedCategory;
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories();
    const updated = categories.filter(c => c.id !== id);
    memoryCategories = updated;
    setLocalItem(STORAGE_KEYS.CATEGORIES, updated);

    // Sync to Turso API
    fetch(`/api/categories?id=${id}`, {
      method: 'DELETE',
    }).catch(err => console.error('Turso category delete error:', err));
  },

  // INSTALLMENT PLANS
  getInstallmentPlans(): InstallmentPlan[] {
    if (typeof window === 'undefined') return memoryPlans;
    const local = getLocalItem<InstallmentPlan[]>(STORAGE_KEYS.INSTALLMENT_PLANS, memoryPlans);
    memoryPlans = local;
    return local;
  },

  saveInstallmentPlan(plan: InstallmentPlan): InstallmentPlan {
    const plans = this.getInstallmentPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    let updated: InstallmentPlan[];

    const savedPlan: InstallmentPlan = {
      ...plan,
      id: plan.id || `plan-${Date.now()}`,
      created_at: plan.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...plans];
      updated[index] = savedPlan;
    } else {
      updated = [...plans, savedPlan];
    }

    memoryPlans = updated;
    setLocalItem(STORAGE_KEYS.INSTALLMENT_PLANS, updated);

    // Sync to Turso API
    fetch('/api/installments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedPlan),
    }).catch(err => console.error('Turso plan sync error:', err));

    return savedPlan;
  },

  deleteInstallmentPlan(id: string): void {
    const plans = this.getInstallmentPlans();
    const updated = plans.filter(p => p.id !== id);
    memoryPlans = updated;
    setLocalItem(STORAGE_KEYS.INSTALLMENT_PLANS, updated);

    // Sync to Turso API
    fetch(`/api/installments?id=${id}`, {
      method: 'DELETE',
    }).catch(err => console.error('Turso plan delete error:', err));
  },

  // WEBSITE SETTINGS
  getSettings(): WebsiteSettings {
    if (typeof window === 'undefined') return memorySettings;
    const local = getLocalItem<WebsiteSettings>(STORAGE_KEYS.SETTINGS, memorySettings);
    memorySettings = local;
    return local;
  },

  saveSettings(settings: WebsiteSettings): WebsiteSettings {
    memorySettings = settings;
    setLocalItem(STORAGE_KEYS.SETTINGS, settings);

    // Sync to Turso API
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).catch(err => console.error('Turso settings sync error:', err));

    return settings;
  },

  // RESET TO INITIAL SEED
  resetToFactoryDefaults(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    window.localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    window.localStorage.removeItem(STORAGE_KEYS.INSTALLMENT_PLANS);
    window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    memoryProducts = [...initialProducts];
    memoryCategories = [...initialCategories];
    memoryPlans = [...initialInstallmentPlans];
    memorySettings = { ...initialWebsiteSettings };
    window.dispatchEvent(new Event('yp-store-updated'));
  },

  // AUTH SESSION
  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminLoggedIn(status: boolean): void {
    if (typeof window === 'undefined') return;
    if (status) {
      window.localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }
};

// React hook for reactive data binding across components
export function useStore() {
  const [products, setProducts] = useState<Product[]>(StoreService.getProducts());
  const [categories, setCategories] = useState<Category[]>(StoreService.getCategories());
  const [plans, setPlans] = useState<InstallmentPlan[]>(StoreService.getInstallmentPlans());
  const [settings, setSettings] = useState<WebsiteSettings>(StoreService.getSettings());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const refreshData = () => {
      setProducts(StoreService.getProducts());
      setCategories(StoreService.getCategories());
      setPlans(StoreService.getInstallmentPlans());
      setSettings(StoreService.getSettings());
      setIsAdmin(StoreService.isAdminLoggedIn());
    };

    refreshData();
    setIsLoaded(true);

    // Background sync from Turso DB
    StoreService.syncFromDatabase().then(() => {
      refreshData();
    });

    window.addEventListener('yp-store-updated', refreshData);
    return () => window.removeEventListener('yp-store-updated', refreshData);
  }, []);

  return {
    isLoaded,
    products,
    categories,
    plans,
    settings,
    isAdmin,
    saveProduct: (p: Product) => StoreService.saveProduct(p),
    deleteProduct: (id: string) => StoreService.deleteProduct(id),
    saveCategory: (c: Category) => StoreService.saveCategory(c),
    deleteCategory: (id: string) => StoreService.deleteCategory(id),
    savePlan: (p: InstallmentPlan) => StoreService.saveInstallmentPlan(p),
    deletePlan: (id: string) => StoreService.deleteInstallmentPlan(id),
    saveSettings: (s: WebsiteSettings) => StoreService.saveSettings(s),
    resetDefaults: () => StoreService.resetToFactoryDefaults(),
    setAdminLoggedIn: (status: boolean) => {
      StoreService.setAdminLoggedIn(status);
      setIsAdmin(status);
    }
  };
}
