import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, Truck, Shield, RefreshCw, MessageSquare, CreditCard, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
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
  const UPLOADS_URL = API_BASE_URL.replace('/api', ''); // Remove /api for image URLs
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
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

  // ... existing imports

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
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
          // Set initial selected image
          setSelectedImage(productData.data.mainImage || "");
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

  // Image handling helper
  const getImageUrl = (imagePath: string) => {
    return imagePath ? `${UPLOADS_URL}${imagePath}` : "/placeholder.svg";
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg",
    }, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4 text-gray-900">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/shop">
            <Button className="btn-primary">Return to Shop</Button>
          </Link>
        </div>
      </main>
    );
  }

  // Generate image list (Main + Extra Images)
  // Ensure product.images exists, otherwise fall back to just mainImage
  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);
  // Remove duplicates if mainImage is also in images array
  const uniqueImages = [...new Set(allImages)];

  return (
    <main className="min-h-screen py-8 md:py-12 bg-gray-50/50">
      <div className="container px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </nav>

        {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 mb-24">

          {/* LEFT COLUMN: Image Gallery */}
          <div className="space-y-6">
            {/* Main Image Stage */}
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 group">
              <img
                src={getImageUrl(selectedImage || product.mainImage)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Zoom hint or badge could go here */}
            </div>

            {/* Thumbnail Strip (only if multiple images) */}
            {uniqueImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Info (Sticky) */}
          <div className="lg:sticky lg:top-24 h-fit space-y-8">

            {/* Header Section */}
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                    {product.category?.name || "Jewellery"}
                  </p>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                </div>
                {/* Review Summary (Placeholder) */}
                <div className="flex flex-col items-end min-w-fit">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">4.8 (120 reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-4xl font-bold text-primary font-display">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${product.stock > 0
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">{product.stock} available</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 h-14 text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5 hover:text-primary-dark transition-all"
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (!product) return;
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg",
                    }, quantity);
                    toast.success(`Added ${quantity} item(s) to cart`);
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  size="lg"
                  className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-200/50 transition-all transform hover:-translate-y-0.5"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center group hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-bold text-gray-900 uppercase">Free Shipping</p>
                <p className="text-[10px] text-gray-500 mt-1">On orders over ₹999</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center group hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-bold text-gray-900 uppercase">Lifetime Warranty</p>
                <p className="text-[10px] text-gray-500 mt-1">Certified Authenticity</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center group hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-bold text-gray-900 uppercase">Easy Returns</p>
                <p className="text-[10px] text-gray-500 mt-1">7-Day Return Policy</p>
              </div>
            </div>

            {/* Review CTA */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Have you bought this?</p>
                  <p className="text-xs text-gray-500">Share your experience with others</p>
                </div>
              </div>
              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark hover:bg-primary/5">
                    Write Review
                  </Button>
                </DialogTrigger>
                {/* ... Dialog Content (kept same) ... */}
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

          </div>
        </div>

        {/* Explore Similar Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <SectionHeader
              title="You May Also Like"
              subtitle="Curated just for you"
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
                    rating={4.8}
                    reviewCount={12}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explore Other Categories */}
        {categories.length > 1 && (
          <section>
            {/* ... existing category section ... */}
            <SectionHeader
              title="More Categories"
              subtitle="Explore our wide range of collections"
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
