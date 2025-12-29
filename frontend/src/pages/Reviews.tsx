import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Star } from "lucide-react";

const Reviews = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    title: "",
    comment: "",
    product: ""
  });
  const [products, setProducts] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load products and approved reviews
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/public/products?page=1&limit=100&isActive=true`),
          fetch(`${API_BASE_URL}/public/reviews?page=1&limit=10`)
        ]);

        const [productsData, reviewsData] = await Promise.all([
          productsRes.json(),
          reviewsRes.json()
        ]);

        if (productsData.success) {
          setProducts(productsData.data);
        }
        if (reviewsData.success) {
          setApprovedReviews(reviewsData.data);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  const handleRatingChange = (rating: number) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/public/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setReviewForm({
          customerName: "",
          customerEmail: "",
          rating: 5,
          title: "",
          comment: "",
          product: ""
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeader
          title="Customer Reviews"
          subtitle="See what our happy customers have to say about their shopping experience with us"
        />

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="text-center px-8 py-6 bg-primary-light rounded-2xl">
            <p className="text-4xl font-bold text-primary">4.8</p>
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </div>
          <div className="text-center px-8 py-6 bg-secondary rounded-2xl">
            <p className="text-4xl font-bold text-foreground">500+</p>
            <p className="text-sm text-muted-foreground mt-1">Happy Customers</p>
          </div>
          <div className="text-center px-8 py-6 bg-accent-light rounded-2xl">
            <p className="text-4xl font-bold text-accent">98%</p>
            <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {approvedReviews.map((review, index) => (
            <div
              key={review._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TestimonialCard
                name={review.customerName}
                rating={review.rating}
                review={review.comment}
                date={new Date(review.createdAt).toLocaleDateString()}
              />
            </div>
          ))}
        </div>

        {/* Write a Review Section */}
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Share your experience with our products. Your feedback helps us improve!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <Alert className="mb-6">
                  <AlertDescription>
                    Thank you for your review! It will be published after approval.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Your Name *</Label>
                    <Input
                      id="customer-name"
                      value={reviewForm.customerName}
                      onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email Address *</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={reviewForm.customerEmail}
                      onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select value={reviewForm.product} onValueChange={(value) => setReviewForm({ ...reviewForm, product: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the product you purchased" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${star <= reviewForm.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewForm.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-title">Review Title *</Label>
                  <Input
                    id="review-title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Summarize your experience"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Review *</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tell us about your experience with this product..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Reviews;
