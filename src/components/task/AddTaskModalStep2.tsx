import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { uploadAttachment } from "../../services/api";
import Swal from "sweetalert2";
import { Xmark, Plus } from "iconoir-react";
import Button from "../components/Button";
import LabelDropdown from "../components/LabelDropdown";
export const AddTaskModalStep2: React.FC<{
    onClose: () => void;
    onBack: () => void;
    taskId: number;
  }> = ({ onClose, taskId }) => {
    const [attachments, setAttachments] = useState<
      Array<{ id: number; fileName: string; fileUrl: string }>
    >([]);
    const [selectedLabels] = useState<
      Array<{ id: number; name: string; color: string }>
    >([]);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const queryClient = useQueryClient();
  
    const uploadAttachmentMutation = useMutation({
      mutationFn: ({ taskId, file }: { taskId: number; file: File }) =>
        uploadAttachment(taskId, file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        Swal.fire({
          title: "Success!",
          text: "Attachment uploaded successfully.",
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
          text: error.message || "Failed to upload attachment",
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
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const newAttachment = {
          id: Date.now(),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
        };
        setAttachments((prev) => [...prev, newAttachment]);
        uploadAttachmentMutation.mutate({ taskId, file });
        event.target.value = "";
      }
    };
  
    const handleSubmit = () => {
      if (selectedLabels.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
      handleClose();
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
          className={`bg-white p-6 rounded-2xl w-[30%] max-h-[85vh] relative z-10 shadow-2xl transform transition-all animate-fade-in duration-700 ${
            isFadingOut
              ? "scale-95 opacity-0 translate-y-10"
              : "scale-100 opacity-100 translate-y-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Details
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Xmark className="w-6 h-6" />
            </button>
          </div>
  
          <div className="space-y-5">
            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Attachments
              </label>
              <div className="flex flex-row flex-wrap items-center mb-2">
                {attachments.map((attachment) => (
                  <span
                    key={attachment.id}
                    className="flex items-center gap-2 bg-violet-100 mb-2 mr-2 px-3 py-2 rounded-4xl group shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <a
                      className="text-sm font-medium text-violet-500 transition-all duration-200"
                      href={attachment.fileUrl}
                      download={attachment.fileName}
                    >
                      {attachment.fileName.length > 20
                        ? `${attachment.fileName.substring(0, 20)}...`
                        : attachment.fileName}
                    </a>
                    <button
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((a) => a.id !== attachment.id)
                        )
                      }
                      className="text-gray-400 group-hover:text-red-500 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
                    >
                      <Xmark className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <span className="w-[50%] flex items-center text-[0.7rem] bg-transparent border border-dashed rounded-full px-3 py-2.5 cursor-pointer hover:bg-violet-50 transition-colors duration-200">
                  <Plus className="w-4 h-4 mr-2 text-gray-600" />
                  <p className="text-[0.7rem] text-center text-gray-600">
                    Upload attachments
                  </p>
                </span>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
  
            {/* Labels */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Labels
              </label>
              <LabelDropdown taskId={taskId}/>
            </div>
          </div>
  
          {/* Nút Back và Submit */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="px-10 py-2 bg-violet-500 text-white font-semibold rounded-lg shadow-md hover:bg-violet-600 transform hover:scale-105 transition-all duration-200 disabled:bg-violet-300"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  };