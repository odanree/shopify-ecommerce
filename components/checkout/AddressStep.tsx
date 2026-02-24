'use client';

import styles from './CheckoutComponents.module.css';

/**
 * Address form component for shipping information
 */
interface AddressStepProps {
  onAddressChange: (address: any) => void;
  isLoading?: boolean;
}

export function AddressStep({ onAddressChange, isLoading = false }: AddressStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onAddressChange((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.addressForm}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>First Name</label>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Last Name</label>
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={`${styles.formRow} ${styles.formRowFull}`}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={`${styles.formRow} ${styles.formRowFull}`}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Street Address</label>
          <input
            type="text"
            name="address1"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>City</label>
          <input
            type="text"
            name="city"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>ZIP Code</label>
          <input
            type="text"
            name="zip"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={`${styles.formRow} ${styles.formRowFull}`}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Country</label>
          <select
            name="country"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formSelect}
            defaultValue="US"
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
