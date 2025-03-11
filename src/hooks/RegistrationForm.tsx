// src/components/RegistrationForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useRegister } from "../hooks/useRegister";
import { registrationSchema, RegistrationSchema } from "../validation/registrationSchema";
import { Link } from "react-router-dom";
import { useFormShake } from "../hooks/useFormShake";

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });

  const { register: registerUser, isPending } = useRegister();
  const { shake, triggerShakeAnimation } = useFormShake();

  const onSubmit: SubmitHandler<RegistrationSchema> = (data) => {
    registerUser(data, {
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
      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        register={register}
        placeholder="Confirm Password"
        required
        error={errors.confirmPassword}
        textColor="text-black"
      />
      <div className="mt-5">
        <Button
          type="submit"
          fullWidth
          disabled={isPending}
          color="#3b78df"
        >
          {isPending ? "..." : "Continue"}
        </Button>
      </div>
      <div className="flex items-center justify-center mt-4 text-sm">
        <p className="text-gray-500">Already have an account?&nbsp;</p>
        <Link to="/login" className="text-gray-500 hover:underline font-bold">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;