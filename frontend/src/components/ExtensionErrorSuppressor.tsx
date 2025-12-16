"use client";

import { useEffect } from "react";

export function ExtensionErrorSuppressor() {
  useEffect(() => {
    // Suppress browser extension conflicts (Ethereum wallets redefining window.ethereum)
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj: any, prop: PropertyKey, descriptor: PropertyDescriptor) {
      try {
        return originalDefineProperty(obj, prop, descriptor);
      } catch (e: any) {
        if (prop === 'ethereum' && e?.message?.includes('redefine')) {
          console.warn('Browser extension conflict suppressed for:', prop);
          return obj;
        }
        throw e;
      }
    };

    return () => {
      Object.defineProperty = originalDefineProperty;
    };
  }, []);

  return null;
}
