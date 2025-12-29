import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, Truck, Shield, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";

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

interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
}

const ProductDetail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const UPLOADS_URL = API_BASE_URL.replace('/api', ''); // Remove /api for image URLs
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    title: "",
    comment: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch product, categories, and related products in parallel
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/public/products/${id}`),
          fetch(`${API_BASE_URL}/public/categories`)
        ]);

        const [productData, categoriesData] = await Promise.all([
          productRes.json(),
          categoriesRes.json()
        ]);

        if (productData.success) {
          setProduct(productData.data);
          // Fetch related products from same category
          fetchRelatedProducts(productData.data.category._id, productData.data._id);
        } else {
          setError("Product not found");
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (categoryId: string, currentProductId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/products?category=${categoryId}`);
        const data = await response.json();

        if (data.success) {
          const related = data.data.filter((p: Product) => p._id !== currentProductId).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        // Silently fail for related products
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_BASE_URL}/public/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...reviewForm,
          product: product._id
        })
      });

      if (response.ok) {
        setReviewSubmitted(true);
        setReviewDialogOpen(false);
        setReviewForm({
          customerName: "",
          customerEmail: "",
          rating: 5,
          title: "",
          comment: ""
        });
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link to="/shop">
            <Button className="btn-primary">Back to Shop</Button>
          </Link>
        </div>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/919787972500?text=${encodeURIComponent(
    `Hi! I'm interested in ${product.name} (₹${product.price})`
  )}`;

  return (
    <main className="min-h-screen py-8 md:py-16 bg-background">
      <div className="container">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                className="btn-primary text-lg px-10 py-6 gap-2 flex-1 sm:flex-none"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button className="btn-whatsapp text-lg px-10 py-6 w-full">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Buy Now
                </Button>
              </a>
            </div>

            {/* Write Review Button */}
            <div className="pt-6 border-t border-border">
              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience with this product. Your review will be sent to our admin for approval.
                    </DialogDescription>
                  </DialogHeader>
                  {reviewSubmitted ? (
                    <div className="text-center py-4">
                      <p className="text-green-600 font-medium">Thank you for your review!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your review has been submitted and will be published after admin approval.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Your Name *</Label>
                        <Input
                          id="customerName"
                          value={reviewForm.customerName}
                          onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                          placeholder="Enter your name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Your Email *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={reviewForm.customerEmail}
                          onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rating *</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="text-2xl focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${star <= reviewForm.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Review Title *</Label>
                        <Input
                          id="title"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          placeholder="Summarize your review"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                          id="comment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Tell others about your experience"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setReviewDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submittingReview}>
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Above ₹999</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-muted-foreground">Genuine Products</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7-Day Policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Similar Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <SectionHeader
              title="Explore Similar Products"
              subtitle="More products from the same category you might like"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    id={relatedProduct._id}
                    name={relatedProduct.name}
                    image={relatedProduct.mainImage ? `${UPLOADS_URL}${relatedProduct.mainImage}` : "/placeholder.svg"}
                    originalPrice={relatedProduct.price}
                    offerPrice={relatedProduct.price}
                    rating={4.5}
                    reviewCount={0}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explore Other Categories */}
        {categories.length > 1 && (
          <section>
            <SectionHeader
              title="Explore Other Categories"
              subtitle="Discover products from different categories"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories
                .filter((category) => category._id !== product.category._id)
                .map((category, index) => (
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
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
