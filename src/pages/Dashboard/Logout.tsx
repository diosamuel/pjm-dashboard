import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const Logout = () => {
  const [, , removeCookie] = useCookies(['access_token']);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    removeCookie('access_token', { path: '/' });
    logout();
    navigate('/login');
  }, [removeCookie, logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
