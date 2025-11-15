import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/admin/Login';
import { useAuth } from '../context/AuthContext';

/**
 * AdminLoginPage Component
 * Admin login page (redirects to dashboard if already logged in)
 */
const AdminLoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return <Login />;
};

export default AdminLoginPage;
