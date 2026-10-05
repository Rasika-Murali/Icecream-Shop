import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Clock, Navigation, Check, Users, Compass, Search, Sparkles } from 'lucide-react';
import { StoreLocation } from '../types';
import { STORE_LOCATIONS } from '../data/mockData';

interface StoreLocatorProps {
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  onOrderNowForStore?: (store: StoreLocation) => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  selectedStore,
  onSelectStore,
  onOrderNowForStore,
}) => {
  const [activeStoreId, setActiveStoreId] = useState<string>(selectedStore.id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFeature, setFilterFeature] = useState<'all' | 'patio' | 'flights' | 'curbside'>('all');
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  // Active store object
  const currentActiveStore = useMemo(() => {
    return STORE_LOCATIONS.find((s) => s.id === activeStoreId) || STORE_LOCATIONS[0];
  }, [activeStoreId]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return STORE_LOCATIONS.filter((store) => {
      // Feature filter
      if (filterFeature === 'patio' && !store.hasPatio) return false;
      if (filterFeature === 'flights' && !store.hasTastingFlight) return false;
      if (filterFeature === 'curbside' && !store.hasCurbsidePickup) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNeighborhood = store.neighborhood.toLowerCase().includes(q);
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesZip = store.zip.includes(q);
        const matchesAddress = store.address.toLowerCase().includes(q);
        if (!matchesNeighborhood && !matchesName && !matchesZip && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterFeature]);

  const handleCopyAddress = (store: StoreLocation) => {
    const fullText = `${store.address}, ${store.city}, ${store.state} ${store.zip}`;
    navigator.clipboard?.writeText(fullText);
    setCopiedAddressId(store.id);
    setTimeout(() => setCopiedAddressId(null), 2000);
  };

  const handleSetPickup = (store: StoreLocation) => {
    setActiveStoreId(store.id);
    onSelectStore(store);
  };

  return (
    <section id="locator" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#2C2420]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#2C2420]/10">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-[#9A3B2B] mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#9A3B2B]" />
              <span>San Francisco Bay Creameries</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] tracking-tight">
              Find Your Nearest Scoop Parlor
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B5E57] max-w-2xl">
              Visit our brick-and-mortar parlors for warm waffle aroma, open churn viewing kitchens,
              flight tasting bars, and express mobile pickup orders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 px-3.5 py-2 rounded-lg border border-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              All 4 Parlors Open Today · Live Kitchen Wait: <strong>2–8 mins</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All 4 Locations' },
              { id: 'patio', label: 'Patio & Garden' },
              { id: 'flights', label: 'Tasting Flight Bar' },
              { id: 'curbside', label: 'Curbside Mobile Pickup' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterFeature(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  filterFeature === tab.id
                    ? 'bg-white text-[#2C2420] shadow-xs'
                    : 'text-[#6B5E57] hover:text-[#2C2420]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by neighborhood, street, or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#2C2420] placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#9A3B2B]"
            />
          </div>
        </div>

        {/* Map & Store List Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Stylized Vector Map */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2420] flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#9A3B2B]" />
                Interactive Bay Area Parlor Map
              </span>
              <span className="text-[11px] text-stone-400">Click any marker to view parlor</span>
            </div>

            {/* Stylized SVG Map Container */}
            <div className="relative aspect-[4/3] w-full bg-[#EBF2F7] rounded-xl overflow-hidden border border-stone-200 shadow-inner flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full select-none">
                {/* Water background */}
                <rect width="400" height="300" fill="#E4EFF6" />

                {/* SF Peninsula Landmass */}
                <path
                  d="M 20,40 Q 90,30 180,45 Q 260,65 310,120 Q 340,160 320,240 Q 280,290 140,290 Q 30,290 20,200 Z"
                  fill="#F9F6F0"
                  stroke="#D3C9BD"
                  strokeWidth="2"
                />

                {/* East Bay Landmass Hint */}
                <path
                  d="M 360,10 Q 390,30 395,120 Q 370,160 380,260 L 400,260 L 400,0 Z"
                  fill="#F4EFE6"
                  stroke="#D3C9BD"
                  strokeWidth="1.5"
                />

                {/* Bay Bridge hint */}
                <line x1="280" y1="110" x2="370" y2="90" stroke="#B8A798" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />

                {/* Stylized Major Roadways */}
                <path d="M 40,180 Q 150,150 270,100" stroke="#E6DACD" strokeWidth="3" fill="none" />
                <path d="M 120,40 Q 140,140 180,280" stroke="#E6DACD" strokeWidth="3" fill="none" />
                <path d="M 220,70 Q 200,180 230,280" stroke="#E6DACD" strokeWidth="2.5" fill="none" />

                {/* Park / Greenery Areas */}
                <ellipse cx="90" cy="110" rx="45" ry="18" fill="#E2EED9" stroke="#CADBBF" strokeWidth="1" />
                <text x="90" y="113" textAnchor="middle" fontSize="7" fill="#6A8A55" fontFamily="sans-serif">
                  Golden Gate Park
                </text>

                <ellipse cx="140" cy="50" rx="35" ry="14" fill="#E2EED9" stroke="#CADBBF" strokeWidth="1" />
                <text x="140" y="53" textAnchor="middle" fontSize="7" fill="#6A8A55" fontFamily="sans-serif">
                  Presidio
                </text>

                {/* Bay Water Label */}
                <text x="320" y="70" textAnchor="middle" fontSize="9" fill="#8CA6B8" fontFamily="serif" fontStyle="italic">
                  San Francisco Bay
                </text>

                {/* Location Markers */}
                {STORE_LOCATIONS.map((store) => {
                  const isSelected = store.id === activeStoreId;
                  const isCurrentPickup = store.id === selectedStore.id;
                  const cx = (store.coordinates.mapX / 100) * 360 + 20;
                  const cy = (store.coordinates.mapY / 100) * 260 + 20;

                  return (
                    <g
                      key={store.id}
                      onClick={() => setActiveStoreId(store.id)}
                      className="cursor-pointer transition-transform group"
                    >
                      {/* Pulse circle if selected */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="18"
                          fill="#9A3B2B"
                          fillOpacity="0.2"
                          className="animate-ping"
                        />
                      )}

                      {/* Marker Base Ring */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 12 : 9}
                        fill={isSelected ? '#9A3B2B' : '#2C2420'}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="drop-shadow-md transition-all group-hover:scale-110"
                      />

                      {/* Center dot or star */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 4 : 3}
                        fill="#FFFFFF"
                      />

                      {/* Store Callout Bubble */}
                      <g transform={`translate(${cx}, ${cy - 16})`}>
                        <rect
                          x="-45"
                          y="-16"
                          width="90"
                          height="16"
                          rx="4"
                          fill={isSelected ? '#2C2420' : '#FFFFFF'}
                          stroke={isSelected ? '#2C2420' : '#D3C9BD'}
                          strokeWidth="1"
                          className="drop-shadow-xs"
                        />
                        <text
                          x="0"
                          y="-5"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="600"
                          fill={isSelected ? '#FFFFFF' : '#2C2420'}
                          fontFamily="sans-serif"
                        >
                          {store.neighborhood}
                        </text>
                      </g>

                      {/* Pickup indicator badge if matching selectedStore */}
                      {isCurrentPickup && (
                        <g transform={`translate(${cx + 8}, ${cy - 12})`}>
                          <circle cx="0" cy="0" r="5" fill="#3D7847" stroke="#FFF" strokeWidth="1" />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Store Quick Strip */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#2C2420]">
                    {currentActiveStore.name}
                  </span>
                  {currentActiveStore.id === selectedStore.id && (
                    <span className="text-[10px] bg-[#3D7847]/10 text-[#3D7847] font-semibold px-2 py-0.5 rounded">
                      Current Pickup Shop
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {currentActiveStore.address} · {currentActiveStore.phone}
                </div>
              </div>

              <button
                onClick={() => handleSetPickup(currentActiveStore)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  currentActiveStore.id === selectedStore.id
                    ? 'bg-[#3D7847] text-white'
                    : 'bg-[#9A3B2B] hover:bg-[#832F21] text-white shadow-xs'
                }`}
              >
                {currentActiveStore.id === selectedStore.id ? 'Selected' : 'Pick Up Here'}
              </button>
            </div>
          </div>

          {/* Store Cards List */}
          <div className="lg:col-span-6 space-y-4">
            {filteredStores.map((store) => {
              const isSelected = store.id === activeStoreId;
              const isCurrentPickup = store.id === selectedStore.id;

              return (
                <div
                  key={store.id}
                  onClick={() => setActiveStoreId(store.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#9A3B2B] ring-1 ring-[#9A3B2B] shadow-md'
                      : 'bg-white border-stone-200/80 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-[#9A3B2B] uppercase">
                          {store.neighborhood}
                        </span>
                        {store.isFlagship && (
                          <span className="text-[11px] font-semibold text-[#C68B45] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Flagship Churnery
                          </span>
                        )}
                        {isCurrentPickup && (
                          <span className="text-[11px] text-[#3D7847] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active Order Location
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#2C2420] mt-1">
                        {store.name}
                      </h3>
                    </div>

                    {/* Crowd Status Badge */}
                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700">
                        <Users className="w-3 h-3 text-[#9A3B2B]" />
                        <span>{store.crowdStatus}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                        ~{store.waitMinutes} min line wait
                      </div>
                    </div>
                  </div>

                  {/* Address, Phone, Hours */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C4F47]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span>{store.address}</span>
                        <div className="text-stone-400">
                          {store.city}, {store.state} {store.zip}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <a
                          href={`tel:${store.phone.replace(/[^0-9]/g, '')}`}
                          className="hover:text-[#9A3B2B] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {store.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{store.hours.weekday}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                    {store.features.map((feature, idx) => (
                      <React.Fragment key={feature}>
                        {idx > 0 && <span className="text-stone-300">·</span>}
                        <span>{feature}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAddress(store);
                        }}
                        className="text-xs text-stone-600 hover:text-[#2C2420] underline font-medium"
                      >
                        {copiedAddressId === store.id ? 'Copied to Clipboard!' : 'Copy Address'}
                      </button>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          `${store.address}, ${store.city}, ${store.state}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#9A3B2B] hover:underline font-medium flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get Directions</span>
                      </a>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPickup(store);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                        isCurrentPickup
                          ? 'bg-[#3D7847] text-white cursor-default'
                          : 'bg-[#9A3B2B] hover:bg-[#832F21] text-white'
                      }`}
                    >
                      {isCurrentPickup ? 'Selected for Pickup' : 'Select for Order Pickup'}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredStores.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200">
                <p className="font-serif text-lg text-[#2C2420]">No scoop shops match your search.</p>
                <p className="text-xs text-stone-500 mt-1">Try clearing your filters to see all 4 locations.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterFeature('all');
                  }}
                  className="mt-3 text-xs font-semibold text-[#9A3B2B] hover:underline"
                >
                  Show All Locations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
