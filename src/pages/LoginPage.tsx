import React from "react";
import LoginForm from "../hooks/LoginForm";
import Logo from "../components/Logo";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 bg-transparent p-10 shadow-2xl shadow-gray-400 rounded-3xl max-w-4xl w-full"
        style={{
          backgroundImage: "url('/assets/login-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-evenly p-6">
          <p className="text-gray-500 text-sm mt-2">
            <Logo />
          </p>
          <div></div>
          {/* <div className="text-4xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-green-300 to-amber-300 p-2">
            <p className="">Log in and</p>
            <p className="text-center pt-2 pb-1">get things</p>
            <p className="text-right text-7xl">done!</p>
          </div> */}
        </div>

        <div className="flex justify-center items-center">
          <span className="h-80 w-0.5 bg-gray-200"></span>
        </div>

        <div className="flex flex-col justify-center p-5 items-center">
          <h2 className="text-2xl font-bold text-gray-800 text-right">
            Sign in
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
