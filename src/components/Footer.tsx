import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { STORE_LOCATIONS } from '../data/mockData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#241E1A] text-[#FAF7F2] pt-16 pb-12 border-t border-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-2xl font-semibold tracking-tight text-white">
              Velvet & Swirl
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Handcrafted small-batch ice cream churned with pasture-fed milk, organic cane sugar,
              and wild-foraged fruits. Fresh waffle cones rolled every twenty minutes.
            </p>
            <div className="text-[11px] text-stone-500 pt-2">
              San Francisco, California · Founded 2018
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Creamery
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors"
                >
                  Flavors & Scoops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('builder')}
                  className="hover:text-white transition-colors"
                >
                  Scoop Studio Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locator')}
                  className="hover:text-white transition-colors"
                >
                  Scoop Shop Locator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('craft')}
                  className="hover:text-white transition-colors"
                >
                  Our Farm Milk
                </button>
              </li>
            </ul>
          </div>

          {/* Locations Quick Directory */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Scoop Shops
            </div>
            <ul className="space-y-2 text-stone-400">
              {STORE_LOCATIONS.map((loc) => (
                <li key={loc.id} className="hover:text-stone-300">
                  <span className="font-medium text-white">{loc.neighborhood}:</span>{' '}
                  <span>{loc.address}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Secret Flavor Drops Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Seasonal Flavor Drops
            </div>
            <p className="text-xs text-stone-400">
              Subscribe for first access to monthly micro-batch churns and private tasting events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-stone-400 focus:outline-hidden focus:border-[#F2C0B6]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-white hover:text-[#F2C0B6]"
                  title="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Welcome to the Secret Churn Club!</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar & Allergen Statement */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Velvet & Swirl Creamery LLC. All rights reserved.
          </div>
          <div className="text-center md:text-right">
            Allergen Notice: Our kitchen handles milk, tree nuts, eggs, wheat, and sesame.
          </div>
        </div>
      </div>
    </footer>
  );
};
