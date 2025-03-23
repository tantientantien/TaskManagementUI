import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PlusCircle } from "iconoir-react";
import Button from "../components/Button";
import { TaskItem } from "./TaskItem";
import { Task } from "../../structures/model";
import AddTaskModal from "./AddTaskModal";
import { useAuth } from "../../stores/authStore";

interface TaskListProps {
  title: string;
  tasks: Task[];
  id: string;
}

export const TaskList: React.FC<TaskListProps> = ({ title, tasks, id }) => {
  const { setNodeRef } = useDroppable({ id });
  const isInProgress = id === "inProgress";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const renderEmptyState = () => (
    <div className="text-center w-full p-20 rounded-xl border-2 border-gray-500 border-dashed">
      <p className="text-gray-500 text-sm">
        {isInProgress ? (
          <span>
            Drag and drop tasks to be{" "}
            <p className="text-violet-500 font-bold inline-block">redone</p>{" "}
            here or{" "}
            <p className="text-violet-500 font-bold inline-block">create</p> a
            new task
          </span>
        ) : (
          <span>
            Drag and drop{" "}
            <p className="text-violet-500 font-bold inline-block">completed</p>{" "}
            tasks here
          </span>
        )}
      </p>
    </div>
  );

  const renderAddButton = () => (
    <Button variant="primary" onClick={() => setIsModalOpen(true)} disabled = {user?.role?.toString() === "Admin" ? false : true}>
      <PlusCircle />
      <span>Create</span>
    </Button>
  );

  const renderPlaceholderButton = () => (
    <Button
      variant="primary"
      disabled
      className="!bg-transparent pointer-events-none"
    >
      <span className="text-transparent select-none">placeholder</span>
    </Button>
  );

  return (
    <div className="mx-7 flex-1 overflow-ellipsis">
      <div
        ref={setNodeRef}
        className="bg-gray-200 rounded-xl px-4 py-7 flex flex-col min-h-[200px]"
      >
        <div className="flex flex-row justify-between items-center text-[0.8rem] font-bold text-gray-500">
          <p>
            {title}
            {""}
            <span className="bg-gray-300 ml-1 px-1 py-0.5 rounded text-xs">
              {tasks.length <= 9 && 0 < tasks.length
                ? "0" + tasks.length
                : tasks.length}
            </span>
          </p>
          {isInProgress ? renderAddButton() : renderPlaceholderButton()}
        </div>
        <div className="mt-7 flex flex-row flex-wrap justify-between gap-y-3">
          {tasks.length === 0
            ? renderEmptyState()
            : tasks.map((task) => <TaskItem key={task.id} task={task} />)}
        </div>
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
