import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock SearchBar component
jest.mock('../SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByText(/Shopify Store/i)).toBeTruthy();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/Products/i)).toBeTruthy();
    expect(screen.getByText(/Collections/i)).toBeTruthy();
    expect(screen.getByText(/Cart/i)).toBeTruthy();
  });

  it('renders search bar', () => {
    render(<Header />);
    expect(screen.getByTestId('search-bar')).toBeTruthy();
  });
});
