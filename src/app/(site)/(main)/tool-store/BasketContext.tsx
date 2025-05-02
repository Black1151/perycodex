"use client";

import React, { createContext, useContext } from 'react';
import { useBasket } from '@/hooks/useBasket';

const BasketContext = createContext<ReturnType<typeof useBasket> | null>(null);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const basket = useBasket();

  return (
    <BasketContext.Provider value={basket}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasketContext = () => {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasketContext must be inside BasketProvider");
  return ctx;
};
