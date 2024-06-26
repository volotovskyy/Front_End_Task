import React, { forwardRef } from "react";
import { emojiColors, sectionSlugToName } from "../helpers/slack";
import { SlackSelectorSectionEmoji } from "./SlackSelectorSectionEmoji";

export const SlackSelectorSection = forwardRef(
  ({ slug = "", emojis, onSelect }, ref) => {
    return (
      <div ref={ref} id={slug}>
        <div style={titleStyle}>{sectionSlugToName(slug)}</div>
        <div style={emojisStyle}>
          {emojis.map((emoji, i) => (
            <SlackSelectorSectionEmoji
              key={i}
              hoverColor={emojiColors[i % emojiColors.length]}
              emoji={emoji}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    );
  },
);

const emojisStyle = {
  display: "flex",
  flexWrap: "wrap",
};

const titleStyle = {
  fontWeight: 600,
  WebkitFontSmoothing: "antialiased",
  fontSize: "16px",
  lineHeight: "1.5rem",
  margin: "0 6px",
};
