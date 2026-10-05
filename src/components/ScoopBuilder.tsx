import React, { useState } from 'react';
import { Sparkles, Check, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { VesselOption, Flavor, ToppingOption, CartItem } from '../types';
import { FLAVORS_DATA, VESSEL_OPTIONS, TOPPING_OPTIONS } from '../data/mockData';

interface ScoopBuilderProps {
  onAddToCart: (item: CartItem) => void;
}

export const ScoopBuilder: React.FC<ScoopBuilderProps> = ({ onAddToCart }) => {
  // Builder state
  const [selectedVesselId, setSelectedVesselId] = useState<string>('waffle-cone');
  const [scoopCount, setScoopCount] = useState<1 | 2 | 3>(2);
  const [selectedFlavorIds, setSelectedFlavorIds] = useState<string[]>([
    'salted-bourbon-honeycomb',
    'marionberry-mascarpone',
    'roasted-sicilian-pistachio',
  ]);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([
    'salted-bourbon-caramel',
    'honeycomb-crunch',
  ]);
  const [hasWhippedCream, setHasWhippedCream] = useState<boolean>(true);
  const [hasCherry, setHasCherry] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Active vessel
  const selectedVessel = VESSEL_OPTIONS.find((v) => v.id === selectedVesselId) || VESSEL_OPTIONS[0];

  // Base pricing
  const baseScoopPrices = {
    1: 5.75,
    2: 8.50,
    3: 10.75,
  };

  // Calculate total
  const basePrice = baseScoopPrices[scoopCount];
  const vesselPrice = selectedVessel.price;
  const toppingsPrice = selectedToppingIds.reduce((sum, id) => {
    const top = TOPPING_OPTIONS.find((t) => t.id === id);
    return sum + (top ? top.price : 0);
  }, 0);
  const whippedCreamPrice = hasWhippedCream ? 0.95 : 0;
  const cherryPrice = hasCherry ? 0.75 : 0;
  const totalPrice = basePrice + vesselPrice + toppingsPrice + whippedCreamPrice + cherryPrice;

  // Selected Flavors list
  const activeScoops = selectedFlavorIds.slice(0, scoopCount).map((id) => {
    return FLAVORS_DATA.find((f) => f.id === id) || FLAVORS_DATA[0];
  });

  const handleFlavorSelect = (slotIndex: number, flavorId: string) => {
    const updated = [...selectedFlavorIds];
    updated[slotIndex] = flavorId;
    setSelectedFlavorIds(updated);
  };

  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddCreationToCart = () => {
    const flavorNames = activeScoops.map((s) => s.name);
    const selectedToppingNames = selectedToppingIds.map((id) => {
      const top = TOPPING_OPTIONS.find((t) => t.id === id);
      return top ? top.name : id;
    });

    if (hasWhippedCream) selectedToppingNames.push('Pasture Whipped Cream');
    if (hasCherry) selectedToppingNames.push('Bordeaux Cherry');

    const cartItem: CartItem = {
      id: `custom-sundae-${Date.now()}`,
      type: 'custom_sundae',
      title: `Custom ${scoopCount}-Scoop Creation`,
      subtitle: `${selectedVessel.name} · ${flavorNames.join(', ')}`,
      unitPrice: totalPrice,
      quantity: 1,
      totalPrice: totalPrice,
      details: {
        vessel: selectedVessel.name,
        scoops: flavorNames,
        toppings: selectedToppingNames,
        notes: customNotes.trim() || undefined,
      },
      image: activeScoops[0]?.image || '/src/assets/images/hero_ice_cream_shop_1791180952681.jpg',
    };

    onAddToCart(cartItem);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const resetCustomizer = () => {
    setSelectedVesselId('waffle-cone');
    setScoopCount(2);
    setSelectedFlavorIds(['salted-bourbon-honeycomb', 'marionberry-mascarpone', 'roasted-sicilian-pistachio']);
    setSelectedToppingIds(['salted-bourbon-caramel', 'honeycomb-crunch']);
    setHasWhippedCream(true);
    setHasCherry(true);
    setCustomNotes('');
  };

  return (
    <section id="builder" className="py-16 sm:py-24 bg-[#F5EFE6] border-b border-[#2C2420]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#9A3B2B] mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C68B45]" />
            <span>Interactive Scoop Studio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] tracking-tight">
            Build Your Bespoke Ice Cream Masterpiece
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B5E57]">
            Select your freshly baked vessel, stack up to three small-batch scoops, drizzle warm house sauces,
            and crown with hand-crafted toppings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase (Left Column on Desktop) */}
          <div className="lg:col-span-5 sticky top-28 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2420]">
                Live Cone & Sundae Preview
              </span>
              <button
                onClick={resetCustomizer}
                className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-[#9A3B2B] transition-colors"
                title="Reset builder"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Graphic SVG Canvas representation of the layered creation */}
            <div className="relative w-full aspect-square max-w-xs flex items-center justify-center py-6">
              <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-md">
                {/* Defs for gradients & textures */}
                <defs>
                  <linearGradient id="waffleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DF9B52" />
                    <stop offset="100%" stopColor="#A86221" />
                  </linearGradient>
                  <linearGradient id="chocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A2E20" />
                    <stop offset="100%" stopColor="#25130A" />
                  </linearGradient>
                  <linearGradient id="caramelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D98A36" />
                    <stop offset="100%" stopColor="#9C5212" />
                  </linearGradient>
                  <pattern id="waffleGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 10 0 M 0 0 L 10 10" stroke="#7A3F0E" strokeWidth="1" strokeOpacity="0.4" />
                  </pattern>
                </defs>

                {/* Vessel Graphics */}
                {selectedVesselId === 'waffle-cone' && (
                  <g>
                    {/* Waffle Cone Triangle */}
                    <polygon points="120,270 70,160 170,160" fill="url(#waffleGrad)" />
                    <polygon points="120,270 70,160 170,160" fill="url(#waffleGrid)" />
                    <path d="M 68,160 Q 120,166 172,160" stroke="#874B16" strokeWidth="3" fill="none" />
                  </g>
                )}

                {selectedVesselId === 'chocolate-dipped-waffle' && (
                  <g>
                    {/* Chocolate Dipped Cone */}
                    <polygon points="120,270 70,160 170,160" fill="url(#waffleGrad)" />
                    <polygon points="120,270 70,160 170,160" fill="url(#waffleGrid)" />
                    {/* Dipped Chocolate Rim */}
                    <path d="M 68,160 Q 120,166 172,160 L 170,185 Q 155,195 145,182 Q 130,198 120,185 Q 105,195 95,183 Q 80,192 70,182 Z" fill="url(#chocGrad)" />
                  </g>
                )}

                {selectedVesselId === 'brioche-bun' && (
                  <g>
                    {/* Toasted Brioche Bun Bottom */}
                    <ellipse cx="120" cy="205" rx="60" ry="24" fill="#E2A765" />
                    <ellipse cx="120" cy="200" rx="56" ry="20" fill="#F4CA88" />
                  </g>
                )}

                {selectedVesselId === 'waffle-bowl' && (
                  <g>
                    {/* Waffle Bowl */}
                    <path d="M 55,160 Q 65,225 120,225 Q 175,225 185,160 Q 120,170 55,160" fill="url(#waffleGrad)" />
                    <path d="M 55,160 Q 65,225 120,225 Q 175,225 185,160 Q 120,170 55,160" fill="url(#waffleGrid)" />
                  </g>
                )}

                {selectedVesselId === 'compostable-cup' && (
                  <g>
                    {/* Paper Cup */}
                    <polygon points="65,155 175,155 165,225 75,225" fill="#EAE5DB" stroke="#C4B8A5" strokeWidth="2" />
                    <ellipse cx="120" cy="155" rx="55" ry="8" fill="#F4EFE6" stroke="#C4B8A5" strokeWidth="1" />
                    <text x="120" y="195" textAnchor="middle" fontSize="9" fill="#9C8E7E" fontFamily="sans-serif">
                      VELVET & SWIRL
                    </text>
                  </g>
                )}

                {/* Bottom Scoop (Scoop 1) */}
                {activeScoops[0] && (
                  <g>
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 175 : 150}
                      rx="42"
                      ry="36"
                      fill={activeScoops[0].colorHex}
                    />
                    {/* Texture shadow */}
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 175 : 150}
                      rx="42"
                      ry="36"
                      fill="black"
                      fillOpacity="0.08"
                    />
                  </g>
                )}

                {/* Middle Scoop (Scoop 2) */}
                {scoopCount >= 2 && activeScoops[1] && (
                  <g>
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 140 : 110}
                      rx="38"
                      ry="34"
                      fill={activeScoops[1].colorHex}
                    />
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 140 : 110}
                      rx="38"
                      ry="34"
                      fill="black"
                      fillOpacity="0.08"
                    />
                  </g>
                )}

                {/* Top Scoop (Scoop 3) */}
                {scoopCount === 3 && activeScoops[2] && (
                  <g>
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 105 : 75}
                      rx="35"
                      ry="30"
                      fill={activeScoops[2].colorHex}
                    />
                    <ellipse
                      cx="120"
                      cy={selectedVesselId === 'brioche-bun' ? 105 : 75}
                      rx="35"
                      ry="30"
                      fill="black"
                      fillOpacity="0.08"
                    />
                  </g>
                )}

                {/* Sauce Drizzles Overlay */}
                {selectedToppingIds.includes('salted-bourbon-caramel') && (
                  <path
                    d={
                      scoopCount === 3
                        ? 'M 100,60 Q 120,75 140,65 Q 135,100 115,120 Q 95,140 120,160'
                        : 'M 98,90 Q 120,110 142,95 Q 135,135 110,150'
                    }
                    stroke="url(#caramelGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {selectedToppingIds.includes('hot-fudge-valrhona') && (
                  <path
                    d={
                      scoopCount === 3
                        ? 'M 108,62 Q 130,85 110,105 Q 140,125 125,155'
                        : 'M 105,95 Q 135,120 115,145'
                    }
                    stroke="url(#chocGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* Whipped Cream Crown */}
                {hasWhippedCream && (
                  <g transform={`translate(0, ${scoopCount === 3 ? -10 : scoopCount === 2 ? 15 : 45})`}>
                    <path
                      d="M 95,65 Q 105,45 120,40 Q 135,45 145,65 Q 135,70 120,68 Q 105,70 95,65"
                      fill="#FFFBF2"
                      stroke="#E5DEC9"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 110,48 Q 120,32 128,45 Q 122,48 110,48"
                      fill="#FFFDF8"
                    />
                  </g>
                )}

                {/* Bordeaux Maraschino Cherry */}
                {hasCherry && (
                  <g transform={`translate(0, ${scoopCount === 3 ? -12 : scoopCount === 2 ? 13 : 43})`}>
                    {/* Stem */}
                    <path d="M 120,38 Q 135,20 145,18" stroke="#3D5A2B" strokeWidth="1.5" fill="none" />
                    {/* Ruby Cherry */}
                    <circle cx="120" cy="38" r="8" fill="#871A28" />
                    <circle cx="118" cy="35" r="2.5" fill="#E86E7D" />
                  </g>
                )}

                {/* Brioche Top Bun if brioche bun selected */}
                {selectedVesselId === 'brioche-bun' && (
                  <g transform="translate(0, 0)">
                    <ellipse cx="120" cy={scoopCount === 3 ? 55 : scoopCount === 2 ? 80 : 120} rx="58" ry="24" fill="#D89753" />
                    <ellipse cx="120" cy={scoopCount === 3 ? 52 : scoopCount === 2 ? 77 : 117} rx="52" ry="20" fill="#ECAE6A" />
                  </g>
                )}
              </svg>
            </div>

            {/* Creation Breakdown Summary */}
            <div className="w-full mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-[#2C2420] font-semibold pb-1 border-b border-stone-200">
                <span>Total Build Price</span>
                <span className="font-mono text-base text-[#9A3B2B] tabular-nums">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{scoopCount} Scoop Base</span>
                <span className="font-mono tabular-nums">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Vessel: {selectedVessel.name}</span>
                <span className="font-mono tabular-nums">+${vesselPrice.toFixed(2)}</span>
              </div>
              {toppingsPrice > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Toppings & Sauces ({selectedToppingIds.length})</span>
                  <span className="font-mono tabular-nums">+${toppingsPrice.toFixed(2)}</span>
                </div>
              )}
              {hasWhippedCream && (
                <div className="flex justify-between text-stone-600">
                  <span>Pasture Whipped Cream</span>
                  <span className="font-mono tabular-nums">+${whippedCreamPrice.toFixed(2)}</span>
                </div>
              )}
              {hasCherry && (
                <div className="flex justify-between text-stone-600">
                  <span>Bordeaux Cherry</span>
                  <span className="font-mono tabular-nums">+${cherryPrice.toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleAddCreationToCart}
              className="w-full mt-4 py-3 px-4 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom Sundae to Bag (${totalPrice.toFixed(2)})</span>
            </button>

            {addedNotice && (
              <div className="mt-2 text-xs text-[#3D7847] font-medium flex items-center gap-1.5 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span>Custom creation added to your bag!</span>
              </div>
            )}
          </div>

          {/* Customizer Controls (Right Column on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Vessel */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Step 01</span>
                  <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                    Select Your Vessel
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VESSEL_OPTIONS.map((vessel) => (
                  <button
                    key={vessel.id}
                    onClick={() => setSelectedVesselId(vessel.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedVesselId === vessel.id
                        ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 ring-1 ring-[#9A3B2B]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-[#2C2420]">{vessel.name}</span>
                      <span className="font-mono text-xs font-semibold text-[#9A3B2B]">
                        {vessel.price === 0 ? 'Free' : `+$${vessel.price.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7B6E67] mt-1 leading-snug">
                      {vessel.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scoop Count & Flavor Stacking */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Step 02</span>
                  <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                    Choose Scoops & Flavors
                  </h3>
                </div>
                {/* Scoop Count Segmented Control */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setScoopCount(count as 1 | 2 | 3)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        scoopCount === count
                          ? 'bg-white text-[#2C2420] shadow-xs'
                          : 'text-stone-500 hover:text-[#2C2420]'
                      }`}
                    >
                      {count} {count === 1 ? 'Scoop' : 'Scoops'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor selectors per scoop layer */}
              <div className="space-y-4">
                {Array.from({ length: scoopCount }).map((_, slotIndex) => {
                  const currentFlavorId = selectedFlavorIds[slotIndex] || FLAVORS_DATA[0].id;
                  const currentFlavor = FLAVORS_DATA.find((f) => f.id === currentFlavorId);

                  return (
                    <div
                      key={slotIndex}
                      className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#2C2420] flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: currentFlavor?.colorHex || '#ccc' }}
                          />
                          Scoop {slotIndex + 1} Flavor: {currentFlavor?.name}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {slotIndex === 0 ? 'Foundation scoop' : slotIndex === 1 ? 'Middle layer' : 'Top scoop'}
                        </span>
                      </div>

                      {/* Quick flavor selector chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {FLAVORS_DATA.map((flavor) => (
                          <button
                            key={flavor.id}
                            onClick={() => handleFlavorSelect(slotIndex, flavor.id)}
                            className={`px-2.5 py-1 text-[11px] rounded-lg border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                              currentFlavorId === flavor.id
                                ? 'bg-white border-[#9A3B2B] text-[#9A3B2B] font-semibold shadow-xs'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: flavor.colorHex }}
                            />
                            <span>{flavor.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sauces & Drizzles */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Step 03</span>
                <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                  Warm Sauces & Pour-Overs
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOPPING_OPTIONS.filter((t) => t.category === 'sauce').map((topping) => {
                  const isSelected = selectedToppingIds.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-medium'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                            isSelected ? 'bg-[#9A3B2B]' : 'border border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs text-[#2C2420]">{topping.name}</span>
                      </div>
                      <span className="font-mono text-xs text-[#9A3B2B] tabular-nums">
                        +${topping.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Artisanal Crunches & Toppings */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Step 04</span>
                <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                  Handmade Crunches & Shards
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOPPING_OPTIONS.filter((t) => t.category === 'crunch').map((topping) => {
                  const isSelected = selectedToppingIds.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-medium'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                            isSelected ? 'bg-[#9A3B2B]' : 'border border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs text-[#2C2420]">{topping.name}</span>
                      </div>
                      <span className="font-mono text-xs text-[#9A3B2B] tabular-nums">
                        +${topping.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Finishing Crowns */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#9A3B2B] uppercase">Step 05</span>
                <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                  Finishing Touches
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setHasWhippedCream(!hasWhippedCream)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    hasWhippedCream
                      ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-medium'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                        hasWhippedCream ? 'bg-[#9A3B2B]' : 'border border-stone-300'
                      }`}
                    >
                      {hasWhippedCream && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="text-xs text-[#2C2420]">Pasture Whipped Cream</div>
                      <div className="text-[11px] text-stone-500">Fresh churned sweet cream</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#9A3B2B]">+$0.95</span>
                </button>

                <button
                  onClick={() => setHasCherry(!hasCherry)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    hasCherry
                      ? 'border-[#9A3B2B] bg-[#9A3B2B]/5 font-medium'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                        hasCherry ? 'bg-[#9A3B2B]' : 'border border-stone-300'
                      }`}
                    >
                      {hasCherry && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="text-xs text-[#2C2420]">Bordeaux Maraschino Cherry</div>
                      <div className="text-[11px] text-stone-500">Stem-on, all natural</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#9A3B2B]">+$0.75</span>
                </button>
              </div>

              {/* Special Instructions Input */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#4A3E39] mb-1">
                  Scooper Notes or Allergies (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g., extra crispy waffle, separate nuts on side, napkins please..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-[#2C2420] placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#9A3B2B]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
