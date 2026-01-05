"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { cartApi } from "@/services/cartApi";
import { CartItem, CartDetail } from "@/types/cart";
import { productApiService } from "@/services/productsApi";

const API_BASE_URL = 'http://localhost:8080/api';

// ==================== TYPES ====================
export interface VariantInfo {
  variantId: number;
  sku: string;
  quantity: number;
  attributesJson: string;
  priceOverride: number | null;
  status: string;
  createdAt: string;
}

export interface ImageInfo {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductDetailResponse {
  productId: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
  variants: VariantInfo[];
  reviews: any[];
  totalReviews: number;
}

// ==================== SHOP CONTEXT TYPES ====================
type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  variantId?: number;
  selectedVariant?: VariantInfo;
};

// Removed local CartItem type alias, using imported CartItem interface


type User = {
  userId?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string | null;
  role?: string;
  status?: string;
  isAdmin?: boolean;
};

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: CartItem[];
  totalAmount: number;
  customerInfo: any;
  paymentMethod: 'cod' | 'banking';
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
};

interface ShopContextProps {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  addToCart: (p: Product) => Promise<void>;
  removeFromCart: (variantId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  decreaseQuantity: (variantId: number) => Promise<void>;
  isInitialized: boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  loadCartFromAPI: () => Promise<void>;
  getProductById: (id: number) => Promise<ProductDetailResponse | null>;
  selectedCartItems: Set<number>;
  setSelectedCartItems: (items: Set<number>) => void;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [selectedCartItems, setSelectedCartItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedUser = localStorage.getItem("user");
    const savedOrders = localStorage.getItem("orders");

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {
        localStorage.removeItem("orders");
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (user?.userId) {
      loadCartFromAPI();
    } else {
      setCart([]);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (!isInitialized) return;
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (orders.length > 0) localStorage.setItem("orders", JSON.stringify(orders));
    else localStorage.removeItem("orders");
  }, [orders, isInitialized]);

  const loadCartFromAPI = async () => {
    const cartIdStr = localStorage.getItem('cartId');
    if (!cartIdStr) {
      return;
    }
    const cartId = parseInt(cartIdStr);

    try {
      const data = await cartApi.getCart(cartId);

      // ✅ Map response to local CartItem structure compatible with UI
      const cartItems: CartItem[] = data.items.map(item => ({
        ...item,
        price: item.priceSnapshot, // Explicitly map price for UI compatibility
        lineTotal: item.priceSnapshot * item.quantity // Ensure accurate line total
      }));

      setCart(cartItems);
    } catch (error) {
      console.error("❌ Lỗi khi load giỏ hàng:", error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      if (typeof window !== "undefined") {
        const confirm = window.confirm(
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đăng nhập ngay?"
        );
        if (confirm) window.location.href = "/login";
      }
      return;
    }

    const cartIdStr = localStorage.getItem('cartId');

    if (!cartIdStr) {
      alert("Không tìm thấy giỏ hàng. Vui lòng đăng nhập lại!");
      return;
    }
    const cartId = parseInt(cartIdStr);

    if (!product.variantId) {
      alert("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    try {
      const data = await cartApi.addToCart(cartId, product.variantId, product.quantity || 1);

      const cartItems: CartItem[] = data.items.map(item => ({
        ...item,
        price: item.priceSnapshot,
        lineTotal: item.priceSnapshot * item.quantity
      }));

      setCart(cartItems);

      if (typeof window !== "undefined") {
        alert("Đã thêm vào giỏ hàng!");
      }
    } catch (error: any) {
      console.error("❌ [AddToCart] Exception:", error);
      alert(error.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const updateQuantity = async (variantId: number, quantity: number) => {
    if (quantity < 1) return;

    const cartIdStr = localStorage.getItem('cartId');
    if (!cartIdStr) return;
    const cartId = parseInt(cartIdStr);

    const currentItem = cart.find(item => item.variantId === variantId);
    if (!currentItem) return;

    try {
      // Determine action based on quantity change
      const action = quantity > currentItem.quantity ? "increase" : "decrease";

      // Call backend API for validation
      const data = await cartApi.updateQuantity(cartId, variantId, action);

      // Update cart with response from backend
      const cartItems: CartItem[] = data.items.map((item: any) => ({
        ...item,
        price: item.priceSnapshot,
        lineTotal: item.priceSnapshot * item.quantity
      }));

      setCart(cartItems);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      alert(error.message || "Không thể cập nhật số lượng");
      // Reload cart to revert optimistic update
      await loadCartFromAPI();
    }
  };

  const decreaseQuantity = async (variantId: number) => {
    const item = cart.find((i) => i.variantId === variantId);
    if (!item) return;

    if (item.quantity <= 1) {
      await removeFromCart(variantId);
    } else {
      await updateQuantity(variantId, item.quantity - 1);
    }
  };

  const removeFromCart = async (variantId: number) => {
    const cartIdStr = localStorage.getItem('cartId');
    if (!cartIdStr) return;
    const cartId = parseInt(cartIdStr);

    try {
      const data = await cartApi.removeItem(cartId, variantId);

      const cartItems: CartItem[] = data.items.map(item => ({
        ...item,
        price: item.priceSnapshot,
        lineTotal: item.priceSnapshot * item.quantity
      }));

      setCart(cartItems);
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert(error.message || "Không thể xóa sản phẩm");
    }
  };

  const clearCart = async () => {
    setCart([]);
  };
  const getProductById = async (id: number): Promise<ProductDetailResponse | null> => {
    return productApiService.getProductById(id);
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        decreaseQuantity,
        isInitialized,
        orders,
        setOrders,
        selectedProduct,
        setSelectedProduct,
        buyNowItem,
        setBuyNowItem,
        loadCartFromAPI,
        getProductById,
        selectedCartItems,
        setSelectedCartItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
export default ShopProvider

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
};