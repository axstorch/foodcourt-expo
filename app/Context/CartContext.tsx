import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash'; // Install lodash: npm install lodash

interface FoodItem {
  item_id: number;
  vendor_name: string;
  item_name: string;
  price: number;
  category: string;
  veg: boolean;
  image: string;
  description: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  updateQuantity: (item_Id: number, increment: number) => void;
  removeItem: (item_Id: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
  isLoading: boolean;
  refreshCart: () => void; // New method to manually refresh cart
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@cart_items';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced save to AsyncStorage
  const saveCartToStorage = useCallback(
    debounce(async (cartItems: CartItem[]) => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }, 300), // Debounce for 300ms
    []
  );

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart !== null) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    (item: FoodItem) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.item_id === item.item_id);
        let newItems: CartItem[];
        if (existingItem) {
          newItems = prevItems.map((i) =>
            i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...prevItems, { ...item, quantity: 1 }];
        }
        saveCartToStorage(newItems);
        return newItems;
      });
    },
    [saveCartToStorage]
  );

  const updateQuantity = useCallback(
    (item_Id: number, increment: number) => {
      setItems((prevItems) => {
        const newItems = prevItems.reduce<CartItem[]>((acc, item) => {
          if (item.item_id === item_Id) {
            const newQuantity = item.quantity + increment;
            if (newQuantity > 0) {
              acc.push({ ...item, quantity: newQuantity });
            }
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
        saveCartToStorage(newItems);
        return newItems;
      });
    },
    [saveCartToStorage]
  );

  const removeItem = useCallback(
    (item_Id: number) => {
      setItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.item_id !== item_Id);
        saveCartToStorage(newItems);
        return newItems;
      });
    },
    [saveCartToStorage]
  );

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCartToStorage([]);
  }, [saveCartToStorage]);

  const refreshCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        getTotalPrice,
        getTotalItems,
        clearCart,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;