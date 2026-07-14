import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
  </div>
);
