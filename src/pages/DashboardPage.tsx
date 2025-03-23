import React from "react";
import Sidebar from "../components/components/Sidebar";
import TaskListContent from "../components/task/TaskListContent";
import SimpleContent from "../components/components/SimpleContent";
import { useLocation } from "react-router-dom";
import { User } from "iconoir-react";
import Button from "../components/components/Button";
import { useAuth } from "../stores/authStore"; // Import Zustand store
import { toast } from "react-toastify";

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const pathToTitle: { [key: string]: string } = {
    "/tasks": "Task Management",
    "/labels": "Label",
    "/categories": "Category",
    "/attachments": "Attachment",
    "/settings": "Settings",
    "/support": "Support",
  };

  const renderContent = () => {
    if (location.pathname === "/tasks" || location.pathname === "/") {
      return <TaskListContent />;
    }
    return <SimpleContent title={pathToTitle[location.pathname] || ""} />;
  };

  const handleAccountClick = () => {
    if (user) {
      toast(`User Info: \nEmail: ${user.email} \nRole: ${user.role}`)
    } else {
      toast("No user information available");
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <section className="flex-8/10 flex flex-col flex-grow h-screen overflow-auto">
        <header className="h-[11vh] border-b-2 border-gray-200 flex justify-between items-center px-4 md:px-7 bg-white">
          <p className="font-bold text-xl text-gray-800">
            {pathToTitle[location.pathname]}
          </p>
          <Button variant="primary" onClick={handleAccountClick}>
            <User />
            <span>Account</span>
          </Button>
        </header>

        <main className="h-[88vh]">{renderContent()}</main>
      </section>
    </div>
  );
};

export default DashboardPage;
