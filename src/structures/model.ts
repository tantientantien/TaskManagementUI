export interface User {
  id: number;
  username?: string;
  email?: string;
  role?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  userId?: number;
  categoryId: number;
  assignee: {
    id: number;
    username: string;
    email: string;
  };
  category?: Category;
  labels: Label[];
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  duedate: string;
}



// export interface TaskLabel {
//   taskId: number,
//   labelId: number,
//   name: string,
//   color: string
// }

export interface TaskDetail {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  assignee?: {
    id: number;
    username: string;
    email: string;
  };
  categoryId: number;
  category?: Category;
  labels: Label[];
  comments: [
    {
      id: number
      user: User;
      content: string;
      createdAt: string;
    }
  ];
  attachments: [
    {
      id: number;
      fileName: string;
      fileUrl: string;
      taskId: number;
      uploadedAt: string;
    }
  ];
  createdAt: string;
  duedate: string;
}


export interface AddNewTask {
  title: string;
  description: string;
  isCompleted: boolean;
  assigneeId: number;
  duedate: string;
  categoryId: number;
}