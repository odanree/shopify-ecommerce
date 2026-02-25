'use client';

import styles from './CheckoutComponents.module.css';

/**
 * Address form component for shipping information
 */
interface AddressStepProps {
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  onAddressChange: (address: any) => void;
  isLoading?: boolean;
}

export function AddressStep({ address, onAddressChange, isLoading = false }: AddressStepProps) {
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
            data-testid="shipping-firstName"
            value={address.firstName}
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
            data-testid="shipping-lastName"
            value={address.lastName}
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
            data-testid="shipping-address"
            value={address.address1}
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
            data-testid="shipping-city"
            value={address.city}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>State / Province</label>
          <input
            type="text"
            name="province"
            data-testid="shipping-state"
            value={address.province}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formInput}
            required
          />
        </div>
      </div>

      <div className={`${styles.formRow} ${styles.formRowFull}`}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>ZIP Code</label>
          <input
            type="text"
            name="zip"
            data-testid="shipping-zip"
            value={address.zip}
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
            data-testid="shipping-country"
            value={address.country}
            onChange={handleChange}
            disabled={isLoading}
            className={styles.formSelect}
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
