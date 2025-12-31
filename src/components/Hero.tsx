import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import poster1 from "@/assets/poster1.png";
import poster2 from "@/assets/poster2.png";
import poster3 from "@/assets/poster3.png";

const Hero = () => {
    return (
        <section className="relative min-h-screen pt-20 overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blob-shape animate-blob" />
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blob-light/30 blob-shape animate-blob-slow" />
                <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/10 blob-shape animate-blob" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
                    {/* Left: Content */}
                    <div className="flex flex-col justify-center space-y-8 py-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit animate-fade-up">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                New arrivals are here
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-up delay-100">
                            Art that makes
                            <br />
                            <span className="text-gradient">
                                your walls speak
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-up delay-200">
                            Discover unique posters that transform your space.
                            From abstract art to botanical prints — find the
                            perfect piece for every room.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
                            <Button variant="hero">
                                Shop Now
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <Button variant="hero-outline">
                                View Collections
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-4 animate-fade-up delay-400">
                            <div>
                                <p className="text-3xl font-bold text-foreground">
                                    500+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Unique Designs
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">
                                    10k+
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Happy Customers
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">
                                    4.9
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Star Rating
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Floating Posters */}
                    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] hidden md:block">
                        {/* Main poster */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 lg:w-72 animate-float shadow-2xl rounded-2xl overflow-hidden">
                            <img
                                src={poster1}
                                alt="Abstract geometric poster"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Left poster */}
                        <div className="absolute top-20 left-0 w-44 lg:w-52 animate-float-delayed shadow-xl rounded-2xl overflow-hidden rotate-[-8deg]">
                            <img
                                src={poster2}
                                alt="Botanical poster"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Right poster */}
                        <div className="absolute bottom-24 right-0 w-40 lg:w-48 animate-float-slow shadow-xl rounded-2xl overflow-hidden rotate-[5deg]">
                            <img
                                src={poster3}
                                alt="Retro travel poster"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-10 right-20 w-16 h-16 bg-primary/30 rounded-full animate-float blur-sm" />
                        <div className="absolute bottom-32 left-16 w-12 h-12 bg-accent/40 rounded-full animate-float-delayed blur-sm" />
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="hsl(var(--secondary))"
                    />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
