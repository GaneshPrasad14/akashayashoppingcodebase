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
        <span className="absolute top-3 left-3 price-save">
          Save {savePercent}%
        </span>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-whatsapp text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? "star-filled fill-current" : "star-empty"}`}
            />
          ))}
        </div>

        {/* Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="price-offer">₹{offerPrice.toLocaleString()}</span>
          <span className="price-original">₹{originalPrice.toLocaleString()}</span>
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
