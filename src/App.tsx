/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveMenu } from './components/InteractiveMenu';
import { ScoopBuilder } from './components/ScoopBuilder';
import { StoreLocator } from './components/StoreLocator';
import { CraftStory } from './components/CraftStory';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { CartItem, StoreLocation, OrderConfirmation } from './types';
import { STORE_LOCATIONS, FLAVORS_DATA } from './data/mockData';

export default function App() {
  // Store Selection State
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  
  // Navigation Section tracker
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Shopping Bag State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return [
      {
        id: 'initial-sample-scoop',
        type: 'scoop',
        title: 'Wild Marionberry Mascarpone',
        subtitle: 'Single Scoop · Warm Waffle Cone',
        unitPrice: 7.00, // $5.75 + $1.25 waffle
        quantity: 1,
        totalPrice: 7.00,
        details: {
          size: 'Single Scoop',
          vessel: 'Warm Waffle Cone',
          scoops: ['Wild Marionberry Mascarpone'],
        },
        image: '/src/assets/images/hero_ice_cream_shop_1791180952681.jpg',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Checkout parameter state passed from CartDrawer
  const [checkoutParams, setCheckoutParams] = useState<{
    orderType: 'pickup' | 'delivery';
    tip: number;
    scheduledTime: string;
    deliveryAddress?: string;
  }>({
    orderType: 'pickup',
    tip: 1.05,
    scheduledTime: 'ASAP (~15-20 mins)',
    deliveryAddress: '',
  });

  // Calculate cart counts & totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Cart actions
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if identical item already exists (same title, subtitle, details)
      const existingIndex = prev.findIndex(
        (i) => i.title === item.title && i.subtitle === item.subtitle && JSON.stringify(i.details) === JSON.stringify(item.details)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
        return updated;
      }

      return [item, ...prev];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleProceedToCheckout = (options: {
    orderType: 'pickup' | 'delivery';
    tip: number;
    scheduledTime: string;
    deliveryAddress?: string;
  }) => {
    setCheckoutParams(options);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: OrderConfirmation) => {
    // Keep items for receipt, reset bag
    setCartItems([]);
  };

  const handleResetOrder = () => {
    setCartItems([]);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex flex-col font-sans selection:bg-[#9A3B2B]/20 selection:text-[#9A3B2B]">
      {/* Top Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        selectedStore={selectedStore}
        onOpenStoreModal={() => scrollToSection('locator')}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreMenu={() => scrollToSection('menu')}
          onOpenBuilder={() => scrollToSection('builder')}
          onOpenLocator={() => scrollToSection('locator')}
          selectedStore={selectedStore}
        />

        {/* Interactive Menu Section */}
        <InteractiveMenu
          onAddToCart={handleAddToCart}
          onOpenBuilder={() => scrollToSection('builder')}
        />

        {/* Interactive Scoop Studio / Customizer */}
        <ScoopBuilder onAddToCart={handleAddToCart} />

        {/* Store Locator with Interactive Vector Map */}
        <StoreLocator
          selectedStore={selectedStore}
          onSelectStore={(store) => setSelectedStore(store)}
          onOrderNowForStore={(store) => {
            setSelectedStore(store);
            setIsCartOpen(true);
          }}
        />

        {/* Craft Story & Farm Provenance */}
        <CraftStory />
      </main>

      {/* Cart Ordering Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        selectedStore={selectedStore}
        onOpenStoreLocator={() => {
          setIsCartOpen(false);
          scrollToSection('locator');
        }}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout & Real-Time Order Tracker Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={checkoutParams.orderType}
        selectedStore={selectedStore}
        tip={checkoutParams.tip}
        scheduledTime={checkoutParams.scheduledTime}
        deliveryAddress={checkoutParams.deliveryAddress}
        onOrderSuccess={handleOrderSuccess}
        onResetOrder={handleResetOrder}
      />

      {/* Editorial Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
