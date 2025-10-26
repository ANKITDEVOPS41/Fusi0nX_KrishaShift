import React, { ReactNode } from 'react';

interface SecurityProviderProps {
  children: ReactNode;
}

const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  // Simple security provider that doesn't cause errors
  // Security functionality can be added later when needed
  
  return <>{children}</>;
};

export default SecurityProvider;