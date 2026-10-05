import React from 'react';
import { ArrowRight, Sparkles, Clock, Compass } from 'lucide-react';
import { StoreLocation } from '../types';
import { heroImg } from '../data/mockData';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenBuilder: () => void;
  onOpenLocator: () => void;
  selectedStore: StoreLocation;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onOpenBuilder,
  onOpenLocator,
  selectedStore,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#2C2420]/10">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#2C2420] text-[#FAF7F2] text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-[#F2C0B6]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2C0B6]" />
            Seasonal Drop
          </span>
          <span className="hidden sm:inline text-white/40">·</span>
          <span>Wild Marionberry Mascarpone & Salted Bourbon Honeycomb now spinning</span>
          <span className="hidden md:inline text-white/40">·</span>
          <span className="hidden md:inline text-white/80">Packed in reusable thermal pouches</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#9A3B2B] flex items-center gap-2">
              <span>Farm-to-Cone Artisanal Creamery</span>
              <span>·</span>
              <span>San Francisco, CA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#2C2420] leading-[1.1] [text-wrap:balance]">
              Handcrafted in small batches, spun for pure decadence.
            </h1>

            <p className="text-base sm:text-lg text-[#5C4F47] leading-relaxed max-w-xl">
              We churn pasture-raised organic Jersey milk and foraged botanicals into unhurried, silky scoops.
              Order warm scratch waffle cones, build bespoke sundaes, or grab hand-packed pints for pickup & courier delivery.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#9A3B2B] hover:bg-[#832F21] rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Browse Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBuilder}
                className="px-6 py-3.5 text-sm font-semibold text-[#2C2420] bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-all text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#C68B45]" />
                <span>Scoop Studio Customizer</span>
              </button>
            </div>

            {/* Live Pickup Trust Bar */}
            <div className="pt-6 border-t border-[#2C2420]/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B5E57]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9A3B2B]" />
                <span>
                  Ready in <strong className="font-semibold text-[#2C2420]">~15 mins</strong> at {selectedStore.neighborhood}
                </span>
              </div>
              <button
                onClick={onOpenLocator}
                className="flex items-center gap-1.5 text-[#9A3B2B] hover:underline font-medium"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Change Pickup Parlor</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-100 border border-stone-200 aspect-[16/10] sm:aspect-[16/11]">
              <img
                src={heroImg}
                alt="Artisanal ice cream scoops on warm waffle cone with berries and caramel"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Floating Signature Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/80 font-medium">Batch No. 842 Fresh Churn</p>
                  <p className="font-serif text-lg sm:text-xl font-medium text-white">Wild Marionberry & Salted Honeycomb</p>
                </div>
                <button
                  onClick={onExploreMenu}
                  className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-[#2C2420] text-xs font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap"
                >
                  Order This Scoop
                </button>
              </div>
            </div>

            {/* Quick Proof Badges */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-stone-200/80 shadow-xs">
                <p className="font-serif text-base sm:text-lg font-semibold text-[#2C2420]">100%</p>
                <p className="text-[11px] text-[#7B6E67] leading-tight">Pasture Milk & Cream</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200/80 shadow-xs">
                <p className="font-serif text-base sm:text-lg font-semibold text-[#2C2420]">Zero</p>
                <p className="text-[11px] text-[#7B6E67] leading-tight">Artificial Preservatives</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200/80 shadow-xs">
                <p className="font-serif text-base sm:text-lg font-semibold text-[#2C2420]">4</p>
                <p className="text-[11px] text-[#7B6E67] leading-tight">SF Bay Scoop Shops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
