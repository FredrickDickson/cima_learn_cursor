import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data.data);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });
    const token = res.data.token;
    localStorage.setItem('token', token);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(res.data.data);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password,
      role,
    });
    const token = res.data.token;
    localStorage.setItem('token', token);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(res.data.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

