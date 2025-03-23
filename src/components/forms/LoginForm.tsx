import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../forms/FormInput";
import Button from "../components/Button";
import { loginSchema, LoginSchema } from "../../validation/loginSchema";
import { Link, useNavigate } from "react-router-dom";
import { useFormShake } from "../forms/useFormShake";
import { useLogin } from "../../hooks/useLogin";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { login, isPending, error } = useLogin();
  const { shake, triggerShakeAnimation } = useFormShake();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const success = await login({ 
      email: data.email, 
      password: data.password,
      useCookies: true 
    });
    
    if (success) {
      navigate("/tasks");
    } else {
      triggerShakeAnimation();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mt-4 w-[350px] p-4 rounded-lg bg-transparent ${
        shake ? "animate-shake" : ""
      }`}
    >
      <FormInput
        id="email"
        label="E-mail"
        register={register}
        placeholder="Email"
        required
        error={errors.email}
        textColor="text-black"
      />
      <FormInput
        id="password"
        label="Password"
        type="password"
        register={register}
        placeholder="Password"
        required
        error={errors.password}
        textColor="text-black"
      />
      <div className="text-right mb-4">
        <a
          href="#"
          className="text-xs font-semibold text-gray-500 hover:text-gray-600"
        >
          Forgot Password?
        </a>
      </div>
      <div className="mt-5">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "..." : "Continue"}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">
          {error.message || "Login failed. Please try again."}
        </p>
      )}
      <div className="flex items-center justify-center mt-4 text-sm">
        <p className="text-gray-500">Don't have an account?&nbsp;</p>
        <Link
          to="/registration"
          className="text-gray-500 hover:underline font-bold"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
