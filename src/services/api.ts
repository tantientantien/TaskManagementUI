import axios from "axios";
import { AddNewTask, Category, Task, TaskDetail, User } from "../structures/model";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../structures/model";
import { UpdateTaskPayload } from "../structures/others";

const TASK_BASE_URL = "https://localhost:7186/api/tasks";
const CATEGORY_BASE_URL = "https://localhost:7186/api/categories";
const TASK_LABELS_BASE_URL = "https://localhost:7186/api/task-labels";
const LABEL_BASE_URL = "https://localhost:7186/api/labels";


export const fetchCategoryDetail = async (
  categoryId: number
): Promise<Category> => {
  const response = await axios.get(`${CATEGORY_BASE_URL}/${categoryId}`, {
    withCredentials: true,
  });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch category details");
};

export const fetchTaskLabels = async (taskId: number): Promise<Label[]> => {
  const response = await axios.get(`${TASK_LABELS_BASE_URL}/${taskId}`, {
    withCredentials: true,
  });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch task labels");
};


// export const fetchTasks = async (
//   category?: number,
//   labelIds?: number[]
// ): Promise<Task[]> => {
//   const params = new URLSearchParams();
//   if (category) params.append("category", category.toString());
//   if (labelIds && labelIds.length > 0) {
//     labelIds.forEach((id) => params.append("labelIds", id.toString()));
//   }

//   console.log(params.toString());

//   const response = await axios.get(`${TASK_BASE_URL}?${params.toString()}`, {
//     withCredentials: true,
//   });

//   if (response.data.status === "success") {
//     return response.data.data;
//   }
//   throw new Error("Failed to fetch tasks");
// };

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${TASK_BASE_URL}`, {
    withCredentials: true,
    timeout: 10000,
  });

  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch tasks");
};


// export const useTasksWithCategories = (category?: number, labelIds?: number[]) => {
//   const { data: tasks = [], isLoading: isTasksLoading, isError: isTasksError, error: tasksError } = useQuery({
//     queryKey: ["tasks", category, labelIds],
//     queryFn: () => fetchTasks(category, labelIds),
//   });


//   const hasTasks = tasks.length > 0;
//   const categoryIds = hasTasks ? [...new Set(tasks.map((task) => task.categoryId))] : [];
//   const taskIds = hasTasks ? tasks.map((task) => task.id) : [];

//   const categoryQueries = useQuery({
//     queryKey: ["categories", categoryIds],
//     queryFn: async () => {
//       const categories = await Promise.all(
//         categoryIds.map((id) => fetchCategoryDetail(id))
//       );
//       return Object.fromEntries(categories.map((cat) => [cat.id, cat]));
//     },
//     enabled: hasTasks && categoryIds.length > 0,
//   });

//   const labelQueries = useQuery({
//     queryKey: ["taskLabels", taskIds],
//     queryFn: async () => {
//       const labelsData = await Promise.all(
//         taskIds.map((taskId) => fetchTaskLabels(taskId))
//       );
//       return Object.fromEntries(
//         taskIds.map((taskId, i) => [taskId, labelsData[i]])
//       );
//     },
//     enabled: hasTasks,
//   });

//   const isCategoriesLoading = categoryQueries.isLoading;
//   const isLabelsLoading = labelQueries.isLoading;

//   const tasksWithDetails = hasTasks
//     ? tasks.map((task) => ({
//         ...task,
//         category: categoryQueries.data?.[task.categoryId] ?? undefined,
//         labels: labelQueries.data?.[task.id] ?? [],
//       }))
//     : [];

//   return {
//     tasks: tasksWithDetails,
//     isLoading: isTasksLoading || (hasTasks && (isCategoriesLoading || isLabelsLoading)),
//     isError: false,
//     error: null,
//   };
// };



export const useTasksWithCategories = () => {
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const categoryIds = [...new Set(tasks.map((task) => task.categoryId))];

  const categoryQueries = useQuery({
    queryKey: ["categories", categoryIds],
    queryFn: async () => {
      const categories = await Promise.all(
        categoryIds.map((id) => fetchCategoryDetail(id))
      );
      return Object.fromEntries(categories.map((cat) => [cat.id, cat]));
    },
    enabled: categoryIds.length > 0,
  });

  const labelQueries = useQuery({
    queryKey: ["taskLabels", tasks.map((task) => task.id)],
    queryFn: async () => {
      const labelsData = await Promise.all(
        tasks.map((task) => fetchTaskLabels(task.id))
      );
      return Object.fromEntries(
        tasks.map((task, i) => [task.id, labelsData[i]])
      );
    },
    enabled: tasks.length > 0,
  });

  const isCategoriesLoading = categoryQueries.isLoading;
  const isLabelsLoading = labelQueries.isLoading;

  const tasksWithDetails = tasks.map((task) => ({
    ...task,
    category: categoryQueries.data?.[task.categoryId] ?? undefined,
    labels: labelQueries.data?.[task.id] ?? [],
  }));

  return {
    tasks: tasksWithDetails,
    isLoading: isTasksLoading || isCategoriesLoading || isLabelsLoading,
    isError: false,
    error: null,
  };
};

export const fetchTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const response = await axios.get(`${TASK_BASE_URL}/${taskId}`, {
    withCredentials: true,
  });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch task details");
};

export const fetchLabels = async (): Promise<Label[]> => {
  const response = await axios.get(LABEL_BASE_URL, { withCredentials: true });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch tasks");
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(CATEGORY_BASE_URL, { withCredentials: true });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch tasks");
};

export const updateTask = async (
  taskId: number,
  payload: UpdateTaskPayload
): Promise<void> => {
  const response = await axios.patch(`${TASK_BASE_URL}/${taskId}`, payload, {
    withCredentials: true,
  });
  if (response.status !== 200) {
    throw new Error("Failed to update task");
  }
};

export const uploadAttachment = async (
  taskId: number,
  file: File
): Promise<{
  id: number;
  fileName: string;
  fileUrl: string;
  taskId: number;
  uploadedAt: string;
}> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `https://localhost:7186/api/attachments/upload/${taskId}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.status === "success") {
    return response.data.data;
  }

  throw new Error("Failed to upload attachment");
};

