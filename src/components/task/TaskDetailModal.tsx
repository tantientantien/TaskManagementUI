import { Category, Label, Task, TaskDetail } from "../../structures/model";
import { Plus, Xmark } from "iconoir-react";
import { useState } from "react";
import Button from "../components/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAttachment,
  uploadAttachment,
  fetchTaskLabels,
  fetchCategories,
  updateTask,
} from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ACCESSFILE } from "../../config/environment";
import LabelDropdown from "../components/LabelDropdown";
import LabelBadge from "../components/LabelBadge";
import TaskTitleInput from "./TaskTitleInput";
import TaskDescription from "./TaskDescription";
import TaskComment from "./TaskComment";
import { CategoryDropdown } from "../components/CategoryDropdown";
import { UpdateTaskPayload } from "../../structures/others";

export const TaskDetailModal = ({
  task,
  onClose,
}: {
  task: TaskDetail;
  onClose: () => void;
}) => {
  const [attachments, setAttachments] = useState<
    Array<{
      id: number;
      fileName: string;
      fileUrl: string;
      taskId: number;
      uploadedAt: string;
    }>
  >(task.attachments);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    task.category || null
  );

  const queryClient = useQueryClient();

  const { data: taskLabels = [] } = useQuery<Label[], Error>({
    queryKey: ["taskLabels", task.id],
    queryFn: () => fetchTaskLabels(task.id),
    initialData: task.labels,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[],
    Error
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (
      payload: Partial<UpdateTaskPayload>
    ) => updateTask(task.id, payload),
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task category");
    },
  });

  const handleCategoryChange = (category: Category | null) => {
    if (selectedCategory?.id !== category?.id) {
      const previousCategory = selectedCategory;
      
      setSelectedCategory(category);
      
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return oldTasks;
        
        return oldTasks.map((t) => 
          t.id === task.id 
            ? { ...t, categoryId: category?.id || null, category: category } 
            : t
        );
      });
      
      updateTaskMutation.mutate(
        { categoryId: category?.id },
        {
          onError: () => {
            setSelectedCategory(previousCategory);
            
            queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
              if (!oldTasks) return oldTasks;
              
              return oldTasks.map((t) => 
                t.id === task.id 
                  ? { ...t, categoryId: previousCategory?.id || null, category: previousCategory } 
                  : t
              );
            });
            
            toast.error("Failed to update task category");
          }
        }
      );
    }
  };

  const { mutate: deleteAttachmentMutate, status: deleteStatus } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: (_, attachmentId) => {
      setAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== attachmentId)
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Attachment deleted successfully!");
    },
    onError: () => {
      toast.error("You don't have permission!");
    },
  });

  const { mutate: uploadAttachmentMutate, status: uploadStatus } = useMutation({
    mutationFn: ({ taskId, file }: { taskId: number; file: File }) =>
      uploadAttachment(taskId, file),
    onSuccess: (newAttachment) => {
      setAttachments((prev) => [...prev, newAttachment]);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Attachment uploaded successfully!");
    },
    onError: (error) => {
      console.error("Failed to upload attachment:", error);
      toast.error("Failed to upload attachment");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAttachmentMutate({ taskId: task.id, file });
      event.target.value = "";
    }
  };

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      onPointerDown={(e) => e.preventDefault()}
      className={`z-[100] fixed inset-0 flex items-center justify-center transition-opacity duration-300 animate-fade-in ${
        isFadingOut ? "opacity-0 bg-opacity-0" : "opacity-100 bg-opacity-50"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-2xl w-[85%] relative z-10 min-h-[80vh] max-h-[85vh] shadow-2xl transform transition-all animate-fade-in duration-700 ${
          isFadingOut
            ? "scale-95 opacity-0 translate-y-10"
            : "scale-100 opacity-100 translate-y-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div
          className="flex flex-row gap-10 space-y-3"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex-1/3 overflow-y-auto max-h-[80vh] p-2">
            <div>
              <TaskTitleInput title={task.title} taskId={task.id} />
            </div>
            <div className="px-2 flex flex-col gap-5 py-5">
              <div>
                <label className="block text-1xl mb-2 font-semibold">
                  Attachments
                </label>
                <div className="flex flex-row flex-wrap items-center">
                  {attachments.map((taskAttachment) => {
                    const fileName = taskAttachment.fileName;
                    const fileExtension = fileName.substring(
                      fileName.lastIndexOf(".")
                    );

                    const cleanFileName = fileName.replace(
                      /_[a-f0-9]{32,}(?=\.\w+$)/,
                      ""
                    );

                    const maxLength = 100;
                    const shortFileName =
                      cleanFileName.length > maxLength
                        ? `${cleanFileName.substring(
                            0,
                            maxLength
                          )}...${fileExtension}`
                        : cleanFileName;

                    return (
                      <span
                        key={taskAttachment.id}
                        className="flex items-center gap-2 bg-violet-100 mb-2 mr-2 px-3 py-2 rounded-4xl group shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <a
                          className="text-sm font-medium text-violet-500 transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${taskAttachment.fileUrl}${ACCESSFILE}`}
                          download={taskAttachment.fileName}
                          title={fileName}
                        >
                          {shortFileName}
                        </a>
                        <button
                          onClick={() =>
                            deleteAttachmentMutate(taskAttachment.id)
                          }
                          className="text-gray-400 group-hover:text-red-500 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
                          disabled={deleteStatus === "pending"}
                          aria-label={`Delete attachment ${taskAttachment.fileName}`}
                        >
                          <Xmark className="w-4 h-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="relative w-[25%]">
                  <span className="flex items-center text-[0.7rem] bg-transparent border border-dashed rounded-full px-3 py-2.5 cursor-pointer">
                    <Plus />
                    <p className="text-[0.7rem] text-center">
                      Upload attachments
                    </p>
                    {uploadStatus === "pending" && (
                      <span className="ml-2 text-xs">Uploading...</span>
                    )}
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadStatus === "pending"}
                  />
                </div>
              </div>

              <div>
                <TaskDescription
                  taskId={task.id}
                  initialDescription={task.description}
                />
              </div>

              <div className="mb-2">
                <TaskComment comments={task.comments} taskId={task.id} />
              </div>
            </div>
          </div>

          <div className="flex-1/7">
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
            <div className="mt-7 border border-gray-200 py-5 px-4 rounded-lg shadow-sm">
              <p className="text-1xl font-semibold mb-7">Detail</p>
              <div className="text-gray-600 grid grid-cols-2 text-sm gap-y-7">
                <span className="font-medium">Status</span>
                <span>{task.isCompleted ? "Done" : "In Progress"}</span>

                <span className="font-medium">Labels</span>
                <div>
                  <div className="flex flex-row flex-wrap gap-y-2 z-0">
                    {taskLabels.map((label) => (
                      <LabelBadge
                        key={label.id}
                        label={label}
                        taskId={task.id}
                      />
                    ))}
                    <LabelDropdown taskId={task.id} />
                  </div>
                </div>

                <span className="font-medium">Category</span>
                <div onPointerCancel={(e) => e.stopPropagation()}>
                  <CategoryDropdown
                    isLabel={false}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    categories={categories}
                    isLoadingCategories={isLoadingCategories}
                  />
                </div>

                <span className="font-medium">Assignee</span>
                <span>{task.assignee?.username}</span>

                <span className="font-medium">Creator</span>
                <span>{task.user?.username}</span>

                <span className="font-medium">Created at</span>
                <span>
                  {new Date(task.createdAt).toLocaleDateString("vi-VN")}
                </span>

                <span className="font-medium">Due date</span>
                <span>
                  {new Date(task.duedate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};