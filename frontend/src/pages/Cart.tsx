import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setIsUpdating(id);
    setTimeout(() => {
      updateQuantity(id, newQuantity);
      setIsUpdating(null);
    }, 100);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    // Navigate to checkout or show checkout modal
    toast.success("Proceeding to checkout...");
    // For now, just navigate to a checkout page or show a message
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button 
              onClick={() => navigate('/shop')}
              className="btn-primary text-lg px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">{getTotalItems()} items</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl p-6 shadow-sm border">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                        <p className="text-primary font-bold mb-4">₹{item.price.toLocaleString()}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isUpdating === item.id}
                              className="p-2 hover:bg-secondary rounded-l-lg transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-center min-w-[40px]">
                              {isUpdating === item.id ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isUpdating === item.id}
                              className="p-2 hover:bg-secondary rounded-r-lg transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <span className="text-primary font-semibold">
                            Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span>₹0</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    onClick={() => navigate('/shop')}
                    variant="outline"
                    className="w-full py-3"
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="mt-6 text-xs text-muted-foreground text-center">
                  <p>✓ Free shipping on orders above ₹999</p>
                  <p>✓ Cash on delivery available</p>
                  <p>✓ 7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;