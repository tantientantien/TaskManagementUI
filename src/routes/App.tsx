import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../stores/authStore";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const { user, getMe } = useAuth();

  useEffect(() => {
    (async () => {
      await getMe();
    })();
  }, [getMe]);

  return (
    <>
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<DashboardPage />} />
            <Route path="/labels" element={<DashboardPage />} />
            <Route path="/categories" element={<DashboardPage />} />
            <Route path="/attachments" element={<DashboardPage />} />
            <Route path="/settings" element={<DashboardPage />} />
            <Route path="/support" element={<DashboardPage />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/tasks" replace /> : <LoginPage />}
          />
          <Route
            path="/registration"
            element={
              user ? <Navigate to="/tasks" replace /> : <RegistrationPage />
            }
          />

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/tasks" replace />} />
          <Route
            path="*"
            element={<Navigate to={user ? "/tasks" : "/login"} replace />}
          />
        </Routes>
      </Router>

      <ToastContainer position="bottom-right"/>
    </>
  );
};

export default App;
