import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definimos qué forma tiene un item en el carrito
export interface CartItem {
  ticketId: number;
  ticketName: string;
  eventoId: number;
  eventoName: string;
  quantity: number;
  price: number;
  stock: number; // Guardamos el stock para validaciones
}

// 2. Definimos qué funciones tendrá nuestro contexto
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (ticketId: number, quantity: number) => void;
  removeFromCart: (ticketId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos el Proveedor
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Leemos el carrito de localStorage al cargar
    const storedCart = localStorage.getItem('cartTickio');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Guardamos en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cartTickio', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(i => i.ticketId === item.ticketId);
      
      if (existingItem) {
        // Si ya existe, actualiza la cantidad (sin pasarse del stock)
        const newQuantity = Math.min(existingItem.quantity + item.quantity, item.stock);
        return prevItems.map(i => 
          i.ticketId === item.ticketId ? { ...i, quantity: newQuantity } : i
        );
      } else {
        // Si es nuevo, lo agrega
        return [...prevItems, item];
      }
    });
  };

  const updateQuantity = (ticketId: number, quantity: number) => {
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item.ticketId === ticketId 
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } // Valida 0 y stock
          : item
      ).filter(item => item.quantity > 0) // Limpia si la cantidad es 0
    );
  };

  const removeFromCart = (ticketId: number) => {
    setCartItems((prevItems) => prevItems.filter(i => i.ticketId !== ticketId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos para mostrar en el Navbar o Carrito
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        totalItems, 
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Hook personalizado para usarlo fácil
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};