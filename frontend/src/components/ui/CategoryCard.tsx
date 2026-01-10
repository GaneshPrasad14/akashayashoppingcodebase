import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  slug: string;
  productCount?: number;
}

export const CategoryCard = ({ name, image, slug, productCount }: CategoryCardProps) => {
  return (
    <Link to={`/shop?category=${slug}`} className="category-card block aspect-[4/5] group">
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1">
          {name}
        </h3>
        {productCount !== undefined && (
          <p className="text-white/70 text-sm mb-3">{productCount} Products</p>
        )}
        <div className="flex items-center gap-2 text-white text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
