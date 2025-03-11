import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={localStorage.getItem("user") ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/registration" element={localStorage.getItem("user") ? <Navigate to="/dashboard" /> : <RegistrationPage />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
