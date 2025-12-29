import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Star, MessageSquare, CheckCircle } from "lucide-react";

interface Product {
  _id: string;
  name: string;
}

interface ReviewDialogProps {
  children: React.ReactNode;
}

const ReviewDialog = ({ children }: ReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    title: "",
    comment: "",
    product: ""
  });

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
      const response = await fetch(`${API_BASE_URL}/public/products?page=1&limit=100&isActive=true`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
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
        setTimeout(() => {
          setSubmitSuccess(false);
          setOpen(false);
        }, 3000);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your experience with our products. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>

        {submitSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Thank you for your review! It will be published after admin approval.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${star <= reviewForm.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 flex items-center">
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
