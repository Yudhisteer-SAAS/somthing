import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast({
        title: "Welcome to the club! 🎉",
        description: "You'll be the first to know about new arrivals and exclusive offers.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-32 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 blob-shape animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 blob-shape animate-blob-slow" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-8">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Get 15% off your first order
          </h2>
          
          {/* Subheadline */}
          <p className="text-primary-foreground/80 text-lg mb-10">
            Subscribe to our newsletter and be the first to know about new arrivals, 
            special offers, and exclusive deals.
          </p>

          {/* Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-6 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-full focus:bg-white/20"
                required
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-white text-primary hover:bg-white/90 rounded-full font-semibold"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-primary-foreground">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">You're on the list!</span>
            </div>
          )}

          {/* Trust text */}
          <p className="text-primary-foreground/60 text-sm mt-6">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
