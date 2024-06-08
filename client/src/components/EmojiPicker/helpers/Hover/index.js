import React, { useState } from "react";

import { HoverContext } from "./useHover";

export const Hover = React.forwardRef(
  ({ hoverStyle = {}, children, style, ...rest }, ref) => {
    const [isHovered, setHovered] = useState(false);

    return (
      <HoverContext.Provider value={isHovered}>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...rest}
          style={{ ...style, ...(isHovered ? hoverStyle : {}) }}
        >
          {children}
        </div>
      </HoverContext.Provider>
    );
  },
);
