import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('eg_user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('eg_token'));

  const login = ({ user: userData, token: tokenData }) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('eg_user', JSON.stringify(userData));
    localStorage.setItem('eg_token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eg_user');
    localStorage.removeItem('eg_token');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
