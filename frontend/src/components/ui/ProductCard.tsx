import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  offerPrice: number;
  rating: number;
  reviewCount: number;
}

const ProductCard = ({
  id,
  name,
  image,
  originalPrice,
  offerPrice,
  rating,
  reviewCount,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const savePercent = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  const whatsappUrl = `https://wa.me/919787972500?text=${encodeURIComponent(`Hi! I'm interested in ${name} (₹${offerPrice})`)}`;

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price: offerPrice,
      image,
    });
    toast.success(`${name} added to cart!`, {
      duration: 2000,
    });
  };

  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Save Badge */}
        {savePercent > 0 && (
          <span className="absolute top-3 left-3 price-save">
            Save {savePercent}%
          </span>
        )}

        {/* Quick Actions */}

      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="price-offer">₹{offerPrice.toLocaleString()}</span>
          {originalPrice > offerPrice && (
            <span className="price-original text-muted-foreground line-through text-sm">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="flex gap-2">
          <Button
            className="flex-1 btn-primary text-sm gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          <Button
            className="btn-outline text-sm"
            onClick={() => {
              // Add to cart and redirect to checkout
              addToCart({
                id,
                name,
                price: offerPrice,
                image,
              });
              toast.success(`${name} added to cart!`, {
                duration: 2000,
              });
              // Redirect to checkout after a short delay
              setTimeout(() => {
                window.location.href = '/checkout';
              }, 1000);
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
