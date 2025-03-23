import { UseFormRegister, FieldError, Path } from "react-hook-form";
import { Label } from "./model";
export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "primary_noborder";
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  title?: string;
  color?: string;
}

export interface ClipTabProps {
  content?: string;
  position: "left" | "right" | "center";
  topOffset?: number;
  horizontalOffset?: number;
  bgColor?: string;
  textSize?: string;
  fontWeight?: string;
}

export interface FormInputProps<TFormValues extends Record<string, unknown>> {
  id: Path<TFormValues>;
  label: string;
  type?: string;
  register: UseFormRegister<TFormValues>;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
  textColor?: string;
}

export interface LogoProps {
  className?: string;
  sourceLogo: string;
  width?: string;
}

export interface TaskCardProps {
  category?: string;
  title: string;
  taskId: number;
  dueDate: string;
  assignee: {
      id: number,
      username: string,
      email: string
  }
  commentCount: number;
  attachmentCount: number;
  labels?: Label[];
}
