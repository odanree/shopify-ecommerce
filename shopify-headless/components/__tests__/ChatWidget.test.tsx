import React from 'react';
import { render } from '@testing-library/react';
import { ChatWidget } from '../ChatWidget';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ onReady, ...props }: any) {
    // Simulate script loading
    React.useEffect(() => {
      if (onReady) {
        // Mock window.AIChatbot
        (window as any).AIChatbot = {
          init: jest.fn(),
        };
        onReady();
      }
    }, [onReady]);
    
    return <script {...props} />;
  };
});

describe('ChatWidget', () => {
  beforeEach(() => {
    // Clear any previous AIChatbot mocks
    delete (window as any).AIChatbot;
  });

  it('renders without crashing', () => {
    const { container } = render(<ChatWidget />);
    expect(container).toBeTruthy();
  });

  it('loads chatbot stylesheet', () => {
    const { container } = render(<ChatWidget />);
    const link = container.querySelector('link[rel="stylesheet"]');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toContain('chat-widget.css');
  });

  it('loads chatbot script', () => {
    const { container } = render(<ChatWidget />);
    const script = container.querySelector('script');
    expect(script).toBeTruthy();
    expect(script?.getAttribute('src')).toContain('chat-widget.js');
  });

  it('initializes chatbot with correct config', () => {
    const mockInit = jest.fn();
    (window as any).AIChatbot = {
      init: mockInit,
    };

    render(<ChatWidget />);

    // Wait for useEffect to run
    setTimeout(() => {
      expect(mockInit).toHaveBeenCalledWith({
        apiUrl: 'https://ai-chatbot-lake-eight-99.vercel.app',
        position: 'bottom-right',
        theme: 'light',
        strategyType: 'ecommerce',
      });
    }, 100);
  });
});
