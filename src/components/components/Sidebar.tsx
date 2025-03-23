import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import Logo from "./Logo";
import {
  LogOut,
  Settings,
  ChatBubbleQuestion,
  Attachment,
  Label,
  Calendar,
  TaskList,
} from "iconoir-react";
import { useAuth } from "../../stores/authStore";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { title: "Task List", icon: Calendar, path: "/tasks" },
    { title: "Label", icon: Label, path: "/labels" },
    { title: "Category", icon: TaskList, path: "/categories" },
    { title: "Attachment", icon: Attachment, path: "/attachments" },
  ];

  const bottomItems = [
    {
      title: "Sign Out",
      icon: LogOut,
      action: async () => {
        await logout();
        navigate("/login", { replace: true });
      },
    },
    { title: "Settings", icon: Settings, path: "/settings" },
    { title: "Support", icon: ChatBubbleQuestion, path: "/support" },
  ];

  const handleClick = (path?: string, action?: () => Promise<void> | void) => {
    if (path) navigate(path);
    if (action) action();
  };

  return (
    <aside className="w-[100px] flex-0.5/10 h-screen border-r-2 border-gray-200 flex flex-col bg-white">
      <Logo
        className="mt-2 mx-auto"
        sourceLogo="/assets/logo-no-brand-name.png"
        width="w-15"
      />
      <div className="mt-11 space-y-4 flex-1 flex flex-col items-center">
        {menuItems.map((item) => (
          <Button
            key={item.title}
            type="button"
            color="transparent"
            variant="primary_noborder"
            title={item.title}
            onClick={() => handleClick(item.path)}
            className={`!hover:bg-gray-100 !active:bg-gray-200 transition-all duration-300 !mb-4 !px-3 !py-2.5 ${
              location.pathname === item.path ? "!bg-violet-500" : "!bg-transparent"
            }`}
          >
            <item.icon
              width={22}
              color={`${location.pathname === item.path ? "white" : "black"}`}
            />
          </Button>
        ))}
      </div>
      <div className="mb-6">
        <div className="my-4 flex justify-center">
          <span className="h-0.5 w-12 bg-gray-200"></span>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          {bottomItems.map((item) => (
            <Button
              key={item.title}
              type="button"
              color="transparent"
              variant="primary_noborder"
              title={item.title}
              onClick={() => handleClick(item.path, item.action)}
              className={`!hover:bg-gray-100 !active:bg-gray-200 transition-all duration-300 !mb-4 !px-3 !py-2.5 ${
                location.pathname === item.path ? "!bg-violet-500" : "!bg-transparent"
              }`}
            >
              <item.icon
                width={22}
                color={`${location.pathname === item.path ? "white" : "black"}`}
              />
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;