import React from "react";
import { useHover } from "./useHover";

export const HoverStyle = ({ style = {}, hoverStyle, children, ...rest }) => {
  const isHovered = useHover();
  const calculatedStyle = { ...style, ...(isHovered ? hoverStyle : {}) };

  return (
    <div {...rest} style={calculatedStyle}>
      {children}
    </div>
  );
};
