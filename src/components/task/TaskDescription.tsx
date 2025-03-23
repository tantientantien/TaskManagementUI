import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../services/api";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownIt from "markdown-it";
// import Swal from "sweetalert2";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

interface TaskDescriptionProps {
  taskId: number;
  initialDescription?: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  taskId,
  initialDescription = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);

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
      //   Swal.fire({
      //     title: "Success!",
      //     text: "Task description updated successfully.",
      //     icon: "success",
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#7C3AED",
      //     customClass: {
      //       popup: "rounded-lg shadow-md",
      //       title: "text-lg font-semibold text-gray-800",
      //       htmlContainer: "text-sm text-gray-600",
      //       confirmButton:
      //         "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //     },
      //     buttonsStyling: false,
      //   });
      toast.success("Task description updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      console.log(error);
      //   Swal.fire({
      //     title: "Error!",
      //     text: error.message || "Failed to update task description",
      //     icon: "error",
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#7C3AED",
      //     customClass: {
      //       popup: "rounded-lg shadow-md",
      //       title: "text-lg font-semibold text-gray-800",
      //       htmlContainer: "text-sm text-gray-600",
      //       confirmButton:
      //         "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //     },
      //     buttonsStyling: false,
      //   });
      toast.error("Failed to update task description");
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    if (description === initialDescription) {
      setIsEditing(false);
      return;
    }

    if (description.trim() === "") {
      //   Swal.fire({
      //     title: "Error!",
      //     text: "Task description cannot be empty",
      //     icon: "error",
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#7C3AED",
      //     customClass: {
      //       popup: "rounded-lg shadow-md",
      //       title: "text-lg font-semibold text-gray-800",
      //       htmlContainer: "text-sm text-gray-600",
      //       confirmButton:
      //         "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
      //     },
      //     buttonsStyling: false,
      //   });
      toast.error("Task description cannot be empty");
      return;
    }

    updateTaskMutation.mutate({ description });
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <label className="block font-semibold mb-2 text-1xl">Description</label>
      {isEditing ? (
        <div ref={editorRef} className="relative">
          <MarkdownEditor
            textContent={description}
            onChange={({ text }) => setDescription(text)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSave();
              } else if (e.key === "Escape") {
                handleCancel();
              }
            }}
          />
        </div>
      ) : (
        <div
          className="p-3 border-0 outline-gray-200 text-gray-600 text-sm rounded hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: mdParser.render(
                description || "Click to add a description..."
              ),
            }}
          />
        </div>
      )}
      <span className="flex items-center text-xs mt-5 text-gray-600">
        <svg
          className="w-4 h-4 mr-1 text-violet-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p className="font-semibold text-violet-500">Pro tips:</p>
        <p className="font-light ml-2">
          Press{" "}
          <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
            Ctrl
          </span>{" "}
          +{" "}
          <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
            Enter
          </span>{" "}
          to save, and press{" "}
          <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
            Esc
          </span>{" "}
          to escape.
        </p>
      </span>
    </div>
  );
};

export default TaskDescription;
