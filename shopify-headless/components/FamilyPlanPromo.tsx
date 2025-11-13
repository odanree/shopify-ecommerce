import Link from 'next/link';
import { memo } from 'react';
import styles from './FamilyPlanPromo.module.css';

const FamilyPlanPromoComponent = memo(function FamilyPlanPromo() {
  return (
    <section className={styles.promo} data-cy="family-plan-promo">
      <div className={styles.content}>
        <h2 className={styles.title} data-cy="promo-title">
          🏠 Save More with Family Plans
        </h2>
        <p className={styles.description} data-cy="promo-description">
          Build a custom family plan and save up to 25%! Select 2-6 family members, 
          choose individual devices for each person, and get instant pricing.
        </p>
        <div className={styles.features} data-cy="promo-features">
          <div className={styles.featureCard} data-cy="feature-members">
            <div className={styles.icon}>👨‍👩‍👧‍👦</div>
            <div className={styles.featureTitle}>2-6 Members</div>
            <div className={styles.featureDescription}>Flexible family sizes</div>
          </div>
          <div className={styles.featureCard} data-cy="feature-mix-match">
            <div className={styles.icon}>📱</div>
            <div className={styles.featureTitle}>Mix & Match</div>
            <div className={styles.featureDescription}>Choose devices per person</div>
          </div>
          <div className={styles.featureCard} data-cy="feature-savings">
            <div className={styles.icon}>💰</div>
            <div className={styles.featureTitle}>Save 15-25%</div>
            <div className={styles.featureDescription}>Instant bulk discounts</div>
          </div>
        </div>
        <Link 
          href="/family-plan"
          className={styles.button}
          data-cy="promo-cta-button"
        >
          Start Building Your Plan →
        </Link>
      </div>
    </section>
  );
});

export { FamilyPlanPromoComponent as FamilyPlanPromo };
