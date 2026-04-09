import { useCallback, useEffect, useMemo, useState } from "react";
import { POSTER_UNIT_PRICE } from "@/utils/pricing";

const CART_STORAGE_KEY = "somthing-cart-v1";
const CART_UPDATED_EVENT = "somthing-cart-updated";

export const CART_DEFAULT_SIZE = {
    name: "Small",
    dimensions: '8" x 10"',
    price: 0,
};

export const CART_DEFAULT_FRAME = {
    name: "No Frame",
    price: 0,
};

export type CartItem = {
    id: string;
    routeId: string;
    productId: string | null;
    name: string;
    category: string;
    image: string;
    basePrice: number;
    unitPrice: number;
    quantity: number;
    sizeName: string;
    sizeDimensions: string;
    sizePrice: number;
    frameName: string;
    framePrice: number;
};

type AddToCartInput = {
    product: {
        id: string;
        name: string;
        category: string;
        image: string;
        price: number;
    };
    quantity?: number;
    size?: {
        name: string;
        dimensions: string;
        price: number;
    };
    frame?: {
        name: string;
        price: number;
    };
};

const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
    );

const createCartItemId = (
    routeId: string,
    sizeName: string,
    frameName: string,
) => `${routeId}::${sizeName}::${frameName}`;

const readCartFromStorage = (): CartItem[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!rawCart) {
            return [];
        }

        const parsedCart = JSON.parse(rawCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
        return [];
    }
};

const writeCartToStorage = (items: CartItem[]) => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() =>
        readCartFromStorage(),
    );

    const syncFromStorage = useCallback(() => {
        setCartItems(readCartFromStorage());
    }, []);

    useEffect(() => {
        syncFromStorage();

        window.addEventListener("storage", syncFromStorage);
        window.addEventListener(CART_UPDATED_EVENT, syncFromStorage);

        return () => {
            window.removeEventListener("storage", syncFromStorage);
            window.removeEventListener(CART_UPDATED_EVENT, syncFromStorage);
        };
    }, [syncFromStorage]);

    const addItem = useCallback((input: AddToCartInput) => {
        const size = input.size || CART_DEFAULT_SIZE;
        const frame = input.frame || CART_DEFAULT_FRAME;
        const quantity = Math.max(1, input.quantity || 1);
        const routeId = String(input.product.id);

        const nextItem: CartItem = {
            id: createCartItemId(routeId, size.name, frame.name),
            routeId,
            productId: isUuid(routeId) ? routeId : null,
            name: input.product.name,
            category: input.product.category,
            image: input.product.image,
            basePrice: POSTER_UNIT_PRICE,
            unitPrice: POSTER_UNIT_PRICE,
            quantity,
            sizeName: size.name,
            sizeDimensions: size.dimensions,
            sizePrice: size.price,
            frameName: frame.name,
            framePrice: frame.price,
        };

        const existingItems = readCartFromStorage();
        const existingIndex = existingItems.findIndex(
            (item) => item.id === nextItem.id,
        );

        const updatedItems = [...existingItems];

        if (existingIndex >= 0) {
            updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + quantity,
            };
        } else {
            updatedItems.push(nextItem);
        }

        writeCartToStorage(updatedItems);
        setCartItems(updatedItems);
    }, []);

    const updateQuantity = useCallback(
        (itemId: string, nextQuantity: number) => {
            const existingItems = readCartFromStorage();
            const updatedItems = existingItems
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Math.max(1, nextQuantity) }
                        : item,
                )
                .filter((item) => item.quantity > 0);

            writeCartToStorage(updatedItems);
            setCartItems(updatedItems);
        },
        [],
    );

    const removeItem = useCallback((itemId: string) => {
        const existingItems = readCartFromStorage();
        const updatedItems = existingItems.filter((item) => item.id !== itemId);

        writeCartToStorage(updatedItems);
        setCartItems(updatedItems);
    }, []);

    const clearCart = useCallback(() => {
        writeCartToStorage([]);
        setCartItems([]);
    }, []);

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems],
    );

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity,
                0,
            ),
        [cartItems],
    );

    return {
        cartItems,
        cartCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
    };
};
