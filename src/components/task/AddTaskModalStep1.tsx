import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Xmark, NavArrowUp, NavArrowDown } from "iconoir-react";
import { Listbox, Transition } from "@headlessui/react";
import Button from "../components/Button";
import MarkdownEditor from "../components/MarkdownEditor";
import { CategoryDropdown } from "../components/CategoryDropdown";
import { Category, AddNewTask, User } from "../../structures/model";
import { fetchCategories, fetchUsers, addTask } from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserDropdown } from "../components/UserDropdown";

export const AddTaskModalStep1: React.FC<{
  onClose: () => void;
  onNext: (taskId: number) => void;
}> = ({ onClose, onNext }) => {
  const [task, setTask] = useState<AddNewTask>({
    title: "",
    description: "",
    isCompleted: false,
    assigneeId: 0,
    duedate: "",
    categoryId: 0,
  });
  const [isFadingOut, setIsFadingOut] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[],
    Error
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Initialize selectedCategory
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleCategoryChange = (category: Category | null) => {
    if (category && category.id !== selectedCategory?.id) {
      setSelectedCategory(category);
      setTask({ ...task, categoryId: category.id });
    }
  };

  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Initialize selectedUser
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  const addTaskMutation = useMutation({
    mutationFn: (newTask: AddNewTask) => addTask(newTask),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      Swal.fire({
        title: "Success!",
        text: "Task created successfully.",
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
      onNext(data.taskId);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create task",
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

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleNext = () => {
    // Validation
    if (!task.title || !task.duedate) {
      Swal.fire({
        title: "Error!",
        text: "Title and Due Date are required.",
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

    if (!selectedUser || selectedUser.id === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select an assignee.",
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

    if (!selectedCategory || selectedCategory.id === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select a category.",
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
    const taskPayload: AddNewTask = {
      ...task,
      assigneeId: selectedUser.id,
      categoryId: selectedCategory.id,
    };

    addTaskMutation.mutate(taskPayload);
  };

  return (
    <div
      className={`z-[100] fixed inset-0 flex items-center justify-center transition-opacity duration-300 animate-fade-in ${
        isFadingOut ? "opacity-0 bg-opacity-0" : "opacity-100 bg-opacity-50"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-2xl overflow-y-scroll w-[70%] min-h-auto max-h-[85vh] relative z-10 shadow-2xl transform transition-all animate-fade-in duration-700 ${
          isFadingOut
            ? "scale-95 opacity-0 translate-y-10"
            : "scale-100 opacity-100 translate-y-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="bg-white flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Create</h2>
            <div className="flex justify-end gap-2">
              <Button
                title="Close"
                className="border-2 border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                variant="primary_noborder"
                onClick={handleClose}
              >
                <Xmark />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-row items-start justify-between gap-6">
              <div className="w-[55%] flex flex-col space-y-6">
                {/* Title */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) =>
                      setTask({ ...task, title: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Enter task title"
                  />
                </div>

                {/* Description */}
                <div ref={editorRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <div className="rounded-xl transition-all duration-300">
                    <MarkdownEditor
                      textContent={task.description}
                      onChange={({ text }) =>
                        setTask({ ...task, description: text })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          handleNext();
                        } else if (e.key === "Escape") {
                          handleClose();
                        }
                      }}
                    />
                  </div>
                  <span className="flex items-center text-xs mt-3 text-gray-600">
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
              </div>

              <div className="w-[45%] flex flex-col space-y-6 p-6 rounded-xl transition-all duration-300">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Status
                  </label>
                  <Listbox
                    value={task.isCompleted}
                    onChange={(value) =>
                      setTask({ ...task, isCompleted: value })
                    }
                  >
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className="relative w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-gray-100 transform hover:scale-[1.01] transition-all duration-200">
                          <span className="block truncate text-gray-600">
                            {task.isCompleted ? "Completed" : "In Progress"}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {open ? (
                              <NavArrowUp className="w-5 h-5 text-violet-500" />
                            ) : (
                              <NavArrowDown className="w-5 h-5 text-violet-500" />
                            )}
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={React.Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 -translate-y-2"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 py-1">
                            <Listbox.Option
                              value={false}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 ${
                                  active
                                    ? "bg-violet-100 text-violet-900"
                                    : "text-gray-600"
                                }`
                              }
                            >
                              In Progress
                            </Listbox.Option>
                            <Listbox.Option
                              value={true}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 ${
                                  active
                                    ? "bg-violet-100 text-violet-900"
                                    : "text-gray-600"
                                }`
                              }
                            >
                              Completed
                            </Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    )}
                  </Listbox>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Assignee
                  </label>
                  <UserDropdown
                    selectedUser={selectedUser}
                    onUserChange={(user) => {
                      setSelectedUser(user);
                      setTask({ ...task, assigneeId: user?.id || 0 });
                    }}
                    users={users}
                    isLoadingUsers={isLoadingUsers}
                  />
                </div>

                {/* Due Date and Category */}
                <div className="flex flex-row justify-between gap-4">
                  {/* Due Date */}
                  <div className="w-[50%]">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={task.duedate}
                      onChange={(e) =>
                        setTask({ ...task, duedate: e.target.value })
                      }
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Category */}
                  <div className="w-[50%]">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category
                    </label>
                    <div onPointerCancel={(e) => e.stopPropagation()}>
                      <CategoryDropdown
                        isLabel={false}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        categories={categories}
                        isLoadingCategories={isLoadingCategories}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              className="px-10 py-2 bg-violet-500 text-white font-semibold rounded-lg shadow-md hover:bg-violet-600 transform hover:scale-105 transition-all duration-200 disabled:bg-violet-300"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
