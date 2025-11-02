'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ShoppingCart, Plus, X, Smartphone, Shield, Check } from 'lucide-react';

export interface FamilyPlanLine {
  id: number;
  variant: 'sim' | 'esim';
  isPrimary: boolean;
  variantId?: string; // Shopify variant ID
}

export interface FamilyPlanConfig {
  primaryLinePrice: number;
  addonLinePrice: number;
  addonSavings: number;
  maxLines: number;
  minLines: number;
  primaryPlanName: string;
  addonPlanName: string;
  // Shopify variant IDs for each type
  primarySimVariantId?: string;
  primaryEsimVariantId?: string;
  addonSimVariantId?: string;
  addonEsimVariantId?: string;
}

interface FamilyPlanBuilderProps {
  config?: Partial<FamilyPlanConfig>;
  onAddToCart?: (lines: FamilyPlanLine[]) => void | Promise<void>;
  showHero?: boolean;
  showSteps?: boolean;
  showFeatures?: boolean;
}

const defaultConfig: FamilyPlanConfig = {
  primaryLinePrice: 49,
  addonLinePrice: 24,
  addonSavings: 25,
  maxLines: 5,
  minLines: 2,
  primaryPlanName: 'Unlimited Plan - Primary Line',
  addonPlanName: 'Unlimited Plan - Add-on Line',
  // Default to your variant ID - update these with your actual variant IDs
  primarySimVariantId: '44300835815469',
  primaryEsimVariantId: '44300835815469', // Update if different
  addonSimVariantId: '44300835815469', // Update with add-on line variant ID
  addonEsimVariantId: '44300835815469', // Update if different
};

const defaultFeatures = [
  'Unlimited 5G • 4G LTE Data per month',
  'Unlimited Nationwide Talk & Global Text',
  'Unlimited Talk to 90+ International Destinations',
  'Unlimited Talk & Text in Mexico and Canada',
  'Up to 10GB Mobile Hotspot',
  'Monthly $10 International Call Credit',
  'One-time $10 International Roaming Credit',
  'Free 5GB Mexico Data Roaming Pass each month',
  'Free 3-in-1 SIM Card or eSIM',
  'Bonus International Minutes to 9 Destinations',
];

const steps = [
  {
    number: '01',
    title: 'Get the first line',
    description: 'Start with one primary unlimited plan for $49/mo',
  },
  {
    number: '02',
    title: 'Add more lines',
    description: 'Add up to 4 additional lines for only $24/mo per line',
  },
  {
    number: '03',
    title: 'Activate your lines',
    description: 'Activate your primary line first, then add the remaining lines',
  },
  {
    number: '04',
    title: 'Manage everything',
    description: 'Easily manage all lines under one account on the website or in the app',
  },
];

