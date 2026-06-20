import React, { createContext, useContext, useState } from 'react';

const QuoteModalContext = createContext();

export const useQuoteModal = () => {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  }
  return context;
};

export const QuoteModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  const openQuote = (serviceName = '') => {
    setPreselectedService(serviceName);
    setIsOpen(true);
  };

  const closeQuote = () => {
    setIsOpen(false);
    setPreselectedService('');
  };

  return (
    <QuoteModalContext.Provider value={{ isOpen, preselectedService, openQuote, closeQuote }}>
      {children}
    </QuoteModalContext.Provider>
  );
};
