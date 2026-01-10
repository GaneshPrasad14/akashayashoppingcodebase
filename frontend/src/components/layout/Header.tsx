import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "Shop", path: "/shop" },
  { name: "WinnersHub", path: "/gold-winners" },
  { name: "Blog", path: "/blog" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p className="flex items-center justify-center gap-2 text-sm">
          ✨ Free Shipping on Orders Above ₹999 | COD Available 📦
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-soft"
          : "bg-background"
          }`}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-3 h-20 items-center">
            {/* Desktop Navigation / Mobile Menu Toggle */}
            <div className="flex items-center justify-start">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`nav-link text-sm ${location.pathname === link.path
                      ? "text-primary font-semibold"
                      : ""
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Logo - Center */}
            <Link to="/" className="flex items-center gap-2 justify-center">
              <img src="/logo.png" alt="Akshaya Shopping" className="h-12 md:h-16 w-auto" />
            </Link>

            {/* Actions - Right */}
            <div className="flex items-center gap-4 justify-end">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-secondary/50 rounded-full px-3 py-1.5 border border-transparent focus-within:border-primary transition-all">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all placeholder:text-muted-foreground/70"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.currentTarget as HTMLInputElement).value;
                      if (query.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(query)}`;
                      }
                    }
                  }}
                />
              </div>

              <Link to="/reviews" className="p-2 hover:bg-secondary rounded-full transition-colors hidden md:flex" title="Customer Reviews">
                <Star className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link to="/cart" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </Link>
              <a
                href="tel:9787972500"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>9787972500</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-background border-b border-border transition-all duration-300 ${isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
            }`}
        >
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 text-lg font-medium transition-colors ${location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:9787972500"
              className="flex items-center gap-2 py-2 text-lg font-medium text-primary"
            >
              <Phone className="w-5 h-5" />
              Call: 9787972500
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
