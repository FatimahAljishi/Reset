import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const storageKey = user?.id ? `reset-cart-${user.id}` : null;

  // Load this user's cart when Clerk finishes loading.
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !storageKey) {
      setCartItems([]);
      setCartLoaded(true);
      return;
    }

    try {
      const savedCart = localStorage.getItem(storageKey);

      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } catch (error) {
      console.error("Could not load cart:", error);
      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }, [isLoaded, isSignedIn, storageKey]);

  // Save changes to localStorage.
  useEffect(() => {
    if (!cartLoaded || !isSignedIn || !storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [cartItems, cartLoaded, isSignedIn, storageKey]);

  function addToCart(item) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.cartItemId === item.cartItemId,
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.cartItemId === item.cartItemId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem,
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(cartItemId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartItemId !== cartItemId),
    );
  }

  function increaseQuantity(cartItemId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQuantity(cartItemId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoaded,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
