import React from 'react';
import { Milk, Flame, Award, HeartHandshake } from 'lucide-react';

export const CraftStory: React.FC = () => {
  return (
    <section id="craft" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#2C2420]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#9A3B2B] mb-2">
            Philosophy & Sourcing
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] tracking-tight">
            Ice cream the way it was meant to taste: unhurried and pasture-rich.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B5E57] leading-relaxed">
            Most commercial ice cream pumps up to 50% air into their mix. At Velvet & Swirl, we churn
            in micro-batches with minimal overrun, producing dense, velvety ribbons that melt luxuriously on the palate.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-stone-200 flex items-center justify-center text-[#9A3B2B]">
              <Milk className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
              Sonoma Pasture Milk
            </h3>
            <p className="text-xs text-[#6B5E57] leading-relaxed">
              We partner exclusively with pasture-grazed Jersey cow dairies in Petaluma and Sonoma.
              Higher butterfat, golden grass-fed color, and zero synthetic hormones.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-stone-200 flex items-center justify-center text-[#9A3B2B]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
              Scratch-Baked Cones
            </h3>
            <p className="text-xs text-[#6B5E57] leading-relaxed">
              Every waffle cone is hand-poured onto cast-iron presses every 20 minutes in our scoop shops.
              Brown butter, vanilla caviar, and a dash of dark brown sugar.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-stone-200 flex items-center justify-center text-[#9A3B2B]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
              Compostable Packaging
            </h3>
            <p className="text-xs text-[#6B5E57] leading-relaxed">
              Our take-home pint tubs, tasting spoons, and delivery thermal insulators are made from
              100% plant fibers and biodegradable cornstarch.
            </p>
          </div>
        </div>

        {/* Claim-to-Proof Press Adjacency Strip */}
        <div className="bg-[#2C2420] text-[#FAF7F2] rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-[#F2C0B6] font-medium uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#F2C0B6]" />
                <span>Critical Acclaim</span>
              </div>
              <blockquote className="font-serif text-xl sm:text-2xl font-light text-white leading-snug">
                "The Wild Marionberry Mascarpone is nothing short of transcendent. Dense, silky, and balanced with natural berry acidity."
              </blockquote>
              <div className="text-xs text-stone-300">
                <span className="font-semibold text-white">Eater Bay Area</span> · Dining Guide Review
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 text-xs">
              <div>
                <div className="font-serif text-2xl sm:text-3xl text-white font-medium">98,000+</div>
                <div className="text-stone-400 mt-1">Cones hand-rolled annually across 4 parlors</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl text-white font-medium">100%</div>
                <div className="text-stone-400 mt-1">Solar-powered churn facility in SF Arts District</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
