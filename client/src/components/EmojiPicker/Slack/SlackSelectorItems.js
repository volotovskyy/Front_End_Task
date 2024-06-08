import React, { forwardRef, useMemo } from "react";
import emoji from "../helpers/emoji";
import { SlackSelectorSection } from "./SlackSelectorSection";

export const SlackSelectorItems = forwardRef(
  ({ scrollHeight, frequent, onSelect, removeEmojis }, ref) => {
    const wrapStyle = useMemo(
      () => ({
        maxHeight: scrollHeight,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "4px 4px 8px",
      }),
      [scrollHeight],
    );

    return (
      <div ref={ref} style={sectionsStyle}>
        <div style={wrapStyle} className="frame">
          {frequent && (
            <SlackSelectorSection
              key="mine"
              slug="mine"
              emojis={frequent}
              onSelect={onSelect}
            />
          )}
          {Object.keys(emoji).map((slug) => {
            const group = emoji[slug];
            return (
              <SlackSelectorSection
                key={slug}
                slug={slug}
                emojis={group.filter((e) => removeEmojis.indexOf(e) < 0)}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

const sectionsStyle = {
  padding: "4px 4px 0",
  background: "#fff",
};

export default SlackSelectorItems;
