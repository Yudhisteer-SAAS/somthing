import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

const products = [
  { id: 1, name: "Desert Sunrise", category: "Abstract", price: 29.99, image: poster1 },
  { id: 2, name: "Tropical Dreams", category: "Botanical", price: 34.99, image: poster2 },
  { id: 3, name: "Sunset Paradise", category: "Travel", price: 27.99, image: poster3 },
  { id: 4, name: "Elegant Portrait", category: "Line Art", price: 24.99, image: poster4 },
  { id: 5, name: "Ocean Waves", category: "Abstract", price: 32.99, image: poster5 },
  { id: 6, name: "Autumn Circles", category: "Abstract", price: 28.99, image: poster6 },
];

const sizes = [
  { name: "Small", dimensions: '8" x 10"', price: 0 },
  { name: "Medium", dimensions: '12" x 16"', price: 10 },
  { name: "Large", dimensions: '18" x 24"', price: 20 },
  { name: "XL", dimensions: '24" x 36"', price: 35 },
];

const frames = [
  { name: "No Frame", price: 0 },
  { name: "Black", price: 25 },
  { name: "White", price: 25 },
  { name: "Natural Oak", price: 35 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const product = products.find(p => p.id === Number(id)) || products[0];
  
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const totalPrice = (product.price + selectedSize.price + selectedFrame.price) * quantity;
  const images = [product.image, poster2, poster3, poster4];

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedSize.name}) has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <motion.div 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-secondary"
                layoutId={`product-${product.id}`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
                
                {/* Wishlist button */}
                <motion.button
                  className={`absolute top-4 right-4 p-3 rounded-full ${
                    isWishlisted ? "bg-primary text-primary-foreground" : "bg-card/90 backdrop-blur-sm"
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </motion.button>
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <motion.button
                    key={index}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden ${
                      activeImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-widest">
                {product.category}
              </span>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mt-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-muted-foreground">(127 reviews)</span>
              </div>

              {/* Price */}
              <motion.div 
                className="text-3xl font-bold text-primary mb-8"
                key={totalPrice}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                ${totalPrice.toFixed(2)}
              </motion.div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <motion.button
                      key={size.name}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedSize.name === size.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSize(size)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{size.name}</div>
                      <div className="text-sm text-muted-foreground">{size.dimensions}</div>
                      {size.price > 0 && (
                        <div className="text-xs text-primary">+${size.price}</div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Frame Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Frame</h3>
                <div className="flex flex-wrap gap-3">
                  {frames.map((frame) => (
                    <motion.button
                      key={frame.name}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        selectedFrame.name === frame.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedFrame(frame)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{frame.name}</div>
                      {frame.price > 0 && (
                        <div className="text-xs text-primary">+${frame.price}</div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <motion.button
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <motion.button
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
                    onClick={() => setQuantity(quantity + 1)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart */}
              <motion.div 
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </motion.div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders $50+</div>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Quality Guarantee</div>
                  <div className="text-xs text-muted-foreground">Premium materials</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day policy</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;