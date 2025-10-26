import React, { ReactNode } from 'react';

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Simple analytics provider that doesn't cause errors
  // Analytics functionality can be added later when needed
  
  return <>{children}</>;
};

export default AnalyticsProvider;