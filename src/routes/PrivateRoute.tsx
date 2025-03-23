import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";

const PrivateRoute: React.FC = () => {
  const { user, getMe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      getMe();
    }
  }, [user, getMe]);

  useEffect(() => {
    if (user === undefined) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (user === null) return <div>Loading...</div>;

  return user ? <Outlet /> : null;
};

export default PrivateRoute;