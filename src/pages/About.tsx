import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Leaf, Package, Sparkles, Star, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import SEOHead from "@/components/SEOHead";
import { faqSchema, breadcrumbSchema } from "@/utils/schemas";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";

const values = [
    {
        icon: Leaf,
        title: "Sustainable",
        description:
            "Eco-friendly materials and responsible printing practices",
    },
    {
        icon: Heart,
        title: "Passion-Driven",
        description:
            "Every design is crafted with love and attention to detail",
    },
    {
        icon: Star,
        title: "Quality First",
        description: "Premium paper and vibrant, long-lasting colors",
    },
    {
        icon: Package,
        title: "Fast Shipping",
        description: "Carefully packaged and delivered to your doorstep",
    },
];

const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "500+", label: "Unique Designs" },
    { number: "25", label: "Countries Shipped" },
    { number: "4.9", label: "Average Rating" },
];

const team = [
    {
        name: "Ansh Chourasiya",
        role: "Founder & Creative Director",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQFjURRvnToj0Q/profile-displayphoto-scale_400_400/B4DZoRakBjHsAg-/0/1761228767957?e=1769040000&v=beta&t=xr1g_GyL6uCbHBX51z_CVQS_rMHzY24pbsIh0XgPdWU",
    },
    {
        name: "Nikhil Sharma",
        role: "Operations Manager",
        image: "https://www.thatguynikhil.me/nikhilSharma.png",
    },
    {
        name: "Ashish LundPakdu",
        role: "Lead Designer",
        image: "https://www.ledr.com/colours/black.jpg",
    },
];

const About = () => {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

    const faqs = [
        {
            question: "What is Somthing?",
            answer: "Somthing is a premium wall art poster shop offering unique designs for modern homes. We specialize in abstract art, botanical prints, travel posters, and line art."
        },
        {
            question: "Where do you ship?",
            answer: "We ship to 25 countries worldwide with fast and reliable shipping partners."
        },
        {
            question: "What materials do you use?",
            answer: "We use eco-friendly materials and premium paper with vibrant, long-lasting colors for all our prints."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 5-7 business days within the US and 10-14 days internationally."
        },
    ];

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "About", url: "https://somthing-ten.vercel.app/about" },
    ]);

    const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [faqSchema(faqs), breadcrumbs],
    };

    return (
        <>
            <SEOHead
                title="About Us | Somthing - Premium Wall Art Posters"
                description="Learn about Somthing's journey from a small studio to a global community. Discover our values, team, and mission to make beautiful art accessible to everyone."
                keywords="about somthing, wall art story, poster company, sustainable art prints"
                canonical="/about"
                schema={combinedSchema}
            />
            <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section with Parallax */}
            <section
                ref={heroRef}
                className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
            >
                {/* Animated background */}
                <motion.div className="absolute inset-0" style={{ y: heroY }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
                    <motion.div
                        className="absolute top-20 left-20 w-72 h-72 bg-primary/20 blob-shape"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 blob-shape"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </motion.div>

                <motion.div
                    className="container mx-auto px-4 md:px-6 relative z-10 text-center"
                    style={{ opacity: heroOpacity, scale: heroScale }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8"
                    >
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium text-sm uppercase tracking-widest">
                            Our Story
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {"We Make Walls".split("").map((char, i) => (
                            <motion.span
                                key={i}
                                className="inline-block"
                                initial={{ opacity: 0, y: 50, rotate: -10 }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{
                                    delay: 0.3 + i * 0.03,
                                    duration: 0.5,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                        <br />
                        <span className="text-gradient">Speak</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        Somthing started with a simple idea: everyone deserves
                        beautiful art that doesn't break the bank.
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
                            <motion.div
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Images with staggered animation */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="relative z-10"
                                initial={{ x: -100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <img
                                    src={poster1}
                                    alt="Our story"
                                    className="rounded-3xl shadow-warm w-full max-w-md"
                                />
                            </motion.div>
                            <motion.div
                                className="absolute top-20 -right-10 z-20"
                                initial={{ x: 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <img
                                    src={poster2}
                                    alt="Our process"
                                    className="rounded-3xl shadow-lg w-48 md:w-64 border-4 border-background"
                                />
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-10 left-20 z-0"
                                initial={{ y: 100, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="w-40 h-40 bg-primary/20 blob-shape" />
                            </motion.div>
                        </motion.div>

                        {/* Text content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                From a Small Studio to Your Walls
                            </h2>
                            <div className="space-y-4 text-muted-foreground text-lg">
                                <p>
                                    It all started in a tiny apartment in 2020.
                                    Armed with a passion for design and a belief
                                    that art should be accessible to everyone,
                                    we printed our first poster on a home
                                    printer.
                                </p>
                                <p>
                                    Today, Somthing has grown into a global
                                    community of art lovers. We've shipped over
                                    50,000 posters to homes in 25 countries, but
                                    our mission remains the same: to help you
                                    express yourself through beautiful,
                                    affordable wall art.
                                </p>
                                <p>
                                    Every poster we create tells a story. And
                                    now, they're part of yours.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="text-center max-w-2xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary font-medium text-sm uppercase tracking-widest">
                            What We Believe In
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-4">
                            Our Values
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                className="text-center group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <motion.div
                                    className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <value.icon className="h-8 w-8 text-primary" />
                                </motion.div>
                                <h3 className="text-xl font-bold mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-foreground text-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.1,
                                    type: "spring",
                                }}
                            >
                                <motion.div
                                    className="text-4xl md:text-5xl font-bold text-primary mb-2"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-background/70">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="text-center max-w-2xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary font-medium text-sm uppercase tracking-widest">
                            The People Behind Somthing
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-4">
                            Meet Our Team
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className="text-center group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <motion.div
                                    className="relative mb-6 overflow-hidden rounded-3xl"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    />
                                </motion.div>
                                <h3 className="text-xl font-bold">
                                    {member.name}
                                </h3>
                                <p className="text-muted-foreground">
                                    {member.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
            <Footer />
        </div>
        </>
    );
};

export default About;
