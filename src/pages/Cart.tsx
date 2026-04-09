import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { breadcrumbSchema } from "@/utils/schemas";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { trackPurchase } from "@/utils/analytics";
import {
    formatINR,
    getPosterPricingBreakdown,
    POSTER_UNIT_PRICE,
} from "@/utils/pricing";

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const totalQuantity = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems],
    );

    const pricing = useMemo(
        () => getPosterPricingBreakdown(totalQuantity),
        [totalQuantity],
    );

    const createOrderMutation = useMutation({
        mutationFn: async () => {
            if (!user) {
                throw new Error("You need to sign in before checkout.");
            }

            if (cartItems.length === 0) {
                throw new Error("Your cart is empty.");
            }

            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user.id,
                    total_amount: pricing.total,
                    status: "pending",
                    shipping_address: null,
                    discount_amount: pricing.savings,
                    notes: `Poster quantity: ${totalQuantity}, shipping: ${pricing.shippingCharge}`,
                })
                .select()
                .single();

            if (orderError || !order) {
                throw orderError || new Error("Failed to create order");
            }

            const orderItemsPayload = cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price_at_purchase: POSTER_UNIT_PRICE,
            }));

            const { error: orderItemsError } = await supabase
                .from("order_items")
                .insert(orderItemsPayload);

            if (orderItemsError) {
                throw orderItemsError;
            }

            return {
                orderId: order.id,
                orderTotal: pricing.total,
                items: cartItems,
            };
        },
    });

    const handleCheckout = async () => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to complete your purchase.",
            });
            navigate("/auth");
            return;
        }

        setIsCheckingOut(true);

        try {
            const result = await createOrderMutation.mutateAsync();
            trackPurchase(
                result.orderId,
                result.orderTotal,
                result.items.map((item) => ({
                    item_id: item.productId,
                    item_name: item.name,
                    item_category: item.category,
                    price: POSTER_UNIT_PRICE,
                    quantity: item.quantity,
                })),
            );
            clearCart();
            toast({
                title: "Order placed successfully!",
                description: `Your order #${result.orderId.slice(0, 8)} is now pending confirmation.`,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to place order right now.";
            toast({
                title: "Checkout failed",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "Cart", url: "https://somthing-ten.vercel.app/cart" },
    ]);

    const remainingForFreeDelivery = Math.max(0, 5 - totalQuantity);

    return (
        <>
            <SEOHead
                title="Shopping Cart | Somthing"
                description="Poster offers: 1 for ₹50, 3 for ₹130, 5 for ₹200. Delivery ₹100 unless order value is above ₹200."
                keywords="shopping cart, checkout, buy posters, innothon offer"
                canonical="/cart"
                schema={breadcrumbs}
            />
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-24 md:pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            className="mb-12"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Your Cart
                            </h1>
                            <p className="text-muted-foreground">
                                {cartItems.length}{" "}
                                {cartItems.length === 1 ? "item" : "items"} in
                                your cart
                            </p>
                        </motion.div>

                        {cartItems.length === 0 ? (
                            <motion.div
                                className="text-center py-20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <motion.div
                                    className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-4">
                                    Your cart is empty
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Looks like you haven&apos;t added any
                                    posters yet. Let&apos;s fix that!
                                </p>
                                <Link to="/shop">
                                    <Button size="lg">
                                        Start Shopping
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="grid lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2">
                                    <AnimatePresence>
                                        {cartItems.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: 50,
                                                    height: 0,
                                                }}
                                                transition={{
                                                    delay: index * 0.05,
                                                }}
                                                className="flex gap-6 p-6 bg-card rounded-2xl mb-4"
                                            >
                                                <Link
                                                    to={`/product/${item.routeId}`}
                                                >
                                                    <motion.div
                                                        className="w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden flex-shrink-0"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                </Link>

                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                                {item.category}
                                                            </span>
                                                            <Link
                                                                to={`/product/${item.routeId}`}
                                                            >
                                                                <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                                                    {item.name}
                                                                </h3>
                                                            </Link>
                                                        </div>
                                                        <motion.button
                                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id,
                                                                )
                                                            }
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </motion.button>
                                                    </div>

                                                    <div className="text-sm text-muted-foreground mb-auto">
                                                        <p>
                                                            Poster price:{" "}
                                                            {formatINR(
                                                                POSTER_UNIT_PRICE,
                                                            )}{" "}
                                                            each
                                                        </p>
                                                        <p>
                                                            Bundle offers apply
                                                            at checkout
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                                                            <motion.button
                                                                className="p-2 hover:bg-background rounded"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                whileTap={{
                                                                    scale: 0.9,
                                                                }}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </motion.button>
                                                            <span className="w-8 text-center font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <motion.button
                                                                className="p-2 hover:bg-background rounded"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                whileTap={{
                                                                    scale: 0.9,
                                                                }}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </motion.button>
                                                        </div>

                                                        <motion.div
                                                            className="text-xl font-bold text-primary"
                                                            key={`${item.id}-${item.quantity}`}
                                                            initial={{
                                                                scale: 1.2,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                            }}
                                                        >
                                                            {formatINR(
                                                                POSTER_UNIT_PRICE *
                                                                    item.quantity,
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <Link to="/shop">
                                        <motion.div
                                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-4"
                                            whileHover={{ x: -5 }}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Continue Shopping
                                        </motion.div>
                                    </Link>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="lg:sticky lg:top-28 h-fit"
                                >
                                    <div className="bg-card rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-6">
                                            Order Summary
                                        </h2>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Original Price
                                                </span>
                                                <span className="font-medium">
                                                    {formatINR(
                                                        pricing.originalSubtotal,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Offer Discount
                                                </span>
                                                <span className="font-medium text-primary">
                                                    -
                                                    {formatINR(pricing.savings)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Poster Total
                                                </span>
                                                <span className="font-medium">
                                                    {formatINR(
                                                        pricing.discountedSubtotal,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Delivery
                                                </span>
                                                <span className="font-medium">
                                                    {pricing.shippingCharge ===
                                                    0
                                                        ? "Free"
                                                        : formatINR(
                                                              pricing.shippingCharge,
                                                          )}
                                                </span>
                                            </div>
                                            {pricing.shippingCharge > 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Add{" "}
                                                    {remainingForFreeDelivery}{" "}
                                                    more poster
                                                    {remainingForFreeDelivery ===
                                                    1
                                                        ? ""
                                                        : "s"}{" "}
                                                    for free delivery.
                                                </p>
                                            )}
                                            <div className="h-px bg-border" />
                                            <div className="flex justify-between text-xl font-bold">
                                                <span>Total</span>
                                                <span className="text-primary">
                                                    {formatINR(pricing.total)}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-14 text-lg"
                                            size="lg"
                                            onClick={handleCheckout}
                                            disabled={
                                                isCheckingOut ||
                                                cartItems.length === 0
                                            }
                                        >
                                            {isCheckingOut ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm & Checkout
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-center text-sm text-muted-foreground mt-4">
                                            Delivery is free only when order
                                            value is ₹200 and above.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-center gap-6 text-muted-foreground">
                                        <div className="text-center text-sm">
                                            <div className="font-medium">
                                                Bundle Offers
                                            </div>
                                            <div className="text-xs">
                                                3 for ₹130, 5 for ₹200
                                            </div>
                                        </div>
                                        <div className="text-center text-sm">
                                            <div className="font-medium">
                                                Easy Returns
                                            </div>
                                            <div className="text-xs">
                                                30-day policy
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Cart;
