import React, { useMemo, forwardRef } from "react";
import { Hover } from "../helpers/Hover";

export const SlackSelectorSectionEmoji = forwardRef(
  ({ hoverColor, onSelect, emoji }, ref) => {
    const wrapStyleHover = useMemo(() => {
      return { background: hoverColor };
    }, [hoverColor]);

    const handleClick = () => {
      onSelect(emoji);
    };

    return (
      <Hover
        ref={ref}
        hoverStyle={wrapStyleHover}
        style={wrapStyle}
        onClick={handleClick}
      >
        <div style={emojiStyle}>{emoji}</div>
      </Hover>
    );
  },
);

const wrapStyle = {
  width: "36px",
  height: "32px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 1px 1px 0",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background .15s ease-out 50ms",
};

const emojiStyle = {
  fontSize: "22px",
  width: "22px",
  height: "22px",
  lineHeight: "26px",
};
