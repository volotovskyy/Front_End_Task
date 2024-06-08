import React, { forwardRef } from "react";
import { SlackCSS } from "./SlackCSS";
import { SlackSelectorFooter } from "./SlackSelectorFooter";
import { SlackSelectorHeader } from "./SlackSelectorHeader";
import { SlackSelectorItems } from "./SlackSelectorItems";

export const SlackSelector = forwardRef(
  (
    {
      scrollHeight = defaultProps.scrollHeight,
      frequent = defaultProps.frequent,
      removeEmojis = defaultProps.removeEmojis,
      onSelect = defaultProps.onSelect,
      isOutgoingMessage,
    },
    ref,
  ) => {
    const cn = isOutgoingMessage
      ? "slack-emoji-selector--outgoing"
      : "slack-emoji-selector--incoming";
    return (
      <div ref={ref} className={`slack-emoji-selector ${cn}`}>
        <SlackCSS />
        <SlackSelectorHeader />
        <SlackSelectorItems
          scrollHeight={scrollHeight}
          removeEmojis={removeEmojis}
          frequent={frequent}
          onSelect={onSelect}
        />
        <SlackSelectorFooter onSelect={onSelect} />
      </div>
    );
  },
);

export const defaultProps = {
  scrollHeight: "270px",
  removeEmojis: [
    "🙂",
    "🙃",
    "☺️",
    "🤑",
    "🤓",
    "🤗",
    "🙄",
    "🤔",
    "🙁",
    "☹️",
    "🤐",
    "🤒",
    "🤕",
    "🤖",
  ],
  frequent: [
    "👍",
    "🐉",
    "🙌",
    "🗿",
    "😊",
    "🐬",
    "😹",
    "👻",
    "🚀",
    "🚁",
    "🏇",
    "🇨🇦",
  ],
  onSelect: (id) => {
    console.log(id);
  },
};
