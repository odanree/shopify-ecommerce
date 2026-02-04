import React from 'react';
import { render, screen } from '@testing-library/react';
import { FamilyPlanPromo } from '../FamilyPlanPromo';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('FamilyPlanPromo', () => {
  it('renders without crashing', () => {
    render(<FamilyPlanPromo />);
    expect(screen.getByText(/Save More with Family Plans/i)).toBeTruthy();
  });

  it('displays promo message', () => {
    render(<FamilyPlanPromo />);
    expect(screen.getByText(/Build a custom family plan/i)).toBeTruthy();
    expect(screen.getByText(/save up to 25%/i)).toBeTruthy();
  });

  it('displays feature cards', () => {
    render(<FamilyPlanPromo />);
    expect(screen.getByText(/2-6 Members/i)).toBeTruthy();
    expect(screen.getByText(/Mix & Match/i)).toBeTruthy();
    expect(screen.getByText(/Save 15-25%/i)).toBeTruthy();
  });

  it('renders link to family plan page', () => {
    const { container } = render(<FamilyPlanPromo />);
    const link = container.querySelector('a[href="/family-plan"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Start Building Your Plan');
  });
});
