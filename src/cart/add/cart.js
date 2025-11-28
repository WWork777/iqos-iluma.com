'use client'
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Загружаем корзину из localStorage с проверкой срока хранения
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            const age = Date.now() - parsed.timestamp;
            const threeHours = 60 * 60 * 1000;

            if (age < threeHours) {
                setCartItems(parsed.items);
            } else {
                localStorage.removeItem("cart"); // просрочено
            }
        }
    }, []);

    const saveCartToStorage = (items) => {
        const cartData = {
            items,
            timestamp: Date.now()
        };
        localStorage.setItem("cart", JSON.stringify(cartData));
    };

    const addToCart = (product, quantityType = "Блок", quantity = 1, setQuantity) => {
        const price = quantityType === "Блок"
            ? Number(product.price)
            : quantityType === "Пачка"
            ? Number(product.pricePack)
            : Number(product.price);

        const productId = `${product.id} - ${quantityType || "default"}`;
        const existingProduct = cartItems.find((item) => item.id === productId);
        const image = quantityType === "Пачка" ? product.imagePack : product.image;
        let updatedCart;

        if (existingProduct) {
            updatedCart = cartItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity: item.quantity + quantity,
                          price: (item.quantity + quantity) * price,
                      }
                    : item
            );
        } else {
            updatedCart = [
                ...cartItems,
                {
                    id: productId,
                    name: product.name,
                    price: price * quantity,
                    type: quantityType || "default",
                    image: image,
                    quantity,
                },
            ];
        }

        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
        setQuantity(1);
    };

    const hasSticks = () => cartItems.some(item => item.type !== 'default');

    const addOne = (productId) => {
        const updatedCart = cartItems.map((item) =>
            item.id === productId
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    price: (item.quantity + 1) * item.price / item.quantity,
                }
                : item
        );
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const deleteOne = (productId) => {
        const updatedCart = cartItems.map((item) =>
            item.id === productId && item.quantity > 1
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    price: (item.quantity - 1) * item.price / item.quantity,
                }
                : item
        ).filter(item => item.quantity > 0);
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + Number(item.price), 0);
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            addOne,
            deleteOne,
            calculateTotalPrice,
            hasSticks
        }}>
            {children}
        </CartContext.Provider>
    );
};
