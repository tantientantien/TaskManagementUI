import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../services/api"; // Hàm updateTask từ trước
// import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { Check, Xmark } from "iconoir-react";

interface TaskTitleInputProps {
  taskId: number;
  title: string;
}

const TaskTitleInput: React.FC<TaskTitleInputProps> = ({ taskId, title }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();


  const updateTaskMutation = useMutation({
    mutationFn: (
      payload: Partial<{
        title: string;
        description: string;
        assigneeId: number;
        duedate: string;
        isCompleted: boolean;
        categoryId: number;
      }>
    ) => updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Swal.fire({
      //   title: "Success!",
      //   text: "Task title updated successfully.",
      //   icon: "success",
      //   confirmButtonText: "OK",
      //   confirmButtonColor: "#7C3AED",
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-lg font-semibold text-gray-800",
      //     htmlContainer: "text-sm text-gray-600",
      //     confirmButton:
      //       "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //   },
      //   buttonsStyling: false,
      // });
      toast.success("Task title updated successfully");
      setIsFocused(false);
    },
    onError: () => {
      // Swal.fire({
      //   title: "Error!",
      //   text: error.message || "Failed to update task title",
      //   icon: "error",
      //   confirmButtonText: "OK",
      //   confirmButtonColor: "#7C3AED",
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-lg font-semibold text-gray-800",
      //     htmlContainer: "text-sm text-gray-600",
      //     confirmButton:
      //       "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //   },
      //   buttonsStyling: false,
      // });
      toast.error("Failed to update task title");
      setIsFocused(false); 
    },
  });

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCancel = () => {
    setNewTitle(title); 
    setIsFocused(false); 
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleOk = () => {
    if (newTitle.trim() === "") {
      // Swal.fire({
      //   title: "Error!",
      //   text: "Task title cannot be empty",
      //   icon: "error",
      //   confirmButtonText: "OK",
      //   confirmButtonColor: "#7C3AED",
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-lg font-semibold text-gray-800",
      //     htmlContainer: "text-sm text-gray-600",
      //     confirmButton:
      //       "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //   },
      //   buttonsStyling: false,
      // });
      toast.error("Task title cannot be empty");
      return;
    }

    if (newTitle !== title) {
      updateTaskMutation.mutate({ title: newTitle });
    } else {
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            handleOk();
          } else if (e.key === "Escape") {
            handleCancel();
          }
        }}
        className="w-full p-2 rounded border-0 outline-gray-200 font-semibold text-3xl"
      />
      {isFocused && (
        <div className="absolute bg-white top-13 right-0 flex gap-2 p-1 animate-fade-in">
          <Button
            title="Close"
            className="border-2 border-gray-200"
            variant="primary_noborder"
            onClick={handleCancel}
          >
            <Xmark />
          </Button>
          <Button
            title="Close"
            className="border-2 border-gray-200"
            variant="primary_noborder"
            onClick={handleOk}
          >
            <Check />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskTitleInput;
