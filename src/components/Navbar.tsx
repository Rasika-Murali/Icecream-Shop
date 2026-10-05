import React from 'react';
import { ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import { StoreLocation } from '../types';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  selectedStore: StoreLocation;
  onOpenStoreModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  selectedStore,
  onOpenStoreModal,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2C2420]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2C2420] hover:text-[#9A3B2B] transition-colors"
        >
          Velvet & Swirl
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C4F47]">
          <button
            onClick={() => onNavigate('menu')}
            className={`hover:text-[#2C2420] transition-colors pb-0.5 ${
              activeSection === 'menu' ? 'text-[#9A3B2B] border-b-2 border-[#9A3B2B]' : ''
            }`}
          >
            Flavors & Menu
          </button>
          <button
            onClick={() => onNavigate('builder')}
            className={`hover:text-[#2C2420] transition-colors pb-0.5 ${
              activeSection === 'builder' ? 'text-[#9A3B2B] border-b-2 border-[#9A3B2B]' : ''
            }`}
          >
            Scoop Studio
          </button>
          <button
            onClick={() => onNavigate('locator')}
            className={`hover:text-[#2C2420] transition-colors pb-0.5 ${
              activeSection === 'locator' ? 'text-[#9A3B2B] border-b-2 border-[#9A3B2B]' : ''
            }`}
          >
            Scoop Shops
          </button>
          <button
            onClick={() => onNavigate('craft')}
            className={`hover:text-[#2C2420] transition-colors pb-0.5 ${
              activeSection === 'craft' ? 'text-[#9A3B2B] border-b-2 border-[#9A3B2B]' : ''
            }`}
          >
            Our Creamery
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Pickup Store Selector */}
          <button
            onClick={onOpenStoreModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A3E39] bg-stone-200/50 hover:bg-stone-200 rounded-lg transition-colors border border-stone-300/50 max-w-[140px] sm:max-w-[210px] truncate"
            title={`Current pickup shop: ${selectedStore.name}`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#9A3B2B] shrink-0" />
            <span className="truncate">{selectedStore.neighborhood}</span>
            <ChevronDown className="w-3 h-3 text-[#7B6E67] shrink-0" />
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white bg-[#9A3B2B] hover:bg-[#832F21] rounded-lg transition-all shadow-sm active:scale-[0.98]"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="hidden md:inline font-mono tabular-nums border-l border-white/20 pl-2">
                ${cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