export const createLabel = async (
  name: string,
  color: string
): Promise<Label> => {
  const response = await axios.post(
    "https://localhost:7186/api/labels",
    {
      name,
      color,
    },
    { withCredentials: true }
  );

  if (response.data.status !== "success") {
    throw new Error("Failed to create label");
  }
  return response.data.data;
};

export const deleteAttachment = async (attachmentId: number): Promise<void> => {
  await axios.delete(`https://localhost:7186/api/attachments/${attachmentId}`, {
    withCredentials: true,
  });
};

export const assignLabelToTask = async (
  taskId: number,
  labelId: number
): Promise<void> => {
  const response = await axios.post(
    "https://localhost:7186/api/task-labels",
    {
      taskId,
      labelId,
    },
    { withCredentials: true }
  );

  if (response.data.status !== "success") {
    throw new Error("Failed to assign label to task");
  }
};

export const deleteTaskLabel = async (
  taskId: number,
  labelId: number
): Promise<void> => {
  const response = await axios.delete(
    `https://localhost:7186/api/task-labels/${taskId}/${labelId}`,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to delete task label");
  }
};

export const deleteLabel = async (labelId: number): Promise<void> => {
  const response = await axios.delete(
    `https://localhost:7186/api/labels/${labelId}`,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to delete task label");
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await axios.delete(
    `https://localhost:7186/api/tasks/${taskId}`,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to delete task label");
  }
};

export const addTaskComment = async (
  taskId: number,
  content: string
): Promise<void> => {
  const response = await axios.post(
    `https://localhost:7186/api/comments/${taskId}`,
    { content },
    {
      withCredentials: true,
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  if (response.data?.status && response.data.status !== "success") {
    throw new Error("Failed to add comment to task");
  }
};


export const deleteComment = async (commentId: number): Promise<void> => {
  const response = await axios.delete(
    `https://localhost:7186/api/comments/${commentId}`,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to delete comment");
  }
};



export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("https://localhost:7186/api/users", { withCredentials: true });
  if (response.data.status === "success") {
    return response.data.data;
  }
  throw new Error("Failed to fetch tasks");
};


export const addTask = async (
  payload: AddNewTask
): Promise<{ taskId: number }> => {
  const response = await axios.post(`${TASK_BASE_URL}`, payload, {
    withCredentials: true,
  });
  if (response.data?.status && response.data.status !== "success") {
    throw new Error("Failed to add task");
  }
  return { taskId: response.data.taskId }
};