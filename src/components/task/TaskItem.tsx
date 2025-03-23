import React from "react";
import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Task } from "../../structures/model";


interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    scale: isDragging ? 1.05 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      className="w-[49%] animate-fade-in"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        category={task.category?.name || "Uncategorized"}
        title={task.title}
        taskId={task.id}
        assignee={task.assignee}
        dueDate={new Date(task.duedate).toLocaleDateString("Vi-vn")}
        attachmentCount={task.attachmentCount}
        commentCount={task.commentCount}
        labels={task.labels ?? []}
      />
    </div>
  );
};
