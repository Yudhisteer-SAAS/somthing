import { useRef, useEffect, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";
import poster4 from "@/assets/poster4.png";

const categories = [
    {
        id: 1,
        name: "Abstract",
        count: 124,
        gradient: "from-primary/90 via-accent/70 to-primary/50",
        image: poster1,
        description: "Bold shapes & vibrant colors",
    },
    {
        id: 2,
        name: "Botanical",
        count: 89,
        gradient: "from-emerald-500/90 via-teal-400/70 to-emerald-600/50",
        image: poster2,
        description: "Nature's finest details",
    },
    {
        id: 3,
        name: "Travel",
        count: 67,
        gradient: "from-sky-500/90 via-indigo-400/70 to-violet-500/50",
        image: poster3,
        description: "Explore the world",
    },
    {
        id: 4,
        name: "Line Art",
        count: 156,
        gradient: "from-rose-400/90 via-pink-400/70 to-fuchsia-500/50",
        image: poster4,
        description: "Minimalist elegance",
    },
];

// Marquee text items
const marqueeItems = [
    "Abstract Art",
    "✦",
    "Wall Decor",
    "✦",
    "Premium Quality",
    "✦",
    "Free Shipping",
    "✦",
    "Botanical",
    "✦",
    "Line Art",
    "✦",
    "Travel Posters",
    "✦",
];

// 3D Card Component with cursor tracking
const Card3D = ({
    category,
    index,
}: {
    category: (typeof categories)[0];
    index: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        setRotateX(-mouseY / 15);
        setRotateY(mouseX / 15);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 100, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.23, 1, 0.32, 1],
            }}
            className="perspective-1000"
        >
            <Link to={`/shop?category=${category.name.toLowerCase()}`}>
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    animate={{
                        rotateX,
                        rotateY,
                        scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer group"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Background Image with parallax */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ scale: isHovered ? 1.15 : 1 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} mix-blend-multiply opacity-80`}
                    />

                    {/* Animated mesh gradient */}
                    <motion.div
                        className="absolute inset-0 opacity-50"
                        animate={{
                            background: isHovered
                                ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)"
                                : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 70%)",
                        }}
                    />

                    {/* Floating particles */}
                    {isHovered && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                                    initial={{
                                        x: Math.random() * 100 - 50,
                                        y: 100,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        y: -100,
                                        opacity: [0, 1, 0],
                                        x: Math.random() * 200 - 100,
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                    style={{ left: `${20 + i * 12}%` }}
                                />
                            ))}
                        </>
                    )}

                    {/* Content with 3D depth */}
                    <motion.div
                        className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white"
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <div>
                            {/* Category badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm"
                            >
                                <Sparkles className="h-3 w-3" />
                                {category.count} posters
                            </motion.div>

                            {/* Title with split reveal */}
                            <motion.h3
                                className="text-3xl md:text-4xl font-bold mt-4"
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.4 + index * 0.1,
                                }}
                            >
                                {category.name}
                            </motion.h3>

                            <motion.p
                                className="text-white/80 mt-2 text-lg"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                {category.description}
                            </motion.p>
                        </div>

                        {/* CTA with magnetic effect */}
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 20,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="font-semibold text-lg">
                                Explore Collection
                            </span>
                            <motion.div
                                animate={{ x: isHovered ? 8 : 0 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <ArrowRight className="h-5 w-5" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Shine effect on hover */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                            background: isHovered
                                ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, transparent 50%)"
                                : "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0) 45%, transparent 50%)",
                            backgroundPosition: isHovered
                                ? "200% 0"
                                : "-200% 0",
                        }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.div>
            </Link>
        </motion.div>
    );
};

// Horizontal scrolling image gallery
const ImageScrollGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [-200, 0]);

    const images = [poster1, poster2, poster3, poster4, poster1, poster2];

    return (
        <div ref={containerRef} className="py-12 overflow-hidden">
            <motion.div className="flex gap-4 mb-4" style={{ x: x1 }}>
                {images.map((img, i) => (
                    <motion.div
                        key={i}
                        className="flex-shrink-0 w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                    >
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div className="flex gap-4" style={{ x: x2 }}>
                {[...images].reverse().map((img, i) => (
                    <motion.div
                        key={i}
                        className="flex-shrink-0 w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden"
                        whileHover={{ scale: 1.05, rotate: -2 }}
                    >
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

// Cursor follower component
const CursorFollower = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border-2 border-primary mix-blend-difference hidden md:block"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
            }}
        />
    );
};

const Categories = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

    return (
        <section
            ref={sectionRef}
            id="collections"
            className="py-20 md:py-32 bg-background relative overflow-hidden"
        >
            <CursorFollower />

            {/* Animated background elements with parallax */}
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blob-shape"
                style={{ y: parallaxY }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blob-shape"
                style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Animated Section Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    style={{ opacity, scale }}
                >
                    {/* Animated badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
                    >
                        <motion.span
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✦
                        </motion.span>
                        <span className="text-primary font-medium text-sm uppercase tracking-widest">
                            Browse by Style
                        </span>
                        <motion.span
                            animate={{ rotate: [0, -15, 15, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.5,
                            }}
                        >
                            ✦
                        </motion.span>
                    </motion.div>

                    {/* Title with character animation */}
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {"Find your vibe".split("").map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 50, rotate: -10 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.03,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                className="inline-block"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h2>

                    <motion.p
                        className="text-muted-foreground text-lg md:text-xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        Whether you love minimalist designs or bold statements,
                        we've got the perfect collection waiting for you.
                    </motion.p>
                </motion.div>

                {/* Horizontal scroll gallery */}
                <ImageScrollGallery />

                {/* Animated Marquee */}
                <div className="py-8 overflow-hidden border-y border-border/50 my-12">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[
                            ...marqueeItems,
                            ...marqueeItems,
                            ...marqueeItems,
                        ].map((item, i) => (
                            <span
                                key={i}
                                className={`text-2xl md:text-3xl font-bold ${
                                    item === "✦"
                                        ? "text-primary"
                                        : "text-foreground/20"
                                }`}
                            >
                                {item}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* 3D Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {categories.map((category, index) => (
                        <Card3D
                            key={category.id}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA with animation */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <Link to="/shop">
                        <motion.button
                            className="group relative px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="absolute inset-0 bg-primary"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 flex items-center gap-2">
                                View All Collections
                                <motion.span
                                    className="inline-block"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                >
                                    →
                                </motion.span>
                            </span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Categories;
