import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Heart,
    ShoppingCart,
    SlidersHorizontal,
    Grid3X3,
    LayoutGrid,
    X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { breadcrumbSchema } from "@/utils/schemas";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";
import poster4 from "@/assets/poster4.png";
import poster5 from "@/assets/poster5.png";
import poster6 from "@/assets/poster6.png";

const allProducts = [
    {
        id: 1,
        name: "Desert Sunrise",
        category: "Abstract",
        price: 29.99,
        image: poster1,
    },
    {
        id: 2,
        name: "Tropical Dreams",
        category: "Botanical",
        price: 34.99,
        image: poster2,
    },
    {
        id: 3,
        name: "Sunset Paradise",
        category: "Travel",
        price: 27.99,
        image: poster3,
    },
    {
        id: 4,
        name: "Elegant Portrait",
        category: "Line Art",
        price: 24.99,
        image: poster4,
    },
    {
        id: 5,
        name: "Ocean Waves",
        category: "Abstract",
        price: 32.99,
        image: poster5,
    },
    {
        id: 6,
        name: "Autumn Circles",
        category: "Abstract",
        price: 28.99,
        image: poster6,
    },
    {
        id: 7,
        name: "Forest Whispers",
        category: "Botanical",
        price: 31.99,
        image: poster2,
    },
    {
        id: 8,
        name: "City Lights",
        category: "Travel",
        price: 35.99,
        image: poster3,
    },
    {
        id: 9,
        name: "Minimal Lines",
        category: "Line Art",
        price: 22.99,
        image: poster4,
    },
    {
        id: 10,
        name: "Abstract Fusion",
        category: "Abstract",
        price: 38.99,
        image: poster1,
    },
    {
        id: 11,
        name: "Zen Garden",
        category: "Botanical",
        price: 29.99,
        image: poster2,
    },
    {
        id: 12,
        name: "Mountain Peak",
        category: "Travel",
        price: 33.99,
        image: poster3,
    },
];

const categories = ["All", "Abstract", "Botanical", "Travel", "Line Art"];
const sortOptions = [
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Popular",
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(
        categoryParam
            ? categories.find((c) => c.toLowerCase() === categoryParam) || "All"
            : "All"
    );
    const [sortBy, setSortBy] = useState("Newest");
    const [showFilters, setShowFilters] = useState(false);
    const [gridCols, setGridCols] = useState(3);
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    const filteredProducts = allProducts
        .filter(
            (p) => selectedCategory === "All" || p.category === selectedCategory
        )
        .sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            return 0;
        });

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing.com/" },
        { name: "Shop", url: "https://somthing.com/shop" },
    ]);

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
            <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border py-4">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        selectedCategory === category
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Grid Toggle */}
                            <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-1">
                                <button
                                    onClick={() => setGridCols(2)}
                                    className={`p-2 rounded ${
                                        gridCols === 2
                                            ? "bg-background shadow-sm"
                                            : ""
                                    }`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setGridCols(3)}
                                    className={`p-2 rounded ${
                                        gridCols === 3
                                            ? "bg-background shadow-sm"
                                            : ""
                                    }`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium border-0 focus:ring-2 focus:ring-primary"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            {/* Filter Button (Mobile) */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

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
                                    onMouseLeave={() => setHoveredProduct(null)}
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
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
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
                                                <p className="text-xl font-bold text-primary mt-2">
                                                    ${product.price}
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
