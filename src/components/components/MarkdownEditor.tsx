import React, { useState, useRef, useEffect } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  textContent?: string;
  onChange: ({ text, html }: { text: string; html: string }) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  textContent = "",
  onChange,
  onKeyDown,
}) => {
  const [content, setContent] = useState<string>(textContent);
  const editorRef = useRef(null);


  useEffect(() => {
    setContent(textContent);
  }, [textContent]);

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
    onChange({ text, html: mdParser.render(text) });
  };

  const renderHTML = (text: string) => mdParser.render(text || "Enter description here...");

  return (
    <div
      className="markdown-editor-container relative border border-gray-200 rounded-lg shadow-sm"
      onKeyDown={(e) => {
        e.stopPropagation();
        if (onKeyDown) {
          onKeyDown(e);
        }
      }}
    >
      <MdEditor
        ref={editorRef}
        value={content}
        style={{ height: "200px", border: "none" }}
        renderHTML={renderHTML}
        onChange={handleEditorChange}
        view={{ menu: true, md: true, html: false }}
        placeholder="Enter description here..."
        className="rounded-lg"
      />
      <style>{`
        .markdown-editor-container :global(.rc-md-editor) {
          border: none !important;
          background-color: #fff;
        }
        .markdown-editor-container :global(.rc-md-editor .editor-container) {
          border-radius: 0.5rem;
        }
        .markdown-editor-container :global(.rc-md-editor .rc-md-navigation) {
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .markdown-editor-container :global(.rc-md-editor .rc-md-navigation .button) {
          color: #6b7280;
        }
        .markdown-editor-container :global(.rc-md-editor .rc-md-navigation .button:hover) {
          background-color: #e5e7eb;
        }
        .markdown-editor-container :global(.rc-md-editor .editor-container .sec-md textarea) {
          font-size: 0.875rem;
          color: #4b5563;
          padding: 0.75rem;
        }
        .markdown-editor-container :global(.rc-md-editor .editor-container .sec-md textarea:focus) {
          outline: none;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2); /* violet-600 with opacity */
        }
      `}</style>
    </div>
  );
};

export default React.memo(MarkdownEditor);