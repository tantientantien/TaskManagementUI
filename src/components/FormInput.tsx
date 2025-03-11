import { UseFormRegister, FieldError, Path } from "react-hook-form";

interface FormInputProps<TFormValues extends Record<string, unknown>> {
  id: Path<TFormValues>;
  label: string;
  type?: string;
  register: UseFormRegister<TFormValues>;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
  textColor?: string;
}

const FormInput = <TFormValues extends Record<string, unknown>>({
  id,
  label,
  type = "text",
  register,
  required = false,
  error,
  placeholder = "",
  textColor = "text-black",
}: FormInputProps<TFormValues>) => {
  const inputClassName = `border-2 rounded-lg px-4 py-3 mt-1 text-sm w-full focus:outline-none transition-all duration-200 ${
    error ? "border-red-500 text-red-500 focus:ring-2 focus:ring-red-400" : `border-white ${textColor}`
  }`;  

  return (
    <div className="mb-4">
      <label
        className="font-semibold text-sm text-gray-600 pb-1 block"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={inputClassName}
        {...register(id, {
          required: required ? `${label} is required` : false,
        })}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;