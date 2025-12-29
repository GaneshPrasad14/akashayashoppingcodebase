import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MapPin, User, Mail, Phone, CreditCard, Truck } from "lucide-react";

interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };
  paymentMethod: string;
  notes: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    paymentMethod: 'COD',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    // Check if cart is empty
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      navigate('/shop');
    }
  }, [items, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid Indian phone number';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.customerAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.customerAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.customerAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.customerAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.customerAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CheckoutFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        deliveryCharge,
        totalAmount
      };

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate('/order-success', {
          state: {
            orderId: result.data.orderId,
            totalAmount: result.data.totalAmount,
            expectedDelivery: result.data.expectedDelivery
          }
        });
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Already handled in useEffect
  }

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">{items.length} items</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-foreground mb-6">Customer Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name *
                      </Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.customerName ? "border-destructive" : ""}
                      />
                      {errors.customerName && (
                        <p className="text-destructive text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number *
                      </Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="Enter your phone number"
                        className={errors.customerPhone ? "border-destructive" : ""}
                      />
                      {errors.customerPhone && (
                        <p className="text-destructive text-sm mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="Enter your email address"
                      className={errors.customerEmail ? "border-destructive" : ""}
                    />
                    {errors.customerEmail && (
                      <p className="text-destructive text-sm mt-1">{errors.customerEmail}</p>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Delivery Address *
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          value={formData.customerAddress.street}
                          onChange={(e) => handleInputChange('customerAddress.street', e.target.value)}
                          placeholder="House number, street name"
                          className={errors.street ? "border-destructive" : ""}
                        />
                        {errors.street && (
                          <p className="text-destructive text-sm mt-1">{errors.street}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          value={formData.customerAddress.landmark}
                          onChange={(e) => handleInputChange('customerAddress.landmark', e.target.value)}
                          placeholder="Near landmark (optional)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.customerAddress.city}
                          onChange={(e) => handleInputChange('customerAddress.city', e.target.value)}
                          placeholder="Enter city"
                          className={errors.city ? "border-destructive" : ""}
                        />
                        {errors.city && (
                          <p className="text-destructive text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.customerAddress.state}
                          onChange={(e) => handleInputChange('customerAddress.state', e.target.value)}
                          placeholder="Enter state"
                          className={errors.state ? "border-destructive" : ""}
                        />
                        {errors.state && (
                          <p className="text-destructive text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.customerAddress.pincode}
                          onChange={(e) => handleInputChange('customerAddress.pincode', e.target.value)}
                          placeholder="6-digit pincode"
                          className={errors.pincode ? "border-destructive" : ""}
                        />
                        {errors.pincode && (
                          <p className="text-destructive text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label htmlFor="paymentMethod">
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      Payment Method
                    </Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                        <SelectItem value="Online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <Label htmlFor="notes">Special Instructions</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="btn-primary px-8 py-3 text-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Truck className="w-5 h-5 mr-2" />
                          Confirm Order
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/cart')}
                      className="px-8 py-3"
                    >
                      Back to Cart
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✓ Free shipping on orders above ₹999</p>
                    <p>✓ Cash on delivery available</p>
                    <p>✓ 7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;