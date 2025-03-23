import React from "react";

interface SimpleContentProps {
  title: string;
}

const SimpleContent: React.FC<SimpleContentProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Hello World - {title}</h1>
    </div>
  );
};

export default SimpleContent;
