import React from 'react';
import { Navbar } from './Navbar';
import { useWebSocket } from '../../hooks/useWebSocket';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { connected } = useWebSocket();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-end bg-gray-800 px-4 py-1">
        <span className={`flex items-center gap-1 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
