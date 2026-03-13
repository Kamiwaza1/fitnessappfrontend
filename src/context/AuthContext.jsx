import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Accept either a user object or a username string for backward compatibility
  const login = (userOrUsername) => {
    if (!userOrUsername) return;
    if (typeof userOrUsername === 'string') {
      setUser({ username: userOrUsername });
    } else {
      setUser(userOrUsername);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
