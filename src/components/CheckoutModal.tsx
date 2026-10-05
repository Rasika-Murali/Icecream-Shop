import React, { useState } from 'react';
import { X, Check, Clock, MapPin, Truck, CreditCard, Sparkles, Printer, ArrowRight } from 'lucide-react';
import { CartItem, StoreLocation, OrderConfirmation } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'pickup' | 'delivery';
  selectedStore: StoreLocation;
  tip: number;
  scheduledTime: string;
  deliveryAddress?: string;
  onOrderSuccess: (order: OrderConfirmation) => void;
  onResetOrder: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  selectedStore,
  tip,
  scheduledTime,
  deliveryAddress,
  onOrderSuccess,
  onResetOrder,
}) => {
  const [customerName, setCustomerName] = useState<string>('Alex Rivera');
  const [customerPhone, setCustomerPhone] = useState<string>('(415) 555-0198');
  const [customerEmail, setCustomerEmail] = useState<string>('alex.rivera@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'counter'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmation | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.08625;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 35 ? 0 : 3.99) : 0;
  const grandTotal = subtotal + tax + deliveryFee + tip;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: OrderConfirmation = {
        orderNumber: `VS-${Math.floor(1000 + Math.random() * 9000)}`,
        orderType,
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        storeAddress: selectedStore.address,
        scheduledTime,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        items: [...items],
        subtotal,
        tax,
        tip,
        total: grandTotal,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'scooping',
      };

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      setIsSubmitting(false);
    }, 1200);
  };

  const handlePrint = () => {
    window.print?.();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2C2420]/10 flex items-center justify-between bg-white">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
              {completedOrder ? 'Order Confirmed!' : 'Express Checkout'}
            </h3>
            <p className="text-xs text-stone-500">
              {completedOrder
                ? `Order ${completedOrder.orderNumber} is being prepared`
                : `${orderType === 'pickup' ? 'Store Pickup' : 'Local Courier'} · ${selectedStore.neighborhood}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-[#2C2420] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {completedOrder ? (
          /* Post-Order Tracking Screen */
          <div className="p-6 space-y-6">
            {/* Live Progress Tracker */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Order Status</span>
                  <div className="font-serif text-xl font-bold text-[#2C2420] mt-0.5">
                    {completedOrder.orderNumber}
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kitchen Scooping</span>
                </div>
              </div>

              {/* 4-Stage Timeline */}
              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#3D7847] text-white flex items-center justify-center mx-auto text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-semibold text-[#2C2420]">Received</div>
                </div>

                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#9A3B2B] text-white flex items-center justify-center mx-auto text-xs animate-pulse ring-4 ring-[#9A3B2B]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-semibold text-[#9A3B2B]">Scooping</div>
                </div>

                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto text-xs">
                    3
                  </div>
                  <div className="text-[10px] text-stone-500">Thermal Pack</div>
                </div>

                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto text-xs">
                    4
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {completedOrder.orderType === 'pickup' ? 'Ready at Counter' : 'En Route'}
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup / Fulfillment Card */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-[#5C4F47]">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                {completedOrder.orderType === 'pickup' ? (
                  <MapPin className="w-4 h-4 text-[#9A3B2B]" />
                ) : (
                  <Truck className="w-4 h-4 text-[#9A3B2B]" />
                )}
                <span>
                  {completedOrder.orderType === 'pickup'
                    ? `Pick up at ${completedOrder.storeName}`
                    : `Delivering to: ${completedOrder.deliveryAddress}`}
                </span>
              </div>
              <p className="text-stone-600 pl-6">
                {completedOrder.orderType === 'pickup'
                  ? `${completedOrder.storeAddress}. Show this order number or order code at the express pickup counter.`
                  : 'Courier dispatched with insulated thermal pouch to prevent any melting.'}
              </p>
              <div className="pl-6 pt-1 text-[11px] text-stone-500">
                Scheduled arrival: <strong>{completedOrder.scheduledTime}</strong>
              </div>
            </div>

            {/* Order Items Receipt */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="text-xs font-semibold text-[#2C2420] pb-2 border-b border-stone-100 flex justify-between">
                <span>Receipt Summary</span>
                <span>Paid ${completedOrder.total.toFixed(2)}</span>
              </div>
              <div className="space-y-1.5 text-xs text-stone-600 max-h-40 overflow-y-auto pr-1">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.title} ({item.subtitle})
                    </span>
                    <span className="font-mono tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onResetOrder();
                  onClose();
                }}
                className="px-5 py-2.5 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Start New Order
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Input Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#2C2420] uppercase tracking-wider">
                1. Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#2C2420] focus:ring-1 focus:ring-[#9A3B2B] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Mobile Phone (For Order SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#2C2420] focus:ring-1 focus:ring-[#9A3B2B] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Email (Receipt & Tracker link)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#2C2420] focus:ring-1 focus:ring-[#9A3B2B] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Delivery address display if courier */}
            {orderType === 'delivery' && (
              <div className="p-3 bg-stone-100 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-[#2C2420]">Courier Delivery Address:</span>
                <p className="text-stone-600">{deliveryAddress || 'Address required in Bag view'}</p>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-[#2C2420] uppercase tracking-wider">
                2. Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-semibold text-[#2C2420]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs">Apple / G-Pay</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">1-Tap</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-semibold text-[#2C2420]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs">Credit Card</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Visa, MC, Amex</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('counter')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'counter'
                      ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-semibold text-[#2C2420]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs">Pay at Counter</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Cash / Card</div>
                </button>
              </div>

              {/* Card inputs mock if card selected */}
              {paymentMethod === 'card' && (
                <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4829"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono"
                    placeholder="Card Number"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono"
                      placeholder="MM/YY"
                    />
                    <input
                      type="text"
                      defaultValue="•••"
                      className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total Due Strip */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm">
              <span className="font-medium text-[#2C2420]">Total Amount</span>
              <span className="font-mono text-lg font-bold text-[#9A3B2B] tabular-nums">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Transmitting to Kitchen...</span>
              ) : (
                <>
                  <span>Confirm & Authorize Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
