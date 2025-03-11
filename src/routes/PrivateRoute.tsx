import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("user");

const PrivateRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
