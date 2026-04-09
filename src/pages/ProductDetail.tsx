import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Minus,
    Plus,
    ShoppingCart,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { productSchema, breadcrumbSchema } from "@/utils/schemas";
import { trackAddToCart, trackViewItem } from "@/utils/analytics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    fallbackPosterProducts,
    mapDatabaseProductToStorefront,
} from "@/data/posterCatalog";
import { useCart } from "@/hooks/useCart";
import {
    getPosterPricingBreakdown,
    POSTER_UNIT_PRICE,
    formatINR,
} from "@/utils/pricing";

const ProductDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const { addItem } = useCart();
    const normalizedId = (id || "").replace(/^product/i, "");
    const productRouteId = normalizedId || id || "1";

    const { data: dbProduct } = useQuery({
        queryKey: ["product-detail", id],
        enabled: Boolean(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .eq("id", productRouteId)
                .maybeSingle();

            if (error) throw error;
            return data;
        },
    });

    const fallbackProduct = fallbackPosterProducts.find(
        (poster) => poster.id === productRouteId,
    );

    const product = dbProduct
        ? mapDatabaseProductToStorefront(dbProduct)
        : fallbackProduct || fallbackPosterProducts[0];

    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const pricing = useMemo(
        () => getPosterPricingBreakdown(quantity),
        [quantity],
    );

    const relatedImages = fallbackPosterProducts
        .filter((poster) => poster.image !== product.image)
        .slice(0, 3)
        .map((poster) => poster.image);

    const images = [product.image, ...relatedImages];

    useEffect(() => {
        trackViewItem({
            id: product.id,
            name: product.name,
            price: POSTER_UNIT_PRICE,
            category: product.category,
        });
    }, [product]);

    const handleAddToCart = () => {
        addItem({ product, quantity });
        trackAddToCart({
            id: product.id,
            name: product.name,
            price: pricing.discountedSubtotal,
            category: product.category,
        });
        toast({
            title: "Added to cart!",
            description: `${quantity} poster${quantity > 1 ? "s" : ""} of ${product.name} added to cart.`,
        });
    };

    const productDescription = `${product.name} poster with INNOTHON pricing: 1 poster ₹50, 3 posters ₹130, 5 posters ₹200.`;

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "Shop", url: "https://somthing-ten.vercel.app/shop" },
        {
            name: product.name,
            url: `https://somthing-ten.vercel.app/product/${product.id}`,
        },
    ]);

    const productData = productSchema({
        id: product.id,
        name: product.name,
        description: productDescription,
        price: POSTER_UNIT_PRICE,
        image: product.image,
        category: product.category,
        availability: "InStock",
    });

    const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [productData, breadcrumbs],
    };

    return (
        <>
            <SEOHead
                title={`${product.name} | Poster | Somthing`}
                description={productDescription}
                keywords={`${product.name}, poster, wall art, innothon offer`}
                canonical={`/product/${product.id}`}
                type="product"
                ogImage={product.image}
                schema={combinedSchema}
            />
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-24 md:pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to Shop
                            </Link>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
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

                                    <motion.button
                                        className={`absolute top-4 right-4 p-3 rounded-full ${
                                            isWishlisted
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-card/90 backdrop-blur-sm"
                                        }`}
                                        onClick={() =>
                                            setIsWishlisted(!isWishlisted)
                                        }
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Heart
                                            className={`h-5 w-5 ${
                                                isWishlisted
                                                    ? "fill-current"
                                                    : ""
                                            }`}
                                        />
                                    </motion.button>
                                </motion.div>

                                <div className="flex gap-3">
                                    {images.map((img, index) => (
                                        <motion.button
                                            key={index}
                                            className={`relative w-20 h-24 rounded-xl overflow-hidden ${
                                                activeImage === index
                                                    ? "ring-2 ring-primary"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

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

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 fill-primary text-primary"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-muted-foreground">
                                        (127 reviews)
                                    </span>
                                </div>

                                <motion.div
                                    className="mb-8"
                                    key={quantity}
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {pricing.savings > 0 ? (
                                        <div className="flex items-end gap-3">
                                            <span className="text-2xl md:text-3xl font-semibold text-muted-foreground line-through">
                                                {formatINR(
                                                    pricing.originalSubtotal,
                                                )}
                                            </span>
                                            <span className="text-4xl md:text-5xl font-bold text-primary">
                                                {formatINR(
                                                    pricing.discountedSubtotal,
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-4xl md:text-5xl font-bold text-primary">
                                            {formatINR(
                                                pricing.discountedSubtotal,
                                            )}
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        1 poster = ₹50, 3 posters = ₹150 → ₹130,
                                        5 posters = ₹250 → ₹200
                                    </p>
                                </motion.div>

                                <div className="mb-8">
                                    <h3 className="font-semibold mb-3">
                                        Quantity
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <motion.button
                                            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Minus className="h-5 w-5" />
                                        </motion.button>
                                        <span className="text-xl font-semibold w-12 text-center">
                                            {quantity}
                                        </span>
                                        <motion.button
                                            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </motion.button>
                                    </div>
                                </div>

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

                                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                                    <div className="text-center">
                                        <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <div className="text-sm font-medium">
                                            Free Delivery
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            ₹200 and above
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <div className="text-sm font-medium">
                                            Quality Guarantee
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Premium materials
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <div className="text-sm font-medium">
                                            Easy Returns
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            30-day policy
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default ProductDetail;
