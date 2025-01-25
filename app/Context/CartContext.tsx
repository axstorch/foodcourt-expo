import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  cuisine: string;
  image: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  updateQuantity: (itemId: string, increment: number) => void;
  removeItem: (itemId: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider: A context provider component to manage the shopping cart items.
export function CartProvider({ children }: { children: ReactNode }) {
  // State to store the list of cart items
  const [items, setItems] = useState<CartItem[]>([]);

  /**
   * Adds an item to the cart. 
   * - If the item already exists in the cart, increment its quantity.
   * - If the item doesn't exist, add it to the cart with a quantity of 1.
   * @param item - The item to add to the cart (of type FoodItem).
   */
  const addItem = (item: FoodItem) => {
    setItems(currentItems => {
      // Check if the item already exists in the cart
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        // If the item exists, update its quantity
        return currentItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 } // Increment quantity
            : i // Keep other items unchanged
        );
      }

      // If the item doesn't exist, add it with an initial quantity of 1
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  // Return the provider with the cart context (not shown in this snippet)


  const updateQuantity = (itemId: string, increment: number) => {
    setItems(currentItems => {
      return currentItems
        .map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + increment;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      getTotalPrice,
      getTotalItems,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}