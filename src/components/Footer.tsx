import logo from "@/assets/logo.png";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer id="about" className="bg-foreground text-background py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="Somthing" className="h-10 w-auto mb-6 brightness-0 invert" />
            <p className="text-background/70 mb-6">
              Transforming walls into galleries since 2023. Quality art prints 
              that make your space uniquely yours.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">All Posters</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Collections</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Abstract</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Botanical</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Travel</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Line Art</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} Somthing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
