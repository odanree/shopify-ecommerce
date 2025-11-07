'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function ChatWidget() {
  useEffect(() => {
    // Initialize chatbot after component mounts
    const initializeChatbot = () => {
      // @ts-ignore - AIChatbot is loaded from external script
      if (window.AIChatbot) {
        // @ts-ignore
        window.AIChatbot.init({
          apiUrl: 'https://ai-chatbot-lake-eight-99.vercel.app',
          position: 'bottom-right',
          theme: 'light',
          strategyType: 'ecommerce' // Use ecommerce strategy for shopping assistance
        });
      }
    };

    // Try to initialize immediately in case script already loaded
    initializeChatbot();
  }, []);

  return (
    <>
      {/* AI Chatbot Widget Styles */}
      <link
        rel="stylesheet"
        href="https://ai-chatbot-lake-eight-99.vercel.app/chat-widget.css"
      />
      
      {/* AI Chatbot Widget Script */}
      <Script
        src="https://ai-chatbot-lake-eight-99.vercel.app/chat-widget.js"
        strategy="afterInteractive"
        onReady={() => {
          // @ts-ignore - AIChatbot is loaded from external script
          if (window.AIChatbot) {
            // @ts-ignore
            window.AIChatbot.init({
              apiUrl: 'https://ai-chatbot-lake-eight-99.vercel.app',
              position: 'bottom-right',
              theme: 'light',
              strategyType: 'ecommerce' // Use ecommerce strategy for shopping assistance
            });
          }
        }}
      />
    </>
  );
}
