import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, Truck, Clock, Sparkles } from 'lucide-react';
import { CartItem, StoreLocation } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedStore: StoreLocation;
  onOpenStoreLocator: () => void;
  onProceedToCheckout: (options: {
    orderType: 'pickup' | 'delivery';
    tip: number;
    scheduledTime: string;
    deliveryAddress?: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  selectedStore,
  onOpenStoreLocator,
  onProceedToCheckout,
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [scheduledTime, setScheduledTime] = useState<string>('ASAP (~15-20 mins)');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.08625;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 35 ? 0 : 3.99) : 0;
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tax + deliveryFee + tipAmount;

  const timeOptions = [
    'ASAP (~15-20 mins)',
    'Today at 1:00 PM',
    'Today at 2:00 PM',
    'Today at 3:30 PM',
    'Today at 5:00 PM',
    'Today at 6:30 PM',
    'Today at 8:00 PM',
  ];

  const handleCheckoutClick = () => {
    onProceedToCheckout({
      orderType,
      tip: tipAmount,
      scheduledTime,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF7F2] h-full flex flex-col shadow-2xl border-l border-stone-200 animate-slide-left">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#2C2420]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9A3B2B]" />
            <h2 className="font-serif text-xl font-semibold text-[#2C2420]">Your Sweet Bag</h2>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono tabular-nums">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-[#2C2420] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pickup vs Delivery Segmented Switch */}
        <div className="p-4 bg-white border-b border-stone-200/80">
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setOrderType('pickup')}
              className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                orderType === 'pickup'
                  ? 'bg-white text-[#2C2420] shadow-xs'
                  : 'text-stone-500 hover:text-[#2C2420]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#9A3B2B]" />
              <span>Store Pickup</span>
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                orderType === 'delivery'
                  ? 'bg-white text-[#2C2420] shadow-xs'
                  : 'text-stone-500 hover:text-[#2C2420]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#9A3B2B]" />
              <span>Courier Delivery</span>
            </button>
          </div>

          {/* Fulfillment Details Strip */}
          {orderType === 'pickup' ? (
            <div className="mt-3 flex items-center justify-between text-xs text-[#5C4F47] bg-[#FAF7F2] p-2.5 rounded-lg border border-stone-200/60">
              <div className="truncate mr-2">
                <div className="font-semibold text-[#2C2420] truncate">{selectedStore.name}</div>
                <div className="text-stone-500 truncate text-[11px]">{selectedStore.address}</div>
              </div>
              <button
                onClick={onOpenStoreLocator}
                className="text-[11px] font-semibold text-[#9A3B2B] hover:underline whitespace-nowrap"
              >
                Change Shop
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Enter street delivery address & apt..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-[#2C2420] placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#9A3B2B]"
              />
              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>Direct thermal courier delivery (San Francisco only)</span>
                {subtotal >= 35 ? (
                  <span className="text-[#3D7847] font-semibold">Free over $35</span>
                ) : (
                  <span>$3.99 fee</span>
                )}
              </div>
            </div>
          )}

          {/* Scheduled Timing Picker */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-stone-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Timing:
            </span>
            <select
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="text-xs font-medium text-[#2C2420] bg-stone-100 border border-stone-300 rounded px-2.5 py-1 focus:outline-hidden"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Itemized Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-200/80 mx-auto flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-serif text-lg text-[#2C2420]">Your sweet bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our churned flavors, build a bespoke sundae, or pick up a signature pint.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#2C2420]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#7B6E67]">{item.subtitle}</p>
                    {item.details.toppings && item.details.toppings.length > 0 && (
                      <p className="text-[11px] text-stone-500 mt-1">
                        + {item.details.toppings.join(', ')}
                      </p>
                    )}
                    {item.details.notes && (
                      <p className="text-[11px] text-[#9A3B2B] italic mt-0.5">
                        "{item.details.notes}"
                      </p>
                    )}
                  </div>

                  <span className="font-mono text-xs font-semibold text-[#2C2420] tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#2C2420] transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-semibold px-1.5 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#2C2420] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom Checkout Module */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-white border-t border-stone-200/80 space-y-4">
            {/* Tip Selector */}
            <div>
              <div className="flex justify-between items-center text-xs text-stone-600 mb-1.5">
                <span className="font-medium">Scoop Crew Tip</span>
                <span className="font-mono tabular-nums font-semibold text-[#2C2420]">
                  ${tipAmount.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`py-1 text-xs font-medium rounded transition-colors ${
                      tipPercent === pct
                        ? 'bg-[#2C2420] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6B5E57] pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Courier Thermal Delivery</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#2C2420] pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="font-mono text-[#9A3B2B] text-base tabular-nums">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              disabled={orderType === 'delivery' && !deliveryAddress.trim()}
              className={`w-full py-3.5 px-4 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
                orderType === 'delivery' && !deliveryAddress.trim()
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-[#9A3B2B] hover:bg-[#832F21] text-white active:scale-[0.99]'
              }`}
            >
              <span>Proceed to Checkout</span>
              <span className="font-mono tabular-nums">· ${grandTotal.toFixed(2)}</span>
            </button>
            {orderType === 'delivery' && !deliveryAddress.trim() && (
              <p className="text-[11px] text-amber-700 text-center">
                Please enter your street address above for courier delivery.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
