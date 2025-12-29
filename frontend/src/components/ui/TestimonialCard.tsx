import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rating: number;
  review: string;
  avatar?: string;
  date?: string;
}

const TestimonialCard = ({ name, rating, review, avatar, date }: TestimonialCardProps) => {
  return (
    <div className="testimonial-card relative">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "star-filled fill-current" : "star-empty"}`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-foreground/80 text-sm leading-relaxed mb-6">
        "{review}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-foreground text-sm">{name}</p>
          {date && (
            <p className="text-muted-foreground text-xs">{date}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
