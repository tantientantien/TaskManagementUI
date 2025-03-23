import React, { useState } from "react";
//import { createTask, addTaskLabels, uploadAttachment } from "../../services/api"; // Giả sử bạn có các API này
import { AddTaskModalStep2 } from "./AddTaskModalStep2";
import { AddTaskModalStep1 } from "./AddTaskModalStep1";


const AddTaskModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [taskId, setTaskId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleNext = (newTaskId: number) => {
    setTaskId(newTaskId);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div>
      {step === 1 ? (
        <AddTaskModalStep1 onClose={onClose} onNext={handleNext} />
      ) : (
        <AddTaskModalStep2
          onClose={onClose}
          onBack={handleBack}
          taskId={taskId!}
        />
      )}
    </div>
  );
};

export default AddTaskModal;