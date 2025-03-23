import React from "react";
import LoginForm from "../components/forms/LoginForm";
import Logo from "../components/components/Logo";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center p-5 items-center">
        <p className="text-gray-500 text-sm mt-2">
          <Logo sourceLogo="/assets/logo.png" width="w-60" />
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
