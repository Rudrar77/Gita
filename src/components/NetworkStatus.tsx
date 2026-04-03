import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { networkStatus } from '@/utils/capacitorUtils';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    networkStatus.checkConnection().then(setIsOnline);

    // Add listener for network changes
    networkStatus.addListener((connected) => {
      setIsOnline(connected);
    });
  }, []);

  if (isOnline) return null; // Don't show anything when online

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You're offline. Some features may not work.</span>
      </div>
    </div>
  );
};

export default NetworkStatus; 