import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <img src="/logo.png" alt="Akshaya Shopping" className="h-16 w-auto" />
            <p className="text-background/70 text-sm leading-relaxed">
              Bringing Dreams Home - Your trusted destination for premium products 
              with exceptional quality and service.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-background text-lg mb-6">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="footer-link text-sm">Home</Link>
              <Link to="/categories" className="footer-link text-sm">Categories</Link>
              <Link to="/shop" className="footer-link text-sm">Shop</Link>
              <Link to="/blog" className="footer-link text-sm">Blog</Link>
              <Link to="/faq" className="footer-link text-sm">FAQ</Link>
              <Link to="/contact" className="footer-link text-sm">Contact</Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-background text-lg mb-6">Categories</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/shop?category=electronics" className="footer-link text-sm">Electronics</Link>
              <Link to="/shop?category=home-appliances" className="footer-link text-sm">Home Appliances</Link>
              <Link to="/shop?category=fashion" className="footer-link text-sm">Fashion</Link>
              <Link to="/shop?category=kitchen" className="footer-link text-sm">Kitchen</Link>
              <Link to="/shop?category=lifestyle" className="footer-link text-sm">Lifestyle</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-background text-lg mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                <p className="text-background/70 text-sm">
                  No.22, Pattala Street,<br />
                  Little Kanchipuram – 631501
                </p>
              </div>
              <a
                href="tel:9787972500"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm">9787972500</span>
              </a>
              <a
                href="mailto:msarun.kal@gmail.com"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm">msarun.kal@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm text-center md:text-left">
            © {currentYear} Akshaya Shopping. All rights reserved. Owned by M. S. Arun
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/60 hover:text-background text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/60 hover:text-background text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
