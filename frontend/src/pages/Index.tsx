import { API_BASE_URL } from "@/config";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RefreshCw, Headphones, Shield, Coins, Star, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { heroImage, faqs } from "@/data/siteData";
import heroCookerImage from "@/assets/h.jpeg";
import ReviewDialog from "@/components/ReviewDialog";
import { useState, useEffect } from "react";

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
  originalPrice?: number;
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

const Index = () => {
  const UPLOADS_URL = API_BASE_URL.replace('/api', '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [, setLoading] = useState(true);

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

        if (categoriesData.success) setCategories(categoriesData.data);
        if (productsData.success) setProducts(productsData.data);
        if (reviewsData.success) setReviews(reviewsData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  return (
    <main className="overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section className="relative min-h-[95vh] flex items-center bg-[#fdfbf7] overflow-hidden">
        {/* Abstract Background Shapes (Persistent) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f5efe6] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 6000 })]}>
          <CarouselContent>
            {/* Slide 1: Shop & Products */}
            <CarouselItem className="flex items-center justify-center min-h-[95vh] pt-20">
              <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm text-primary text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>Limited Time Offer</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1]">
                      Ultimate Kitchen <br />
                      <span className="relative">
                        <span className="relative z-10 text-primary">Combo</span>
                        <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/20 -rotate-2 -z-0"></span>
                      </span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                      Buy our premium <span className="text-foreground font-semibold">Pressure Cooker Set</span> &
                      <span className="text-yellow-600 font-bold block mt-2 text-2xl">win a Gold Coin! 🪙</span>
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link to="/shop">
                        <Button className="h-14 px-8 rounded-full text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                          Shop Combo
                        </Button>
                      </Link>
                      <Link to="/gold-winners">
                        <Button variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary/50">
                          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                          View Winners
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-8 pt-8 border-t border-border/50">
                      <div>
                        <h3 className="text-3xl font-bold font-display">Best</h3>
                        <p className="text-muted-foreground">Seller</p>
                      </div>
                      <div className="w-px h-12 bg-border/50" />
                      <div>
                        <h3 className="text-3xl font-bold font-display">100%</h3>
                        <p className="text-muted-foreground">Quality</p>
                      </div>
                      <div className="w-px h-12 bg-border/50" />
                      <div>
                        <img src="/be.png" alt="Brand Excellence" className="h-16 object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="relative lg:block">
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 bg-white p-2">
                      <div className="rounded-[2.5rem] overflow-hidden relative aspect-[4/5] md:aspect-square">
                        <img
                          src={heroCookerImage}
                          alt="Pressure Cooker Combo"
                          className="w-full h-full object-contain transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Gold Coin Contest */}
            <CarouselItem className="flex items-center justify-center min-h-[95vh] pt-20">
              <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 shadow-sm text-yellow-700 text-sm font-medium">
                      <Trophy className="w-4 h-4" />
                      <span>Daily Winners Announced</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1]">
                      Win <span className="text-yellow-500">Gold Coins</span> <br />
                      Every Single Day!
                    </h1>

                    <div className="space-y-4 text-xl text-muted-foreground">
                      <p>Shop with us and stand a chance to be one of our 5 daily lucky winners.</p>
                      <ul className="space-y-3 mt-4">
                        <li className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold border border-yellow-300">1</span>
                          <span className="font-semibold text-foreground">1st Prize:</span>
                          <span className="text-yellow-600 font-bold">5 Grams Gold Coin 🪙</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold border border-gray-300">4</span>
                          <span className="font-semibold text-foreground">Runners Up:</span>
                          <span className="text-yellow-600 font-bold">1 Gram Gold Coin (Each)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link to="/shop">
                        <Button className="h-14 px-8 rounded-full text-lg bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/25 transition-all hover:scale-105">
                          Shop to Participate
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="relative flex justify-center items-center perspective-container">
                    {/* Royal Contrast Background */}
                    <div className="absolute inset-0 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none">
                      {/* Deep Dark Halo for Contrast */}
                      <div className="absolute inset-0 bg-radial-gradient from-amber-950/80 via-yellow-950/40 to-transparent blur-[80px] rounded-full mix-blend-multiply" />

                      {/* Rich Golden-Brown Glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-transparent to-transparent blur-[100px] rounded-full mix-blend-normal opacity-60" />

                      {/* Subtle Rotating Texture */}
                      <div className="absolute inset-0 bg-hero-rays opacity-20 animate-spin-slow mix-blend-overlay" />
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="particle"
                          style={{
                            left: `${50 + Math.random() * 40 - 20}%`,
                            top: `${50 + Math.random() * 40 - 20}%`,
                            '--tx': `${Math.random() * 100 - 50}px`,
                            '--ty': `${Math.random() * 100 - 50}px`,
                            animationDelay: `${Math.random() * 2}s`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>

                    <div className="relative z-10 flex items-center justify-center w-full max-w-2xl px-4 mt-8 md:mt-0">
                      {/* 5g Coin - Main - Enhanced 3D Animation */}
                      <div className="relative z-20 hover:scale-110 transition-transform duration-500 animate-float-complex">
                        <div className="group relative animate-rotate-3d-subtle">
                          {/* Ultra-Premium Liquid Gold Ring */}
                          {/* 1. Sweeping Molten Gold Light */}
                          <div className="absolute inset-[-15px] md:inset-[-25px] rounded-full bg-[conic-gradient(transparent,#F59E0B_45deg,transparent_90deg)] animate-spin-slow opacity-90 blur-md pointer-events-none" style={{ animationDuration: '3s' }} />
                          <div className="absolute inset-[-15px] md:inset-[-25px] rounded-full bg-[conic-gradient(transparent,#FCD34D_135deg,transparent_180deg)] animate-spin-slow opacity-70 blur-md pointer-events-none" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />

                          {/* 2. Sharp Definition Ring */}
                          <div className="absolute inset-[-8px] md:inset-[-12px] rounded-full border-[1.5px] border-yellow-200/60 shadow-[0_0_15px_rgba(251,191,36,0.6)] pointer-events-none" />

                          {/* 3. Star Shine Effect (Lens Flare) */}
                          <div className="absolute -top-4 -right-2 w-12 h-12 bg-white rounded-full mix-blend-overlay blur-md animate-pulse-slow opacity-80 z-30" />
                          <div className="absolute -top-6 -right-4 w-16 h-16 bg-gradient-to-tr from-transparent via-white to-transparent opacity-90 animate-spin-slow z-30" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 55% 45%, 100% 40%, 100% 60%, 55% 55%, 60% 100%, 40% 100%, 45% 55%, 0% 60%, 0% 40%, 45% 45%)', animationDuration: '4s' }} />
                          <div className="absolute bottom-10 -left-6 w-10 h-10 bg-gradient-to-tr from-transparent via-yellow-100 to-transparent opacity-80 animate-spin-slow z-30" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 55% 45%, 100% 40%, 100% 60%, 55% 55%, 60% 100%, 40% 100%, 45% 55%, 0% 60%, 0% 40%, 45% 45%)', animationDuration: '5s' }} />

                          <img
                            src="/5g.png"
                            alt="5g Gold Coin - 1st Prize"
                            className="w-[180px] h-[180px] md:w-[320px] md:h-[320px] object-contain drop-shadow-2xl"
                          />
                          {/* Shine Sweep Effect */}
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep" />
                          </div>
                        </div>

                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 md:px-6 md:py-2 rounded-full shadow-xl border border-yellow-100 whitespace-nowrap z-30">
                          <p className="text-[10px] md:text-sm font-bold text-yellow-700 uppercase tracking-wide">1st Prize</p>
                          <p className="text-xl md:text-2xl font-display font-bold text-yellow-600 leading-none">5g Coin</p>
                        </div>
                      </div>

                      {/* 1g Coin - Secondary - Enhanced */}
                      <div className="relative z-10 -ml-12 md:-ml-20 mt-12 hover:scale-110 transition-transform duration-500 animate-float-complex" style={{ animationDelay: '1.5s' }}>
                        <div className="group relative animate-rotate-3d-subtle" style={{ animationDelay: '1s' }}>
                          {/* Ultra-Premium Liquid Gold Ring */}
                          <div className="absolute inset-[-12px] md:inset-[-18px] rounded-full bg-[conic-gradient(transparent,#F59E0B_45deg,transparent_90deg)] animate-spin-slow opacity-80 blur-sm pointer-events-none" style={{ animationDuration: '4s' }} />

                          {/* Sharp Definition Ring */}
                          <div className="absolute inset-[-6px] md:inset-[-10px] rounded-full border border-yellow-200/50 shadow-[0_0_10px_rgba(251,191,36,0.5)] pointer-events-none" />

                          {/* Star Shine Effect */}
                          <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-tr from-transparent via-white to-transparent opacity-90 animate-spin-slow z-30" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 55% 45%, 100% 40%, 100% 60%, 55% 55%, 60% 100%, 40% 100%, 45% 55%, 0% 60%, 0% 40%, 45% 45%)', animationDuration: '6s' }} />

                          <img
                            src="/1g.png"
                            alt="1g Gold Coin - Runners Up"
                            className="w-[140px] h-[140px] md:w-[240px] md:h-[240px] object-contain drop-shadow-xl grayscale-[10%]"
                          />
                          {/* Shine Sweep Effect */}
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-sweep" style={{ animationDelay: '2s' }} />
                          </div>
                        </div>

                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 md:px-6 md:py-2 rounded-full shadow-xl border border-yellow-100 whitespace-nowrap z-30">
                          <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wide">4 Winners</p>
                          <p className="text-lg md:text-xl font-display font-bold text-yellow-600 leading-none">1g Coin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4 lg:left-8" />
          <CarouselNext className="right-4 lg:right-8" />
        </Carousel>
      </section>

      {/* Modern Bento Category Grid */}
      <section className="py-12 md:py-24 bg-white relative">
        <div className="container">
          <SectionHeader
            title="Curated Collections"
            subtitle="Explore our most popular categories designed for you"
            centered={false}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5]"
              >
                <img
                  src={category.image ? `${UPLOADS_URL}${category.image}` : "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-display font-bold text-white text-2xl mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <span>{category.productCount} Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/categories">
              <Button variant="outline" className="h-12 px-8 rounded-full border-2 gap-2 hover:bg-secondary/30 text-lg">
                View All Categories <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products with Modern Tabs Look */}
      <section className="py-12 md:py-24 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">Trending Now</h2>
              <div className="h-1 w-20 bg-primary rounded-full" />
            </div>
            <Link to="/shop">
              <Button variant="ghost" className="group text-lg">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  image={product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg"}
                  originalPrice={product.originalPrice || product.price}
                  offerPrice={product.price}
                  rating={4.5}
                  reviewCount={0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip - Glassmorphism */}
      <section className="py-12 md:py-20 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team" }
            ].map((feature, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-lg border border-white/50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Reviews */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">Loved by Customers</h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. Here's what our community has to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div
                key={review._id}
                className="bg-[#fcfbf9] p-8 rounded-3xl relative hover:-translate-y-2 transition-transform duration-300 border border-border/50"
              >
                <div className="absolute -top-4 right-8 text-6xl font-serif text-primary/10">"</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, starI) => (
                    <Star
                      key={starI}
                      className={`w-5 h-5 ${starI < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-3">{review.title}</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ReviewDialog>
              <Button variant="outline" className="h-12 px-8 rounded-full border-2 gap-2 hover:bg-secondary/30">
                <Star className="w-4 h-4" /> Write a Review
              </Button>
            </ReviewDialog>
          </div>
        </div>
      </section>

      {/* FAQ Accordion - Clean */}
      <section className="py-12 md:py-24 bg-secondary/30">
        <div className="container max-w-3xl">
          <SectionHeader title="Frequently Asked Questions" subtitle="Got questions? We've got answers." />
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 mt-10">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.slice(0, 4).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-primary font-medium hover:underline">View all FAQs &rarr;</Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-30"></div>
        </div>
        <div className="container relative z-10 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-bold mb-8">Ready to Upgrade Your Lifestyle?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-2xl mx-auto">
            Join thousands of happy customers. Excellent quality, great prices, and a chance to win gold!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-10 rounded-full text-lg shadow-xl">
                Shop Now
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary h-14 px-10 rounded-full text-lg bg-transparent">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
