import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { TaskList } from "./TaskList";
import { updateTask, fetchLabels, fetchCategories } from "../../services/api";
import { useTasksWithCategories } from "../../services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Category, Label, Task } from "../../structures/model";
import { Listbox, Transition } from "@headlessui/react";
import { NavArrowUp, NavArrowDown } from "iconoir-react";
import { CategoryDropdown } from "../components/CategoryDropdown";

export const TaskListContent: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { tasks: allTasks, isLoading } = useTasksWithCategories();

  const { data: labels = [], isLoading: isLoadingLabels } = useQuery<
    Label[],
    Error
  >({
    queryKey: ["labels"],
    queryFn: fetchLabels,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[],
    Error
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    console.log("Selected Category ID:", category?.id);
  };

  const handleLabelChange = (labels: Label[]) => {
    setSelectedLabels(labels);
    console.log("Selected Label IDs:", labels.map((label) => label.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const isMovingToDone = over.id === "Completed";
    const isMovingToInProgress = over.id === "inProgress";

    if (!isMovingToDone && !isMovingToInProgress) return;

    queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return oldTasks;

      return oldTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: isMovingToDone } : task
      );
    });

    try {
      await updateTask(taskId, { isCompleted: isMovingToDone });
      
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
    } catch (error) {
      console.error("Error updating task status:", error);
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return oldTasks;

        return oldTasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: !isMovingToDone } : task
        );
      });
      toast.error("Failed to update task status");
    }
  };

  const filteredTasks = allTasks.filter((task) => {
    const matchesCategory = selectedCategory
      ? task.categoryId === selectedCategory.id
      : true;

    const matchesLabels =
      selectedLabels.length > 0
        ? selectedLabels.every((selected) =>
            task.labels?.some((label) => label.id === selected.id)
          )
        : true;

    return matchesCategory && matchesLabels;
  });

  if (isLoading) {
    return <p className="text-gray-500 text-center py-10">Loading tasks...</p>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="ml-7 mt-7 flex gap-6 text-sm">
        <div className="w-[15%]">
          <CategoryDropdown
            isLabel={true}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
          />
        </div>

        {/* Dropdown Label */}
        <div className="relative w-[15%]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Labels
          </label>
          {isLoadingLabels ? (
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <Listbox
              value={selectedLabels}
              onChange={handleLabelChange}
              multiple
            >
              {({ open }) => (
                <div className="relative">
                  <Listbox.Button className="relative w-full p-3 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-opacity-100 transform hover:scale-[1.02] transition-all duration-200">
                    <span className="block truncate text-gray-600">
                      {selectedLabels.length > 0
                        ? selectedLabels.map((label) => label.name).join(", ")
                        : "Select Labels"}
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border border-gray-200 py-1">
                      {labels.map((label) => (
                        <Listbox.Option
                          key={label.id}
                          value={label}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 px-4 flex items-center gap-2 ${
                              active
                                ? "bg-violet-100 text-violet-900"
                                : "text-gray-600"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <input
                                type="checkbox"
                                checked={selected}
                                readOnly
                                className="h-4 w-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
                              />
                              <span
                                className="!text-black inline-block px-4 py-1 font-bold rounded-full text-[0.7rem]"
                                style={{
                                  backgroundColor: label.color,
                                  color: "white",
                                }}
                              >
                                {label.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          )}
        </div>
      </div>

      <div className="w-full flex flex-row mt-7">
        <TaskList
          title="In Progress"
          id="inProgress"
          tasks={filteredTasks.filter((task) => !task.isCompleted)}
        />
        <TaskList
          title="Completed"
          id="Completed"
          tasks={filteredTasks.filter((task) => task.isCompleted)}
        />
      </div>
    </DndContext>
  );
};

export default TaskListContent;