import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Tag, Truck, RefreshCw, Headphones, Shield, Coins, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { heroImage, faqs, whyChooseUs } from "@/data/siteData";
import ReviewDialog from "@/components/ReviewDialog";

interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  mainImage: string;
  category: { name: string; _id: string };
  description: string;
  isFeatured: boolean;
  stock: number;
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  product: { name: string };
  createdAt: string;
}

const iconMap: Record<string, React.ElementType> = {
  Award,
  Tag,
  Truck,
  RefreshCw,
  Headphones,
  Shield,
};

const Index = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035/api";
  const UPLOADS_URL = API_BASE_URL.replace('/api', ''); // Remove /api for image URLs
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappUrl = "https://wa.me/919787972500?text=Hello! I'm interested in shopping at Akshaya Shopping.";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/public/categories`),
          fetch(`${API_BASE_URL}/public/products?isFeatured=true`),
          fetch(`${API_BASE_URL}/public/reviews?isApproved=true&limit=3`)
        ]);

        const [categoriesData, productsData, reviewsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
          reviewsRes.json()
        ]);

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        if (productsData.success) {
          setProducts(productsData.data);
        }
        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
        <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]}>
          <CarouselContent>
            {/* Gold Coin Offer Slide */}
            <CarouselItem>
              <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 animate-fade-in-up">
                    <div>
                      <span className="inline-block text-sm font-medium text-primary bg-primary-light px-4 py-2 rounded-full mb-6">
                        🏆 Exclusive Reward Program
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                        Win a Gold Coin{" "}
                        <span className="gradient-text">FREE!</span>
                      </h1>
                      <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-lg">
                        Be one of the first 5 customers to shop and receive a complimentary gold coin as our special thank you gift! The first customer gets a 5-gram gold coin, and the next four customers get 1-gram gold coins each.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/shop">
                        <Button className="btn-primary text-base px-8 py-6 gap-2">
                          Shop Now
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                      <Link to="/gold-winners">
                        <Button className="btn-whatsapp text-base px-8 py-6 gap-2">
                          <Trophy className="w-5 h-5" />
                          View WinnersHub
                        </Button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-6 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">1st</p>
                        <p className="text-sm text-muted-foreground">5g Gold Coin</p>
                      </div>
                      <div className="w-px h-12 bg-border"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">2-5th</p>
                        <p className="text-sm text-muted-foreground">1g Gold Coin</p>
                      </div>
                      <div className="w-px h-12 bg-border"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">5</p>
                        <p className="text-sm text-muted-foreground">Lucky Winners</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative animate-fade-in delay-300">
                    <div className="relative rounded-3xl overflow-hidden shadow-elegant">
                      <img
                        src="/GoldCoin.jpeg"
                        alt="Gold coin reward for first 5 customers"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elegant animate-float">
                      <Coins className="w-8 h-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Special Prize</p>
                      <p className="text-lg font-bold text-primary">Gold Coins</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Main Hero Slide */}
            <CarouselItem>
              <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 animate-fade-in-up">
                    <div>
                      <span className="inline-block text-sm font-medium text-primary bg-primary-light px-4 py-2 rounded-full mb-6">
                        ✨ Premium Shopping Experience
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                        Bringing Dreams{" "}
                        <span className="gradient-text">Home</span>
                      </h1>
                      <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-lg">
                        Discover premium products at unbeatable prices. Your trusted shopping destination in Kanchipuram.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/shop">
                        <Button className="btn-primary text-base px-8 py-6 gap-2">
                          Shop Now
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="btn-whatsapp text-base px-8 py-6">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          Enquire on WhatsApp
                        </Button>
                      </a>
                    </div>
                    <div className="flex items-center gap-6 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">500+</p>
                        <p className="text-sm text-muted-foreground">Products</p>
                      </div>
                      <div className="w-px h-12 bg-border"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">10K+</p>
                        <p className="text-sm text-muted-foreground">Happy Customers</p>
                      </div>
                      <div className="w-px h-12 bg-border"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">4.8★</p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative animate-fade-in delay-300">
                    <div className="relative rounded-3xl overflow-hidden shadow-elegant">
                      <img
                        src={heroImage}
                        alt="Premium lifestyle products from Akshaya Shopping"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elegant animate-float">
                      <p className="text-sm text-muted-foreground">Free Shipping</p>
                      <p className="text-lg font-bold text-primary">Above ₹999</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Marquee Banner */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <span className="text-primary-foreground font-medium">✨ Free Shipping Above ₹999</span>
              <span className="text-primary-foreground/50">|</span>
              <span className="text-primary-foreground font-medium">📦 COD Available</span>
              <span className="text-primary-foreground/50">|</span>
              <span className="text-primary-foreground font-medium">🔄 Easy 7-Day Returns</span>
              <span className="text-primary-foreground/50">|</span>
              <span className="text-primary-foreground font-medium">💯 100% Genuine Products</span>
              <span className="text-primary-foreground/50">|</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <SectionHeader
            title="Shop by Category"
            subtitle="Explore our curated collection of premium products across various categories"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard
                  name={category.name}
                  slug={category._id}
                  image={category.image ? `${UPLOADS_URL}${category.image}` : "/placeholder.svg"}
                  productCount={category.productCount}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked selection of our best-selling and most loved products"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.slice(0, 6).map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  image={product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg"}
                  originalPrice={product.price}
                  offerPrice={product.price}
                  rating={4.5}
                  reviewCount={0}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="btn-outline text-base px-8 py-6 gap-2">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container">
          <SectionHeader
            title="Why Choose Akshaya Shopping?"
            subtitle="We're committed to providing you with the best shopping experience"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              return (
                <div
                  key={item.title}
                  className="bg-card p-8 rounded-2xl text-center hover:shadow-elegant transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 mx-auto bg-primary-light rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeader
            title="What Our Customers Say"
            subtitle="Real reviews from real customers who love shopping with us"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, index) => (
              <div
                key={review._id}
                className="animate-fade-in-up bg-card p-6 rounded-2xl shadow-soft"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{review.customerName}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <ReviewDialog>
              <Button className="btn-outline text-base px-8 py-6 gap-2 cursor-pointer">
                <Star className="w-5 h-5" />
                Write a Review
                <ArrowRight className="w-5 h-5" />
              </Button>
            </ReviewDialog>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container max-w-3xl">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find quick answers to common questions about shopping with us"
          />
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.slice(0, 4).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border-none shadow-soft"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-10">
            <Link to="/faq">
              <Button className="btn-outline text-base px-8 py-6 gap-2">
                View All FAQs
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-foreground"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary-foreground"></div>
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers and discover the joy of shopping at Akshaya Shopping.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <Button className="bg-background text-primary hover:bg-background/90 text-base px-8 py-6 gap-2 font-semibold">
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <ReviewDialog>
              <Button className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-base px-8 py-6 gap-2 bg-transparent font-semibold cursor-pointer">
                <Star className="w-5 h-5" />
                Write a Review
              </Button>
            </ReviewDialog>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-base px-8 py-6 gap-2 bg-transparent font-semibold">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Chat with Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
