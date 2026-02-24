'use client';

import { ReactNode } from 'react';

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          disabled={isLoading}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          disabled={isLoading}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        required
      />

      <input
        type="text"
        name="address1"
        placeholder="Street Address"
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          disabled={isLoading}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          onChange={handleChange}
          disabled={isLoading}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        />
      </div>

      <select
        name="country"
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
  );
}
