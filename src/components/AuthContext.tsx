// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtVerify } from 'jose';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

  useEffect(() => {
    const token = cookies.access_token;
    if (token) {
      verifyToken(token);
    }
  }, [cookies]);

  const verifyToken = async (token) => {
    const secret = new TextEncoder().encode("pardiy") // Replace with your actual public key

    try {
      const { payload } = await jwtVerify(token, secret);
      setIsAuthenticated(true); // Optionally, add more checks based on the payload
    } catch (error) {
      console.error('Token verification failed:', error);
      setIsAuthenticated(false);
    }
  };

  const login = (token) => {
    setCookie('access_token', token, { path: '/' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie('access_token', { path: '/' });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
