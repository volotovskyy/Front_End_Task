import React, { forwardRef } from "react";
import { SlackSelectorSection } from "./SlackSelectorSection";

export const SlackSelectorFooter = forwardRef(({ onSelect }, ref) => {
  return (
    <div ref={ref} style={footerStyle}>
      <div style={leftStyle}>Handy Reactions</div>
      <div style={rightStyle}>
        <SlackSelectorSection
          onSelect={onSelect}
          emojis={["😀", "👍", "✅", "❤️", "👀"]}
        />
      </div>
    </div>
  );
});

const footerStyle = {
  padding: "5px 11px",
  borderTop: "1px solid rgba(0,0,0,.15)",
  display: "flex",
  justifyContent: "space-between",
};
const leftStyle = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "4px 2px",
  fontWeight: 600,
  WebkitFontSmoothing: "antialiased",
};
const rightStyle = {
  paddingRight: "6px",
};
