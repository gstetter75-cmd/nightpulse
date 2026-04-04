'use client';

import { useEffect } from 'react';

export function RegisterServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.hostname !== 'localhost'
    ) {
      navigator.serviceWorker
        .register('/nightpulse/sw.js')
        .catch((error: unknown) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('SW registration failed:', error);
          }
        });
    }
  }, []);

  return null;
}
