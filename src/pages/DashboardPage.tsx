import React from 'react';
import Button from '../components/Button';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return <div>
    <h1>Hello World - Dashboard Page</h1>
    <Button type="button" fullWidth onClick={() => logout(navigate)}>
          Logout
    </Button>
  </div>
};

export default DashboardPage; 
