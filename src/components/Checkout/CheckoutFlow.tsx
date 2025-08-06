import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Address, backendService } from '@/services/backendService';
import AddressSelector from '@/components/Address/AddressSelector';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFlowProps {
  onClose: () => void;
  userId: string;
}

type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';

const CheckoutFlow = ({ onClose, userId }: CheckoutFlowProps) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  const { cart, getTotalAmount, clearCart } = useCart();
  const { toast } = useToast();
  
  const totalAmount = getTotalAmount();
  const deliveryFee = 30;
  const finalAmount = totalAmount + deliveryFee;

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    
    setIsPlacingOrder(true);
    
    try {
      const order = await backendService.placeOrder({
        items: cart,
        deliveryAddress: selectedAddress,
        totalAmount: finalAmount
      });
      
      setOrderId(order.id);
      clearCart();
      setCurrentStep('confirmation');
      
      toast({
        title: "Order Placed!",
        description: `Your order #${order.id} has been placed successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'cart', label: 'Cart', icon: ShoppingCart },
      { key: 'address', label: 'Address', icon: MapPin },
      { key: 'payment', label: 'Payment', icon: CreditCard },
      { key: 'confirmation', label: 'Confirmation', icon: Check }
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = step.key === currentStep;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted text-muted-foreground'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isCurrent ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCartStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Your Order</h3>
      
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground">by {item.cookName}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{item.price}</p>
              <p className="text-sm text-muted-foreground">
                ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={() => setCurrentStep('address')} className="flex-1">
          Proceed to Address
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment & Delivery</h3>
      
      {selectedAddress && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">{selectedAddress.type.charAt(0).toUpperCase() + selectedAddress.type.slice(1)}</p>
              <p>{selectedAddress.addressLine1}</p>
              {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
              {selectedAddress.landmark && <p>Near {selectedAddress.landmark}</p>}
              <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => setCurrentStep('address')}
            >
              Change Address
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-muted">
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
            </div>
            <p className="text-xs text-muted-foreground">
              More payment options coming soon!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button 
          onClick={handlePlaceOrder} 
          disabled={isPlacingOrder}
          className="flex-1"
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
        <Button variant="outline" onClick={() => setCurrentStep('address')}>
          Back
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-green-600">Order Placed Successfully!</h3>
        <p className="text-muted-foreground mt-2">
          Your order #{orderId} has been confirmed and will be prepared soon.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-medium">₹{finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span>45-60 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          You will receive updates about your order via notifications.
        </p>
        <Button onClick={onClose} className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Checkout</CardTitle>
            {renderStepIndicator()}
          </CardHeader>
          <CardContent>
            {currentStep === 'cart' && renderCartStep()}
            {currentStep === 'address' && (
              <AddressSelector
                onAddressSelect={handleAddressSelect}
                onCancel={() => setCurrentStep('cart')}
                userId={userId}
              />
            )}
            {currentStep === 'payment' && renderPaymentStep()}
            {currentStep === 'confirmation' && renderConfirmationStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutFlow;