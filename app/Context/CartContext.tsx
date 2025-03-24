import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of a food item
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

// Extend FoodItem to include quantity for cart items
interface CartItem extends FoodItem {
  quantity: number;
}

// Define the Cart Context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  updateQuantity: (item_Id: number, increment: number) => void;
  removeItem: (item_Id: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

// Create the Cart Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component to manage cart state
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]); // Ensures items is always an array

  // Add an item to the cart
  const addItem = (item: FoodItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.item_id === item.item_id);

      if (existingItem) {
        return prevItems.map((i) =>
          i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Update quantity of an item in the cart
  const updateQuantity = (item_Id: number, increment: number) => {
    setItems((prevItems) =>
      prevItems.reduce<CartItem[]>((acc, item) => {
        if (item.item_id === item_Id) {
          const newQuantity = item.quantity + increment;
          if (newQuantity > 0) acc.push({ ...item, quantity: newQuantity });
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  //  Remove an item from the cart
  const removeItem = (item_Id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.item_id !== item_Id));
  };

  //  Calculate total price
  const getTotalPrice = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate total number of items in cart
  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  // Clear the cart
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        getTotalPrice,
        getTotalItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
