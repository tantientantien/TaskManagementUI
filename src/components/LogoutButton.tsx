// components/LogoutButton.tsx
import React from 'react';
import { logout } from '../services/authService';

const LogoutButton: React.FC = () => {
  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;