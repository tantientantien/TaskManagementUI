import React from "react";
import { Clock, Trash, ChatLines, Attachment } from "iconoir-react";
import { TaskCardProps } from "../../structures/component";
import { fetchTaskDetail } from "../../services/api";
import { useState } from "react";
import { TaskDetail } from "../../structures/model";
import { TaskDetailModal } from "./TaskDetailModal";
import { useAuth } from "../../stores/authStore";
import LabelBadge from "../components/LabelBadge";
import LabelDropdown from "../components/LabelDropdown";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../services/api";
import { Task } from "../../structures/model";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

export const TaskCard: React.FC<TaskCardProps> = ({
  category,
  title,
  dueDate,
  commentCount,
  attachmentCount,
  taskId,
  assignee,
  labels = [],
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskDetail | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) =>
        oldTasks.filter((task) => task.id !== taskId)
      );
      //queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to delete task:", error);
      toast.error(error.message || "Failed to delete task");
    },
  });

  const handleDeleteTask = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete the task "${title}"?`,
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
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  const taskFeatures = [
    {
      icon: Clock,
      content: <p className="text-black text-xs font-light">{dueDate}</p>,
    },
    {
      icon: Trash,
      event: handleDeleteTask,
      content: <span className="text-black text-xs font-light">Delete</span>,
    },
    {
      icon: ChatLines,
      content: (
        <span className="text-black text-xs font-light">{commentCount}</span>
      ),
    },
    {
      icon: Attachment,
      content: (
        <span className="text-black text-xs font-light">{attachmentCount}</span>
      ),
    },
  ];




  const handleTitleClick = async () => {
    try {
      const taskDetails = await fetchTaskDetail(taskId);
      setCurrentTask(taskDetails);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  return (
    <>
      <div className="w-auto bg-white px-5 py-3 font-bold rounded-xl">
        <span className="text-[0.8rem] font-semibold bg-gray-200 px-4 py-1 rounded-md inline-block">
          {category}
        </span>
        <button
          className="text-left block mt-2 transition duration-300 ease-in-out hover:text-violet-500"
          onPointerDown={(e) => e.preventDefault()}
          onClick={handleTitleClick}
        >
          {title}
        </button>
        <div onPointerDown={(e) => e.preventDefault()} className="mt-2 flex flex-wrap gap-5">
          {taskFeatures.map(({ icon: Icon, content, event }, index) => (
            <button
              key={index}
              onClick={event}
              className="flex items-center gap-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Icon color="black" width={15} />
              {content}
            </button>
          ))}
        </div>
        <div className="font-light text-gray-600 mt-2 flex flex-wrap gap-1 z-[-100]" onPointerDown={(e) => e.preventDefault()}>
          {labels.map((label) => (
            <LabelBadge label={label} taskId={taskId}/>
          ))}
          <LabelDropdown taskId={taskId}/>
        </div>
        <div className="mt-2 flex items-end justify-end">
            {assignee.email === user?.email
              ? <p className="bg-violet-100 text-violet-500 text-xs py-1 px-2 font-bold rounded">Assignee: You</p>
              : <p className="bg-gray-100 text-gray-500 font-bold text-xs py-1 px-2 rounded">Assignee: {assignee.email.split("@")[0]}</p>}
        </div>
        
      </div>
      {showDetailModal && currentTask && (
        <TaskDetailModal
          task={currentTask}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
