import React, { useState, useMemo } from 'react';
import { Search, Plus, Info, Check, Sparkles, Filter, X } from 'lucide-react';
import { Flavor, PremadeSundae, CartItem } from '../types';
import { FLAVORS_DATA, PREMADE_SUNDAES } from '../data/mockData';

interface InteractiveMenuProps {
  onAddToCart: (item: CartItem) => void;
  onOpenBuilder: () => void;
}

export const InteractiveMenu: React.FC<InteractiveMenuProps> = ({
  onAddToCart,
  onOpenBuilder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVeganOnly, setFilterVeganOnly] = useState<boolean>(false);
  const [filterGlutenFreeOnly, setFilterGlutenFreeOnly] = useState<boolean>(false);
  const [filterNutFreeOnly, setFilterNutFreeOnly] = useState<boolean>(false);
  
  // Selected size per flavor for quick adding (single, double, pint)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'single' | 'double' | 'pint'>>({});
  // Selected vessel per flavor
  const [selectedVessels, setSelectedVessels] = useState<Record<string, 'waffle-cone' | 'cup'>>({});
  
  // Detail Modal
  const [activeDetailItem, setActiveDetailItem] = useState<Flavor | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Filtered flavors
  const filteredFlavors = useMemo(() => {
    return FLAVORS_DATA.filter((flavor) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'signature' && flavor.category !== 'signature') return false;
        if (selectedCategory === 'seasonal' && flavor.category !== 'seasonal') return false;
        if (selectedCategory === 'vegan' && !flavor.isVegan) return false;
        if (selectedCategory === 'classics' && flavor.category !== 'classics') return false;
      }

      // Dietary filters
      if (filterVeganOnly && !flavor.isVegan) return false;
      if (filterGlutenFreeOnly && !flavor.isGlutenFree) return false;
      if (filterNutFreeOnly && !flavor.isNutFree) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = flavor.name.toLowerCase().includes(query);
        const matchesDesc = flavor.description.toLowerCase().includes(query);
        const matchesNotes = flavor.tastingNotes.some(n => n.toLowerCase().includes(query));
        const matchesIngredients = flavor.ingredients.some(i => i.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesNotes && !matchesIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery, filterVeganOnly, filterGlutenFreeOnly, filterNutFreeOnly]);

  const handleAddFlavor = (flavor: Flavor) => {
    const size = selectedSizes[flavor.id] || 'single';
    const vessel = selectedVessels[flavor.id] || 'waffle-cone';
    
    let price = flavor.singlePrice;
    let sizeTitle = 'Single Scoop';
    if (size === 'double') {
      price = flavor.doublePrice;
      sizeTitle = 'Double Scoop';
    } else if (size === 'pint') {
      price = flavor.pintPrice;
      sizeTitle = 'Hand-Packed Pint';
    }

    // Add vessel price if not pint and waffle cone
    let finalVessel = size === 'pint' ? 'Paper Pint Tub' : (vessel === 'waffle-cone' ? 'Warm Waffle Cone' : 'Compostable Cup');
    let finalPrice = price;
    if (size !== 'pint' && vessel === 'waffle-cone') {
      finalPrice += 1.25;
    }

    const cartItem: CartItem = {
      id: `${flavor.id}-${size}-${vessel}-${Date.now()}`,
      type: size === 'pint' ? 'pint' : 'scoop',
      title: flavor.name,
      subtitle: `${sizeTitle} · ${finalVessel}`,
      unitPrice: finalPrice,
      quantity: 1,
      totalPrice: finalPrice,
      details: {
        size: sizeTitle,
        vessel: finalVessel,
        scoops: [flavor.name],
      },
      image: flavor.image,
    };

    onAddToCart(cartItem);
    setAddedItemNotice(flavor.name);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const handleAddSundae = (sundae: PremadeSundae) => {
    const cartItem: CartItem = {
      id: `sundae-${sundae.id}-${Date.now()}`,
      type: 'premade_sundae',
      title: sundae.name,
      subtitle: sundae.vessel,
      unitPrice: sundae.price,
      quantity: 1,
      totalPrice: sundae.price,
      details: {
        vessel: sundae.vessel,
        scoops: sundae.scoops,
        toppings: [...sundae.sauces, ...sundae.toppings],
      },
      image: sundae.image,
    };

    onAddToCart(cartItem);
    setAddedItemNotice(sundae.name);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#2C2420]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#2C2420]/10">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-[#9A3B2B] mb-2">
              Daily Churned Menu
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] tracking-tight">
              Small-Batch Flavors & Pairings
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B5E57] max-w-2xl">
              Fresh churned with pasture-fed sweet cream, organic fruit reductions, and fair-trade spices.
              Available in single scoops, generous doubles, and insulated pints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBuilder}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#9A3B2B] hover:bg-[#832F21] rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2C0B6]" />
              <span>Build Custom Sundae</span>
            </button>
          </div>
        </div>

        {/* Added Notification Toast */}
        {addedItemNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#2C2420] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm animate-fade-in border border-white/10">
            <span className="w-5 h-5 rounded-full bg-[#3D7847] flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>
              Added <strong>{addedItemNotice}</strong> to your bag!
            </span>
          </div>
        )}

        {/* Filter Controls: Tabs + Search + Dietary Toggles */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Segmented Control (Interactive Filter Buttons) */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto scrollbar-none max-w-full">
              {[
                { id: 'all', label: 'All Scoops' },
                { id: 'signature', label: 'Signature' },
                { id: 'seasonal', label: 'Seasonal' },
                { id: 'vegan', label: 'Dairy-Free [V]' },
                { id: 'classics', label: 'Heritage Classics' },
                { id: 'sundaes', label: 'Chef Sundaes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-white text-[#2C2420] shadow-xs'
                      : 'text-[#6B5E57] hover:text-[#2C2420]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasting notes, nuts, chocolate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-lg text-[#2C2420] placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#9A3B2B] focus:border-[#9A3B2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dietary Filters & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#6B5E57]">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-[#4A3E39]">
                <Filter className="w-3.5 h-3.5 text-[#9A3B2B]" />
                Dietary Preference:
              </span>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#2C2420]">
                <input
                  type="checkbox"
                  checked={filterVeganOnly}
                  onChange={(e) => setFilterVeganOnly(e.target.checked)}
                  className="rounded border-stone-300 text-[#9A3B2B] focus:ring-[#9A3B2B]"
                />
                <span>100% Plant-Based [V]</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#2C2420]">
                <input
                  type="checkbox"
                  checked={filterGlutenFreeOnly}
                  onChange={(e) => setFilterGlutenFreeOnly(e.target.checked)}
                  className="rounded border-stone-300 text-[#9A3B2B] focus:ring-[#9A3B2B]"
                />
                <span>Gluten-Friendly</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#2C2420]">
                <input
                  type="checkbox"
                  checked={filterNutFreeOnly}
                  onChange={(e) => setFilterNutFreeOnly(e.target.checked)}
                  className="rounded border-stone-300 text-[#9A3B2B] focus:ring-[#9A3B2B]"
                />
                <span>Nut-Free Kitchen</span>
              </label>
            </div>

            <div className="text-stone-400 tabular-nums font-mono">
              Showing {selectedCategory === 'sundaes' ? PREMADE_SUNDAES.length : filteredFlavors.length} artisanal selections
            </div>
          </div>
        </div>

        {/* Chef Sundaes Display if 'sundaes' selected */}
        {selectedCategory === 'sundaes' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PREMADE_SUNDAES.map((sundae) => (
              <div
                key={sundae.id}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                    <img
                      src={sundae.image}
                      alt={sundae.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#2C2420]/80 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                      Chef Creation
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                        {sundae.name}
                      </h3>
                      <span className="font-mono text-base font-semibold text-[#9A3B2B] tabular-nums">
                        ${sundae.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#7B6E67] leading-relaxed">
                      {sundae.description}
                    </p>

                    <div className="pt-2 text-xs text-[#5C4F47] space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <span className="font-medium text-[#2C2420]">Vessel:</span>
                        <span>{sundae.vessel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <span className="font-medium text-[#2C2420]">Scoops:</span>
                        <span>{sundae.scoops.join(' & ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAddSundae(sundae)}
                    className="w-full py-2.5 px-4 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Sundae to Bag (${sundae.price.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flavors Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFlavors.map((flavor) => {
              const currentSize = selectedSizes[flavor.id] || 'single';
              const currentVessel = selectedVessels[flavor.id] || 'waffle-cone';
              const price =
                currentSize === 'single'
                  ? flavor.singlePrice
                  : currentSize === 'double'
                  ? flavor.doublePrice
                  : flavor.pintPrice;
              const finalPrice =
                currentSize !== 'pint' && currentVessel === 'waffle-cone'
                  ? price + 1.25
                  : price;

              return (
                <div
                  key={flavor.id}
                  className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Flavor Image Card Top */}
                    <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden group">
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Flavor Hue Swatch */}
                      <div
                        className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md bg-white/90 text-[#2C2420] shadow-xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: flavor.colorHex }}
                        />
                        <span>{flavor.category === 'seasonal' ? 'Seasonal' : flavor.isVegan ? 'Plant Oat' : 'Pasture Milk'}</span>
                      </div>

                      {/* Detail Info Button */}
                      <button
                        onClick={() => setActiveDetailItem(flavor)}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-[#2C2420] rounded-full shadow-xs transition-colors"
                        title="Tasting Notes & Ingredients"
                        aria-label={`Details for ${flavor.name}`}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-[#2C2420] leading-snug">
                            {flavor.name}
                          </h3>
                          <p className="text-xs text-[#7B6E67] mt-0.5 line-clamp-1">
                            {flavor.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Zero-Pill Tasting Notes with typographic dot separators */}
                      <div className="flex items-center gap-1.5 text-xs text-[#6B5E57] flex-wrap">
                        {flavor.tastingNotes.map((note, idx) => (
                          <React.Fragment key={note}>
                            {idx > 0 && <span className="text-stone-300">·</span>}
                            <span>{note}</span>
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Dietary Indicators */}
                      <div className="flex items-center gap-3 text-[11px] text-[#7B6E67] pt-1 border-t border-stone-100">
                        {flavor.isVegan && <span className="font-semibold text-[#3D7847]">Vegan Oat Base</span>}
                        {flavor.isGlutenFree && <span>Gluten-Friendly</span>}
                        {flavor.isNutFree && <span>Nut-Free</span>}
                        <span className="font-mono tabular-nums text-stone-400">
                          {flavor.caloriesPerScoop} kcal/scoop
                        </span>
                      </div>

                      {/* Portion Size Selector */}
                      <div className="pt-2">
                        <div className="text-[11px] font-medium text-[#4A3E39] mb-1.5">
                          Select Portion Size:
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-lg">
                          <button
                            onClick={() =>
                              setSelectedSizes((prev) => ({ ...prev, [flavor.id]: 'single' }))
                            }
                            className={`py-1.5 text-xs font-medium rounded transition-colors text-center ${
                              currentSize === 'single'
                                ? 'bg-white text-[#2C2420] shadow-xs'
                                : 'text-stone-600 hover:text-[#2C2420]'
                            }`}
                          >
                            Single (${flavor.singlePrice.toFixed(2)})
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSizes((prev) => ({ ...prev, [flavor.id]: 'double' }))
                            }
                            className={`py-1.5 text-xs font-medium rounded transition-colors text-center ${
                              currentSize === 'double'
                                ? 'bg-white text-[#2C2420] shadow-xs'
                                : 'text-stone-600 hover:text-[#2C2420]'
                            }`}
                          >
                            Double (${flavor.doublePrice.toFixed(2)})
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSizes((prev) => ({ ...prev, [flavor.id]: 'pint' }))
                            }
                            className={`py-1.5 text-xs font-medium rounded transition-colors text-center ${
                              currentSize === 'pint'
                                ? 'bg-white text-[#2C2420] shadow-xs'
                                : 'text-stone-600 hover:text-[#2C2420]'
                            }`}
                          >
                            Pint (${flavor.pintPrice.toFixed(2)})
                          </button>
                        </div>
                      </div>

                      {/* Vessel Selector if not pint */}
                      {currentSize !== 'pint' && (
                        <div className="pt-1 flex items-center justify-between text-xs">
                          <span className="text-[#6B5E57]">Vessel:</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`vessel-${flavor.id}`}
                                checked={currentVessel === 'waffle-cone'}
                                onChange={() =>
                                  setSelectedVessels((prev) => ({
                                    ...prev,
                                    [flavor.id]: 'waffle-cone',
                                  }))
                                }
                                className="text-[#9A3B2B] focus:ring-[#9A3B2B]"
                              />
                              <span className="text-[#2C2420]">Waffle (+$1.25)</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`vessel-${flavor.id}`}
                                checked={currentVessel === 'cup'}
                                onChange={() =>
                                  setSelectedVessels((prev) => ({
                                    ...prev,
                                    [flavor.id]: 'cup',
                                  }))
                                }
                                className="text-[#9A3B2B] focus:ring-[#9A3B2B]"
                              />
                              <span className="text-[#2C2420]">Eco Cup ($0)</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleAddFlavor(flavor)}
                      className="w-full py-2.5 px-4 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-[0.99]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        Add to Bag ·{' '}
                        <span className="font-mono tabular-nums">${finalPrice.toFixed(2)}</span>
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty Search State */}
        {filteredFlavors.length === 0 && selectedCategory !== 'sundaes' && (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8">
            <p className="font-serif text-xl text-[#2C2420]">No flavors matching your search.</p>
            <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
              Try adjusting your dietary filters or searching for terms like "chocolate", "berry", or "bourbon".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterVeganOnly(false);
                setFilterGlutenFreeOnly(false);
                setFilterNutFreeOnly(false);
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#9A3B2B] hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Flavor Tasting & Ingredient Detail Modal */}
        {activeDetailItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
              <div className="aspect-[16/9] relative overflow-hidden bg-stone-100">
                <img
                  src={activeDetailItem.image}
                  alt={activeDetailItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActiveDetailItem(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-[#2C2420] rounded-full shadow-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-[#9A3B2B] uppercase tracking-wider">
                    {activeDetailItem.category} Collection
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
                    {activeDetailItem.name}
                  </h3>
                  <p className="text-sm text-[#5C4F47] mt-1">
                    {activeDetailItem.description}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200/80 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-[#2C2420] uppercase tracking-wider mb-1">
                      Tasting Profile
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#6B5E57] flex-wrap">
                      {activeDetailItem.tastingNotes.map((note, i) => (
                        <span key={note} className="bg-stone-100 px-2 py-1 rounded text-stone-700">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#2C2420] uppercase tracking-wider mb-1">
                      Ingredients
                    </h4>
                    <p className="text-xs text-[#6B5E57] leading-relaxed">
                      {activeDetailItem.ingredients.join(', ')}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-stone-500">
                    Single: <span className="font-mono tabular-nums font-semibold text-[#2C2420]">${activeDetailItem.singlePrice.toFixed(2)}</span> ·
                    Pint: <span className="font-mono tabular-nums font-semibold text-[#2C2420]">${activeDetailItem.pintPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleAddFlavor(activeDetailItem);
                      setActiveDetailItem(null);
                    }}
                    className="px-5 py-2.5 bg-[#9A3B2B] hover:bg-[#832F21] text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Add Single Scoop to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
