import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  cookId: string;
  cookName: string;
}

interface CartContextType {
  cart: CartItem[];
  currentCookId: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<boolean>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearAllCarts: () => void;
  switchToCook: (cookId: string) => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  hasItemsFromOtherCook: (cookId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [carts, setCarts] = useState<Record<string, CartItem[]>>({});
  const [currentCookId, setCurrentCookId] = useState<string | null>(null);

  const cart = currentCookId ? (carts[currentCookId] || []) : [];

  const addToCart = async (item: Omit<CartItem, 'quantity'>): Promise<boolean> => {
    // Check if there are items from a different cook
    if (currentCookId && currentCookId !== item.cookId && cart.length > 0) {
      return false; // Return false to indicate cook switching is needed
    }

    // Set current cook if not set or switching to new cook
    if (!currentCookId || currentCookId !== item.cookId) {
      setCurrentCookId(item.cookId);
    }

    setCarts(prevCarts => {
      const cookCart = prevCarts[item.cookId] || [];
      const existingItem = cookCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return {
          ...prevCarts,
          [item.cookId]: cookCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        };
      } else {
        return {
          ...prevCarts,
          [item.cookId]: [...cookCart, { ...item, quantity: 1 }]
        };
      }
    });

    return true;
  };

  const removeFromCart = (itemId: string) => {
    if (!currentCookId) return;
    
    setCarts(prevCarts => ({
      ...prevCarts,
      [currentCookId]: prevCarts[currentCookId]?.filter(item => item.id !== itemId) || []
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    if (!currentCookId) return;
    
    setCarts(prevCarts => ({
      ...prevCarts,
      [currentCookId]: prevCarts[currentCookId]?.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ) || []
    }));
  };

  const clearCart = () => {
    if (!currentCookId) return;
    
    setCarts(prevCarts => ({
      ...prevCarts,
      [currentCookId]: []
    }));
  };

  const clearAllCarts = () => {
    setCarts({});
    setCurrentCookId(null);
  };

  const switchToCook = (cookId: string) => {
    setCurrentCookId(cookId);
  };

  const hasItemsFromOtherCook = (cookId: string) => {
    return currentCookId !== null && currentCookId !== cookId && cart.length > 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        currentCookId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearAllCarts,
        switchToCook,
        getTotalItems,
        getTotalAmount,
        hasItemsFromOtherCook,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};