import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  // Rendering Tests
  it('renders search input with placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<SearchBar />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('has accessible label on search input', () => {
    render(<SearchBar />);
    const input = screen.getByLabelText('Search products');
    expect(input).toBeInTheDocument();
  });

  // User Interaction Tests
  it('allows user to type in search input', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input.value).toBe('test query');
  });

  it('navigates to search page with query on form submit', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: 'blue shirt' } });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/search?q=blue%20shirt');
  });

  it('navigates to search page when clicking search button', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'laptop' } });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/search?q=laptop');
  });

  // Edge Cases
  it('does not navigate if query is empty', () => {
    render(<SearchBar />);
    const form = screen.getByPlaceholderText('Search products...').closest('form')!;

    fireEvent.submit(form);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not navigate if query is only whitespace', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('trims whitespace from query before navigating', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: '  test query  ' } });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/search?q=test%20query');
  });

  it('encodes special characters in search query', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: 'search & test' } });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/search?q=search%20%26%20test');
  });

  it('handles multiple consecutive searches', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search products...');
    const form = input.closest('form')!;

    // First search
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.submit(form);

    // Second search
    fireEvent.change(input, { target: { value: 'second' } });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenNthCalledWith(1, '/search?q=first');
    expect(mockPush).toHaveBeenNthCalledWith(2, '/search?q=second');
  });
});
