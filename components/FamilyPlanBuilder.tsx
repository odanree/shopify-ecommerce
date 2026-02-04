'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ShoppingCart, Plus, X, Smartphone, Shield } from 'lucide-react';
import styles from './FamilyPlanBuilder.module.css';

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

export default function FamilyPlanBuilder({
  config: customConfig,
  onAddToCart,
}: FamilyPlanBuilderProps) {
  const config = useMemo(() => ({ ...defaultConfig, ...customConfig }), [customConfig]);

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
    <div className={styles.familyPlanBuilder}>
      <div className={styles.container}>
        
        {/* Main Builder */}
        <div id="builder" className={styles.builderMain} data-cy="family-plan-builder">
          <h2 className={styles.builderTitle} data-cy="builder-title">
            Build Your Family Plan
          </h2>
          <p className={styles.builderSubtitle} data-cy="builder-subtitle">
            Select the number of lines and SIM type for each line.
          </p>

          <div className={styles.builderCard}>
            {/* Lines */}
            <div className={styles.linesList} data-cy="lines-list">
              {lines.map((line) => (
                <div key={line.id} className={styles.lineItem} data-cy={`line-item-${line.id}`}>
                  {/* Line Header */}
                  <div className={styles.lineHeader}>
                    <span className={styles.lineName}>
                      Line {line.id}:{' '}
                      {line.isPrimary ? config.primaryPlanName : config.addonPlanName}
                    </span>
                    {line.isPrimary ? (
                      <span className={`${styles.badge} ${styles.primaryBadge}`}>
                        Primary
                      </span>
                    ) : line.id === 2 ? (
                      <span className={`${styles.badge} ${styles.savingsBadge}`}>
                        Save ${config.addonSavings}
                      </span>
                    ) : null}
                  </div>

                  {/* Variant Options */}
                  <div className={styles.variantGrid}>
                    <label
                      className={`${styles.variantOption} ${
                        line.variant === 'sim' ? styles.variantOptionSelected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`line-${line.id}-variant`}
                        value="sim"
                        checked={line.variant === 'sim'}
                        onChange={() => updateLineVariant(line.id, 'sim')}
                        className={styles.variantRadio}
                      />
                      <Smartphone className={styles.variantIcon} />
                      <span className={styles.variantLabel}>SIM Card</span>
                      <span className={styles.variantSubtext}>
                        (Free Shipping)
                      </span>
                    </label>

                    <label
                      className={`${styles.variantOption} ${
                        line.variant === 'esim' ? styles.variantOptionSelected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`line-${line.id}-variant`}
                        value="esim"
                        checked={line.variant === 'esim'}
                        onChange={() => updateLineVariant(line.id, 'esim')}
                        className={styles.variantRadio}
                      />
                      <Shield className={styles.variantIcon} />
                      <span className={styles.variantLabel}>eSIM</span>
                      <span className={styles.variantSubtext}>
                        (Free Digital)
                      </span>
                    </label>
                  </div>

                  {/* Price */}
                  <div className={styles.linePrice}>
                    <span className={styles.priceAmount}>
                      ${line.isPrimary ? config.primaryLinePrice : config.addonLinePrice}
                    </span>
                    <span className={styles.priceUnit}>/mo</span>
                    {line.id === 2 && (
                      <span className={styles.addonPriceNote}>
                        Add-a-Line for ${config.addonLinePrice}/mo
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!line.isPrimary && (
                    <button
                      onClick={() => removeLine(line.id)}
                      className={styles.removeButton}
                      aria-label={`Remove line ${line.id}`}
                      data-cy={`remove-line-${line.id}`}
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Line Button */}
            <div className={styles.addLineSection}>
              <button
                onClick={addLine}
                disabled={lines.length >= config.maxLines}
                className={styles.addLineButton}
                data-cy="add-line-button"
              >
                <Plus className={styles.addLineIcon} />
                Add-a-Line for ${config.addonLinePrice}/mo
              </button>
              <p className={styles.addLineNote}>
                Minimum of {config.minLines} lines | Maximum of {config.maxLines} lines
              </p>
            </div>

            {/* Summary */}
            <div className={styles.summary} data-cy="pricing-summary">
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal:</span>
                <span className={styles.summaryAmount} data-cy="subtotal-amount">${subtotal}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
                <span>Total savings:</span>
                <span className={styles.savingsAmount} data-cy="savings-amount">${savings}</span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAddingToCart}
                className={styles.addToCartButton}
                data-cy="add-to-cart-button"
              >
                {isAddingToCart ? (
                  <>
                    <div className={styles.spinner}></div>
                    Adding to Cart...
                  </>
                ) : canAddToCart ? (
                  <>
                    <ShoppingCart className={styles.cartIcon} />
                    Add to Cart
                  </>
                ) : (
                  `Add at least ${config.minLines} lines to continue`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
