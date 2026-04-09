import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Heart,
    ShoppingCart,
    SlidersHorizontal,
    Grid3X3,
    LayoutGrid,
    X,
    Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { breadcrumbSchema } from "@/utils/schemas";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { trackAddToCart } from "@/utils/analytics";
import {
    fallbackPosterProducts,
    fallbackShopCategories,
    mapDatabaseProductToStorefront,
} from "@/data/posterCatalog";

const sortOptions = [
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Popular",
];

const Shop = () => {
    const { toast } = useToast();
    const { addItem } = useCart();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        categoryParam
            ? fallbackShopCategories.find(
                  (category) =>
                      category.toLowerCase() === categoryParam.toLowerCase(),
              ) || "All"
            : "All",
    );
    const [selectedTag, setSelectedTag] = useState(tagParam || "");
    const [sortBy, setSortBy] = useState("Newest");
    const [showFilters, setShowFilters] = useState(false);
    const [gridCols, setGridCols] = useState(3);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    // Fetch products from database
    const { data: dbProducts } = useQuery({
        queryKey: ["shop-products"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const shopProducts = [
        ...fallbackPosterProducts,
        ...((dbProducts || []).map(mapDatabaseProductToStorefront) || []),
    ];

    const categories = [
        "All",
        ...Array.from(new Set(shopProducts.map((product) => product.category))),
    ];

    // Get unique tags from all products
    const allTags = Array.from(
        new Set(shopProducts.flatMap((product) => product.tags || [])),
    ).sort();

    const filteredProducts = shopProducts
        .filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase()),
                );
            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;
            const matchesTag =
                !selectedTag || product.tags.includes(selectedTag);
            return matchesSearch && matchesCategory && matchesTag;
        })
        .sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            return 0;
        });

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "Shop", url: "https://somthing-ten.vercel.app/shop" },
    ]);

    const handleAddToCart = (product: (typeof filteredProducts)[number]) => {
        addItem({ product, quantity: 1 });
        trackAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
        });
        toast({
            title: "Added to cart!",
            description: `${product.name} was added to your cart.`,
        });
    };

    return (
        <>
            <SEOHead
                title="Shop All Posters | Premium Wall Art Prints | Somthing"
                description="Browse our complete collection of wall art posters. Filter by Abstract, Botanical, Travel, and Line Art categories. Premium quality prints at affordable prices."
                keywords="shop posters, buy wall art, poster store, art prints online, abstract posters, botanical prints, travel posters"
                canonical="/shop"
                schema={breadcrumbs}
            />
            <div className="min-h-screen bg-background">
                <Header />

                {/* Hero Section */}
                <section className="pt-32 pb-16 bg-gradient-to-b from-secondary to-background relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.3) 0%, transparent 50%)",
                        }}
                    />

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <motion.span
                                className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                The Shop
                            </motion.span>
                            <motion.h1
                                className="text-4xl md:text-6xl font-bold mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                All Posters
                            </motion.h1>
                            <motion.p
                                className="text-muted-foreground text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Discover our complete collection of wall art
                                designed to transform any space
                            </motion.p>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Bar */}

                {/* Products Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            className={`grid gap-6 md:gap-8 ${
                                gridCols === 2
                                    ? "grid-cols-1 sm:grid-cols-2"
                                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            }`}
                            layout
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredProduct(product.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredProduct(null)
                                        }
                                        className="group"
                                    >
                                        <Link to={`/product/${product.id}`}>
                                            <motion.div
                                                className="bg-card rounded-3xl overflow-hidden card-shine"
                                                whileHover={{ y: -8 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* Image Container */}
                                                <div className="relative aspect-[3/4] overflow-hidden">
                                                    <motion.img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        animate={{
                                                            scale:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 1.1
                                                                    : 1,
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                        }}
                                                    />

                                                    {/* Overlay */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-foreground/20"
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 1
                                                                    : 0,
                                                        }}
                                                    />

                                                    {/* Quick actions */}
                                                    <motion.div
                                                        className="absolute top-4 right-4"
                                                        initial={{
                                                            opacity: 0,
                                                            scale: 0.8,
                                                        }}
                                                        animate={{
                                                            opacity:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 1
                                                                    : 0,
                                                            scale:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 1
                                                                    : 0.8,
                                                        }}
                                                    >
                                                        <button className="p-3 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg">
                                                            <Heart className="h-5 w-5" />
                                                        </button>
                                                    </motion.div>

                                                    {/* Add to cart button */}
                                                    <motion.div
                                                        className="absolute bottom-4 left-4 right-4"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 1
                                                                    : 0,
                                                            y:
                                                                hoveredProduct ===
                                                                product.id
                                                                    ? 0
                                                                    : 20,
                                                        }}
                                                    >
                                                        <Button
                                                            className="w-full"
                                                            variant="default"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAddToCart(
                                                                    product,
                                                                );
                                                            }}
                                                        >
                                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                                            Add to Cart
                                                        </Button>
                                                    </motion.div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-5">
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    {product.tags.length >
                                                        0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {product.tags
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        i,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs cursor-pointer hover:bg-primary/20"
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                setSelectedTag(
                                                                                    tag,
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                        </div>
                                                    )}
                                                    <p className="text-xl font-bold text-primary mt-2">
                                                        ₹{product.price}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        3 for ₹130 • 5 for ₹200
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Load More */}
                        <motion.div
                            className="text-center mt-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <Button variant="outline" size="lg">
                                Load More Posters
                            </Button>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default Shop;
