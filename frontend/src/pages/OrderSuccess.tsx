import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state as {
    orderId: string;
    totalAmount: number;
    expectedDelivery: string;
  } | null;

  useEffect(() => {
    if (!orderData) {
      navigate('/shop');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your order. We'll process it shortly and send you updates via WhatsApp.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Details</h2>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-semibold text-primary">{orderData.orderId}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">₹{orderData.totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Expected Delivery</span>
                <span className="font-semibold">{new Date(orderData.expectedDelivery).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                📱 WhatsApp notification sent to +91 9787972500
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <Package className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                We're preparing your order for shipment
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Your order will be shipped soon
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Expected by {new Date(orderData.expectedDelivery).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-3 text-lg"
            >
              Continue Shopping
            </Button>
            
            <p className="text-sm text-muted-foreground">
              You will receive order updates via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;