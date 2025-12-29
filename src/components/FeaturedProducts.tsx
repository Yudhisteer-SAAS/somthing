import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import poster1 from "@/assets/poster1.jpg";
import poster2 from "@/assets/poster2.jpg";
import poster3 from "@/assets/poster3.jpg";
import poster4 from "@/assets/poster4.jpg";
import poster5 from "@/assets/poster5.jpg";
import poster6 from "@/assets/poster6.jpg";

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
  return (
    <section id="shop" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            Featured Collection
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Posters you'll love
          </h2>
          <p className="text-muted-foreground text-lg">
            Hand-picked designs that bring life to any space. Each poster is printed 
            on premium paper with vibrant, long-lasting colors.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group poster-card bg-card rounded-3xl overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300" />
                
                {/* Quick actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-3 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                {/* Add to cart button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Button className="w-full" variant="default">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
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
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Posters
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
