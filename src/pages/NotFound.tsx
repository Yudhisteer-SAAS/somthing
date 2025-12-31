import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Somthing"
        description="The page you're looking for doesn't exist. Browse our collection of premium wall art posters."
        canonical="/404"
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 mb-4">
            404
          </h1>
          
          {/* Main heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Page Not Found
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link to="/shop">
                <Search className="mr-2 h-5 w-5" />
                Browse Shop
              </Link>
            </Button>
          </div>

          {/* Additional navigation */}
          <div className="mt-12 pt-12 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Popular Pages
            </h3>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/cart" className="text-foreground hover:text-primary transition-colors">
                Cart
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

