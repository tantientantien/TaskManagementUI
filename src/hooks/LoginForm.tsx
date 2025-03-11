// src/components/LoginForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginSchema } from "../validation/loginSchema";
import { Link } from "react-router-dom";
import { useFormShake } from "../hooks/useFormShake";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { login, isLoading } = useAuth();
  const { shake, triggerShakeAnimation } = useFormShake();

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    login(data, {
      onError: () => triggerShakeAnimation(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mt-4 w-[300px] p-4 rounded-lg bg-transparent ${shake ? "animate-shake" : ""}`}
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
          className="text-xs font-semibold text-gray-500 hover:text-gray-600 cursor-pointer"
        >
          Forgot Password?
        </a>
      </div>
      <div className="mt-5">
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "..." : "Continue"}
        </Button>
      </div>
      <div className="flex items-center justify-center mt-4 text-sm">
        <p className="text-gray-500">Don’t have an account?&nbsp;</p>
        <Link to="/registration" className="text-gray-500 hover:underline font-bold">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;