export default function FamilyPlanBuilder({
  config: customConfig,
  onAddToCart,
  showHero = true,
  showSteps = true,
  showFeatures = true,
}: FamilyPlanBuilderProps) {
  const config = { ...defaultConfig, ...customConfig };

  const [lines, setLines] = useState<FamilyPlanLine[]>([
    { 
      id: 1, 
      variant: 'sim', 
      isPrimary: true,
      variantId: config.primarySimVariantId,
    },
  ]);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addLine = useCallback(() => {
    if (lines.length >= config.maxLines) {
      alert(`Maximum ${config.maxLines} lines allowed`);
      return;
    }

    setLines((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        variant: 'sim',
        isPrimary: false,
        variantId: config.addonSimVariantId,
      },
    ]);
  }, [lines.length, config.maxLines, config.addonSimVariantId]);

  const removeLine = useCallback((lineId: number) => {
    setLines((prev) => {
      const filtered = prev.filter((line) => line.id !== lineId);
      // Renumber remaining lines
      return filtered.map((line, index) => ({
        ...line,
        id: index + 1,
        isPrimary: index === 0,
      }));
    });
  }, []);

  const updateLineVariant = useCallback((lineId: number, variant: 'sim' | 'esim') => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id === lineId) {
          // Determine the correct variant ID based on line type and variant
          let variantId: string | undefined;
          if (line.isPrimary) {
            variantId = variant === 'sim' ? config.primarySimVariantId : config.primaryEsimVariantId;
          } else {
            variantId = variant === 'sim' ? config.addonSimVariantId : config.addonEsimVariantId;
          }
          return { ...line, variant, variantId };
        }
        return line;
      })
    );
  }, [config]);

  const { subtotal, savings } = useMemo(() => {
    const addonCount = Math.max(0, lines.length - 1);
    const subtotal = config.primaryLinePrice + addonCount * config.addonLinePrice;
    const savings = addonCount * config.addonSavings;
    return { subtotal, savings };
  }, [lines.length, config]);

  const canAddToCart = lines.length >= config.minLines;

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      alert(`Please add at least ${config.minLines} lines`);
      return;
    }

    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(lines);
      } else {
        // Default behavior - log to console
        console.log('Adding to cart:', lines);
        alert(`Added ${lines.length} lines to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="family-plan-builder bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Hero Section */}
        {showHero && (
          <div className="family-plan-hero bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-12 mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Save More with a Family Plan
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto">
              Get up to {config.maxLines} lines of unlimited data for as low as $
              {config.addonLinePrice}/mo when you add-a-line
            </p>
            <a
              href="#builder"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Build My Family Plan
              <svg
                className="w-5 h-5 animate-bounce-x"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}

        {/* How It Works Section */}
        {showSteps && (
          <div className="family-plan-steps mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              How Family Plan Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-6xl font-bold text-primary-500 opacity-20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Builder */}
        <div id="builder" className="family-plan-builder-main mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Build Your Family Plan
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Select the number of lines and SIM type for each line.
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
            {/* Lines */}
            <div className="space-y-5 mb-8">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 transition-all duration-300 hover:shadow-md"
                >
                  {/* Line Header */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-lg font-semibold text-gray-900">
                      Line {line.id}:{' '}
                      {line.isPrimary ? config.primaryPlanName : config.addonPlanName}
                    </span>
                    {line.isPrimary ? (
                      <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        Primary
                      </span>
                    ) : line.id === 2 ? (
                      <span className="px-3 py-1 bg-success-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        Save ${config.addonSavings}
                      </span>
                    ) : null}
                  </div>

                  {/* Variant Options */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <label
                      className={`cursor-pointer flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 min-h-[120px] ${
                        line.variant === 'sim'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`line-${line.id}-variant`}
                        value="sim"
                        checked={line.variant === 'sim'}
                        onChange={() => updateLineVariant(line.id, 'sim')}
                        className="sr-only"
                      />
                      <Smartphone
                        className={`w-8 h-8 mb-2 ${
                          line.variant === 'sim' ? 'text-primary-600' : 'text-gray-500'
                        }`}
                      />
                      <span className="font-medium text-center">SIM Card</span>
                      <span className="text-xs text-gray-500 mt-1">
                        (Free Shipping)
                      </span>
                    </label>

                    <label
                      className={`cursor-pointer flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 min-h-[120px] ${
                        line.variant === 'esim'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`line-${line.id}-variant`}
                        value="esim"
                        checked={line.variant === 'esim'}
                        onChange={() => updateLineVariant(line.id, 'esim')}
                        className="sr-only"
                      />
                      <Shield
                        className={`w-8 h-8 mb-2 ${
                          line.variant === 'esim' ? 'text-primary-600' : 'text-gray-500'
                        }`}
                      />
                      <span className="font-medium text-center">eSIM</span>
                      <span className="text-xs text-gray-500 mt-1">
                        (Free Digital)
                      </span>
                    </label>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary-600">
                      ${line.isPrimary ? config.primaryLinePrice : config.addonLinePrice}
                    </span>
                    <span className="text-gray-500">/mo</span>
                    {line.id === 2 && (
                      <span className="ml-auto text-sm text-success-600 font-semibold">
                        Add-a-Line for ${config.addonLinePrice}/mo
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!line.isPrimary && (
                    <button
                      onClick={() => removeLine(line.id)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-110"
                      aria-label={`Remove line ${line.id}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Line Button */}
            <div className="text-center py-6 border-b-2 border-gray-200 mb-8">
              <button
                onClick={addLine}
                disabled={lines.length >= config.maxLines}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Add-a-Line for ${config.addonLinePrice}/mo
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Minimum of {config.minLines} lines | Maximum of {config.maxLines} lines
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center py-3 text-lg">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="text-2xl font-bold text-gray-900">${subtotal}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-lg text-success-600 font-semibold border-b-2 border-gray-200 pb-4 mb-4">
                <span>Total savings:</span>
                <span className="text-2xl font-bold">${savings}</span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAddingToCart}
                className="w-full py-4 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding to Cart...
                  </>
                ) : canAddToCart ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                ) : (
                  `Add at least ${config.minLines} lines to continue`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {showFeatures && (
          <div className="family-plan-features bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Family Plan Features
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Each line has access to all these features. No need to share!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}
