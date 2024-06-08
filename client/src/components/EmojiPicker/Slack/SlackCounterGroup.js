import React from "react";
import { listOfNames } from "../helpers/listOfNames";
import { Hover } from "../helpers/Hover";
import { HoverStyle } from "../helpers/Hover/HoverStyle";

export const SlackCounterGroup = React.forwardRef(
  ({ onSelect, user, onRemove, emoji, count, names, active }, ref) => {
    const handleClick = () => {
      if (active) {
        onRemove && onRemove({ emoji, by: user });
      } else {
        onSelect && onSelect(emoji);
      }
    };

    return (
      <Hover
        ref={ref}
        hoverStyle={groupStyleActive}
        style={{ ...groupStyle, ...(active ? groupStyleActive : {}) }}
        onClick={handleClick}
      >
        <span style={{ ...emojiStyle, ...(!names ? emojiStyleNoNames : {}) }}>
          {emoji}
        </span>{" "}
        {count}
        {names ? (
          <HoverStyle hoverStyle={tooltipStyleHover} style={tooltipStyle}>
            {listOfNames(names)}
          </HoverStyle>
        ) : null}
      </Hover>
    );
  },
);

const groupStyle = {
  height: "19px",
  paddingTop: "1px",
  paddingLeft: "3px",
  paddingRight: "4px",
  border: "1px solid #E8E8E8",
  background: "#fff",
  fontSize: "11px",
  color: "#999",
  fontWeight: 500,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  cursor: "pointer",
  borderRadius: "5px",
};
const emojiStyle = {
  fontSize: "16px",
  marginTop: "1px",
  paddingRight: "3px",
};
const tooltipStyle = {
  maxWidth: "250px",
  wordBreak: "break-word",
  wordWrap: "normal",
  whiteSpace: "nowrap",
  font: `normal normal 11px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI",
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  color: "#fff",
  background: "rgba(0,0,0,0.8)",
  borderRadius: "3px",
  padding: "5px 8px",
  position: "absolute",
  bottom: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  marginBottom: "4px",
  opacity: "0",
  transition: "opacity 0.1s ease-in-out",
};
const tooltipStyleHover = {
  opacity: "1",
};
const groupStyleActive = {
  background: "rgb(190, 250, 255)",
  border: "1px solid #BBE1FF",
};
const emojiStyleNoNames = {
  paddingRight: "0",
};
