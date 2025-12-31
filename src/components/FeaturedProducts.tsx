import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";
import poster4 from "@/assets/poster4.png";
import poster5 from "@/assets/poster5.png";
import poster6 from "@/assets/poster6.png";

const products = [
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
        category: "Japanese",
        price: 32.99,
        image: poster5,
    },
    {
        id: 6,
        name: "Autumn Circles",
        category: "Mid-Century",
        price: 28.99,
        image: poster6,
    },
];

const FeaturedProducts = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const headerY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section
            ref={sectionRef}
            id="shop"
            className="py-20 md:py-32 bg-secondary overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header with scroll animation */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    style={{ y: headerY, opacity: headerOpacity }}
                >
                    <motion.span
                        className="inline-block text-primary font-medium text-sm uppercase tracking-widest"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        Featured Collection
                    </motion.span>
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Posters you'll love
                    </motion.h2>
                    <motion.p
                        className="text-muted-foreground text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Hand-picked designs that bring life to any space. Each
                        poster is printed on premium paper with vibrant,
                        long-lasting colors.
                    </motion.p>
                </motion.div>

                {/* Products Grid with staggered animation */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <Link to={`/product/${product.id}`}>
                                <motion.div
                                    className="group bg-card rounded-3xl overflow-hidden card-shine"
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
                                                    hoveredId === product.id
                                                        ? 1.1
                                                        : 1,
                                            }}
                                            transition={{ duration: 0.6 }}
                                        />

                                        {/* Overlay on hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-foreground/20"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity:
                                                    hoveredId === product.id
                                                        ? 1
                                                        : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />

                                        {/* Quick actions */}
                                        <motion.div
                                            className="absolute top-4 right-4"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity:
                                                    hoveredId === product.id
                                                        ? 1
                                                        : 0,
                                                scale:
                                                    hoveredId === product.id
                                                        ? 1
                                                        : 0.8,
                                            }}
                                        >
                                            <button
                                                className="p-3 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Heart className="h-5 w-5" />
                                            </button>
                                        </motion.div>

                                        {/* Add to cart button */}
                                        <motion.div
                                            className="absolute bottom-4 left-4 right-4"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity:
                                                    hoveredId === product.id
                                                        ? 1
                                                        : 0,
                                                y:
                                                    hoveredId === product.id
                                                        ? 0
                                                        : 20,
                                            }}
                                            transition={{ duration: 0.3 }}
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
                </div>

                {/* View All Button with animation */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link to="/shop">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button variant="outline" size="lg">
                                View All Posters
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
