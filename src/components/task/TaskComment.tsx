import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTaskComment, deleteComment } from "../../services/api";
import MarkdownEditor from "../components/MarkdownEditor";
import Swal from "sweetalert2";
import { User } from "../../structures/model";
import { useAuth } from "../../stores/authStore";
import MarkdownIt from "markdown-it";
import { Bin } from "iconoir-react";

const mdParser = new MarkdownIt();

interface Comment {
  id: number;
  user: User;
  content: string;
  createdAt: string;
}

interface TaskCommentProps {
  taskId: number;
  comments: Comment[];
}

const TaskComment: React.FC<TaskCommentProps> = ({ taskId, comments }) => {
  const [isComment, setIsComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => addTaskComment(taskId, content),
    onSuccess: () => {
      const newCommentObj: Comment = {
        id: 0,
        user: {
          id: 0,
          username: user?.username,
          email: user?.email,
          role: user?.role || "User",
        },
        content: newComment,
        createdAt: new Date().toUTCString(),
      };
      setLocalComments((prev) => [...prev, newCommentObj]);

      queryClient.invalidateQueries({ queryKey: ["task", taskId] });

      Swal.fire({
        title: "Success!",
        text: "Comment added successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-lg font-semibold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          confirmButton:
            "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
        },
        buttonsStyling: false,
      });
      setIsComment(false);
      setNewComment("");
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to add comment",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-lg font-semibold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          confirmButton:
            "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
        },
        buttonsStyling: false,
      });
      setIsComment(false);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      setLocalComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });

      Swal.fire({
        title: "Success!",
        text: "Comment deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-lg font-semibold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          confirmButton:
            "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
        },
        buttonsStyling: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete comment",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-lg font-semibold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          confirmButton:
            "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
        },
        buttonsStyling: false,
      });
    },
  });

  const handleSave = () => {
    if (newComment.trim() === "") {
      Swal.fire({
        title: "Error!",
        text: "Comment content cannot be empty",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#7C3AED",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-lg font-semibold text-gray-800",
          htmlContainer: "text-sm text-gray-600",
          confirmButton:
            "px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors duration-200",
        },
        buttonsStyling: false,
      });
      return;
    }

    addCommentMutation.mutate(newComment);
  };

  const handleCancel = () => {
    setNewComment("");
    setIsComment(false);
  };

  const handleDeleteComment = (commentId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete the task?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#000000",
      confirmButtonColor: "#8b5cf6",
      customClass: {
        popup: "rounded-lg shadow-md",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600",
        cancelButton:
          "px-4 py-2 text-sm font-semibold text-gray-500 bg-transparent rounded hover:bg-gray-200 transition-colors duration-200",
        confirmButton:
          "px-4 py-2 mr-5 text-sm outline-none font-semibold text-white bg-violet-600 rounded hover:bg-violet-500 transition-colors duration-200",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommentMutation.mutate(commentId);
      }
    });
  };

  return (
    <div className="mt-6">
      <label className="block font-semibold mb-2 text-1xl">Comment</label>

      <div>
        {isComment ? (
          <div ref={editorRef} className="relative">
            <MarkdownEditor
              textContent={newComment}
              onChange={({ text }) => setNewComment(text)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleSave();
                } else if (e.key === "Escape") {
                  handleCancel();
                }
              }}
            />
            <span className="flex items-center text-xs mt-2 text-gray-600">
              <svg
                className="w-4 h-4 mr-1 text-violet-600"
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
              <p className="font-semibold text-violet-700">Pro tips:</p>
              <p className="font-light ml-2">
                Press{" "}
                <span className="inline-flex items-center border border-gray-300 bg-gray-100 text-gray-800 font-semibold px-1.5 py-0.5 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200">
                  {navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"}
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
        ) : (
          <div
            className="w-full p-2 rounded-lg border-2 border-gray-200 text-gray-600 text-sm py-8 px-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            onClick={() => setIsComment(true)}
          >
            Add a comment...
          </div>
        )}
      </div>

      {localComments.map((comment, index) => (
        <div
          className="mt-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
          key={index}
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {comment.user.email == user?.email
                      ? "You"
                      : comment.user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {comment.user.email == user?.email ? (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <Bin className="w-5 h-5" />
                </button>
              ) : (
                <></>
              )}
            </div>

            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: mdParser.render(comment.content),
                }}
              />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskComment;