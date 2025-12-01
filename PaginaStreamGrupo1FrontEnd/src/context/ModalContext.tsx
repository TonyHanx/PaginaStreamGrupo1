import React, { createContext, useContext } from 'react';

interface ModalContextType {
  showTerminos: () => void;
  showPoliticas: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    return {
      showTerminos: () => {},
      showPoliticas: () => {}
    };
  }
  return context;

};

export const ModalProvider: React.FC<{ value: ModalContextType; children: React.ReactNode }> = ({ value, children }) => {
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
