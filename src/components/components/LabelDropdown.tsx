import React, { useState } from "react";
import { Plus, Xmark } from "iconoir-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLabels,
  assignLabelToTask,
  createLabel,
  deleteLabel,
} from "../../services/api";
import { toast } from "react-toastify";
import { useFloating, autoPlacement, shift, offset } from "@floating-ui/react";

interface Label {
  id: number;
  name: string;
  color: string;
}

interface LabelDropdownProps {
  taskId: number;
}

const LabelDropdown: React.FC<LabelDropdownProps> = ({ taskId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");

  const queryClient = useQueryClient();

  const {
    data: labels = [],
    isLoading,
    error,
  } = useQuery<Label[], Error>({
    queryKey: ["labels"],
    queryFn: fetchLabels,
    staleTime: 5 * 60 * 1000,
  });

  const assignLabelMutation = useMutation({
    mutationFn: (labelId: number) => assignLabelToTask(taskId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Label assigned successfully!");
      setShowDropdown(false);
    },
    onError: (error: Error) => {
      console.log(error)
      toast.error(`You don't have permission for updating this task`);
    },
  });

  const createLabelMutation = useMutation({
    mutationFn: (label: { name: string; color: string }) =>
      createLabel(label.name, label.color),
    onSuccess: (newLabel) => {
      queryClient.setQueryData<Label[]>(["labels"], (oldLabels = []) => [
        ...oldLabels,
        newLabel,
      ]);
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      toast.success("Label created successfully!");
      setShowCreateForm(false);
      setNewLabelName("");
      setNewLabelColor("#000000");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create label");
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: (labelId: number) => deleteLabel(labelId),
    onSuccess: (_, labelId) => {
      queryClient.setQueryData<Label[]>(["labels"], (oldLabels = []) =>
        oldLabels.filter((label) => label.id !== labelId)
      );
      //queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
      toast.success("Label deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to delete label:", error);
      toast.error(error.message || "Failed to delete label");
    },
  });

  const handleSelectLabel = (labelId: number) => {
    assignLabelMutation.mutate(labelId);
  };

  const handleDeleteLabel = (labelId: number) => {
    deleteLabelMutation.mutate(labelId);
  };

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(8), autoPlacement(), shift()],
  });

  return (
    <div className="relative">
      <button
        type="button"
        title="Add label"
        className="flex items-center gap-1 text-[0.7rem] bg-transparent border border-dashed rounded-full px-5 py-1 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        ref={refs.setReference}
        onClick={() => setShowDropdown((prev) => !prev)}
        disabled={
          isLoading ||
          assignLabelMutation.isPending ||
          createLabelMutation.isPending
        }
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <Plus className="w-4 h-4" />
        <span>Add Label</span>
        {isLoading && <span className="ml-2 text-xs">Loading...</span>}
      </button>

      {showDropdown && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="w-48 bg-white border border-gray-200 rounded shadow-md z-10"
        >
          <div className="animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-semibold">Select Label</span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDropdown(false)}
                aria-label="Close dropdown"
              >
                <Xmark className="w-4 h-4" />
              </button>
            </div>

            {showCreateForm ? (
              <div className="px-4 py-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full p-2 mb-2 text-sm border border-gray-200 rounded"
                  autoFocus
                />
                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="w-full mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 px-2 py-1 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-100"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-2 py-1 text-sm font-bold text-violet-500 border border-violet-500 rounded hover:bg-violet-100"
                    onClick={() =>
                      createLabelMutation.mutate({
                        name: newLabelName,
                        color: newLabelColor,
                      })
                    }
                    disabled={createLabelMutation.isPending}
                  >
                    {createLabelMutation.isPending ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="max-h-40 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : error ? (
                    <div className="px-4 py-2 text-sm text-red-500">
                      Failed to load labels
                    </div>
                  ) : labels.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No labels available
                    </div>
                  ) : (
                    labels.map((label) => (
                      <div
                        key={label.id}
                        className={`group flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                          assignLabelMutation.isPending ||
                          deleteLabelMutation.isPending
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSelectLabel(label.id)
                        }
                      >
                        <div
                          className="rounded-4xl flex items-center py-1 px-4 text-xs font-bold text-black text-center"
                          style={{ backgroundColor: label.color }}
                          onClick={() => handleSelectLabel(label.id)}
                        >
                          <span>{label.name}</span>
                          {/* <div
                            className="w-5 h-5 rounded-full ml-auto"
                            style={{ backgroundColor: label.color }}
                          /> */}
                        </div>
                        <button
                          type="button"
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 bg-white rounded-full p-1 shadow-sm hover:shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLabel(label.id);
                          }}
                          disabled={deleteLabelMutation.isPending}
                          aria-label={`Delete label ${label.name}`}
                        >
                          {deleteLabelMutation.isPending &&
                          deleteLabelMutation.variables === label.id ? (
                            <span className="w-3 h-3 border-2 border-t-transparent border-red-500 rounded-full animate-pulse" />
                          ) : (
                            <Xmark className="w-3 h-3"/>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-200">
                  <button
                    type="button"
                    className="w-full flex items-center px-4 py-2 text-sm font-bold text-violet-500 hover:bg-gray-100"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelDropdown;