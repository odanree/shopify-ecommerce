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
      
      {/* Mobile Override Styles - Load AFTER widget CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          /* Chatbot container */
          [class*="chatbot"],
          [id*="chatbot"],
          [class*="chat-widget"],
          [id*="chat-widget"] {
            max-width: 90vw !important;
            max-height: 70vh !important;
            width: 90vw !important;
            height: auto !important;
          }
          
          /* Chatbot button */
          [class*="chat"][class*="button"],
          [class*="chatbot"][class*="button"] {
            width: 56px !important;
            height: 56px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
          
          /* Messages container */
          [class*="messages"],
          [class*="chat-messages"] {
            max-height: calc(70vh - 140px) !important;
            overflow-y: auto !important;
          }
          
          /* Input area */
          [class*="chat"][class*="input"],
          [class*="message"][class*="input"] {
            font-size: 16px !important;
          }
        }
      `}</style>
      
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
