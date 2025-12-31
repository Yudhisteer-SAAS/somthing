import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";

// Mock cart data
const initialCartItems = [
  { 
    id: 1, 
    name: "Desert Sunrise", 
    category: "Abstract",
    size: "Medium (12\" x 16\")",
    frame: "Black",
    price: 64.99,
    quantity: 1,
    image: poster1 
  },
  { 
    id: 2, 
    name: "Tropical Dreams", 
    category: "Botanical",
    size: "Large (18\" x 24\")",
    frame: "No Frame",
    price: 54.99,
    quantity: 2,
    image: poster2 
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any posters yet. Let's fix that!
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
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, height: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6 p-6 bg-card rounded-2xl mb-4"
                    >
                      {/* Image */}
                      <Link to={`/product/${item.id}`}>
                        <motion.div 
                          className="w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                              {item.category}
                            </span>
                            <Link to={`/product/${item.id}`}>
                              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          </div>
                          <motion.button
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => removeItem(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>

                        <div className="text-sm text-muted-foreground mb-auto">
                          <p>{item.size}</p>
                          <p>Frame: {item.frame}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                            <motion.button
                              className="p-2 hover:bg-background rounded"
                              onClick={() => updateQuantity(item.id, -1)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <motion.button
                              className="p-2 hover:bg-background rounded"
                              onClick={() => updateQuantity(item.id, 1)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <motion.div 
                            className="text-xl font-bold text-primary"
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
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

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-28 h-fit"
              >
                <div className="bg-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-primary">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full h-14 text-lg" size="lg">
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex justify-center gap-6 text-muted-foreground">
                  <div className="text-center text-sm">
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-xs">On orders $50+</div>
                  </div>
                  <div className="text-center text-sm">
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-xs">30-day policy</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;