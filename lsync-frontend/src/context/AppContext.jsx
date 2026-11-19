import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. User Profile State
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { fullName: 'Daniel Okunlola', email: 'daniel@example.com', username: 'daniel-okunlola' };
  });

  // 2. Connected Platforms State (Empty [] for a brand new user by default)
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const stored = localStorage.getItem('connected_platforms');
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {}
    return []; // 0 platforms for new users
  });

  // Sync state changes back to localStorage so all pages stay updated
  useEffect(() => {
    localStorage.setItem('connected_platforms', JSON.stringify(connectedPlatforms));
  }, [connectedPlatforms]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Toggle helper for testing or real connection
  const togglePlatform = (platformName) => {
    setConnectedPlatforms((prev) => {
      if (prev.includes(platformName)) {
        return prev.filter((p) => p !== platformName);
      } else {
        return [...prev, platformName];
      }
    });
  };

  const isNewUser = connectedPlatforms.length === 0;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        connectedPlatforms,
        setConnectedPlatforms,
        togglePlatform,
        isNewUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}