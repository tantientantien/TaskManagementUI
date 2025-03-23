// components/ClipTab.tsx
import React, { useRef, useEffect, useState } from "react";
import { ClipTabProps } from "../../structures/component";

const ClipTab: React.FC<ClipTabProps> = ({
  content = "",
  position,
  topOffset = -22,
  horizontalOffset = 0,
  bgColor = "bg-white",
  textSize = "text-[0.8rem]",
  fontWeight = "font-semibold",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Đo chiều rộng thực tế của nội dung
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.scrollWidth);
    }
  }, [content]);

  // Tính toán clipPath dựa trên chiều rộng nội dung
  const getClipPath = (pos: string, contentWidth: number) => {
    const baseWidth = Math.max(contentWidth + 56, 100); // 56px là padding左右, tối thiểu 100px
    const height = 48; // Chiều cao tab (bao gồm padding)

    switch (pos) {
      case "left":
        return `polygon(0% 0%, ${
          baseWidth * 0.65
        }px 0%, ${baseWidth}px ${height}px, 0% ${height}px)`;
      case "center":
        return `polygon(${baseWidth * 0.2}px ${height}px, ${
          baseWidth * 0.8
        }px ${height}px, ${baseWidth}px 0%, 0% 0%)`;
      case "right":
        return `polygon(${
          baseWidth * 0.4
        }px 0%, ${baseWidth}px 0%, ${baseWidth}px ${height}px, 0% ${
          height * 1.15
        }px)`;
      default:
        return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    }
  };

  // Xác định vị trí CSS
  const positionStyles = {
    left: { top: `${topOffset}px`, left: `${horizontalOffset}px` },
    center: { top: `${topOffset}px`, right: `${horizontalOffset}px` },
    right: { top: `${topOffset}px`, right: `${horizontalOffset}px` },
  };

  return (
    <div
      ref={ref}
      style={{
        clipPath: getClipPath(position, width),
        ...positionStyles[position],
      }}
      className={`absolute ${bgColor} ${textSize} ${fontWeight} px-7 py-4 rounded-t-xl whitespace-nowrap`}
    >
      {content}
    </div>
  );
};

export default ClipTab;
