import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByText(/Shopify Store/i)).toBeTruthy();
  });

  it('displays copyright information', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeTruthy();
  });

  it('displays about us section', () => {
    render(<Footer />);
    expect(screen.getByText(/About Us/i)).toBeTruthy();
    expect(screen.getByText(/premium ecommerce destination/i)).toBeTruthy();
  });

  it('displays contact information', () => {
    render(<Footer />);
    expect(screen.getByText(/Contact/i)).toBeTruthy();
    expect(screen.getByText(/support@example.com/i)).toBeTruthy();
  });
});
