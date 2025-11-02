import Link from 'next/link';
import styles from './FamilyPlanPromo.module.css';

export function FamilyPlanPromo() {
  return (
    <section className={styles.promo}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          🏠 Save More with Family Plans
        </h2>
        <p className={styles.description}>
          Build a custom family plan and save up to 25%! Select 2-6 family members, 
          choose individual devices for each person, and get instant pricing.
        </p>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>👨‍👩‍👧‍👦</div>
            <div className={styles.featureTitle}>2-6 Members</div>
            <div className={styles.featureDescription}>Flexible family sizes</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📱</div>
            <div className={styles.featureTitle}>Mix & Match</div>
            <div className={styles.featureDescription}>Choose devices per person</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>💰</div>
            <div className={styles.featureTitle}>Save 15-25%</div>
            <div className={styles.featureDescription}>Instant bulk discounts</div>
          </div>
        </div>
        <Link 
          href="/family-plan"
          className={styles.button}
        >
          Start Building Your Plan →
        </Link>
      </div>
    </section>
  );
}
