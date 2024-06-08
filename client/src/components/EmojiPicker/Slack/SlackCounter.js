import React from "react";
import { Hover } from "../helpers/Hover";
import { HoverStyle } from "../helpers/Hover/HoverStyle";
import { groupBy } from "../helpers/groupBy";
import { SlackCounterGroup } from "./SlackCounterGroup";
import { SlackCSS } from "./SlackCSS";

export const SlackCounter = React.forwardRef(
  ({ counters = [], user, onSelect, onAdd, onRemove }, ref) => {
    const groups = groupBy(counters, "emoji");
    return (
      <>
        <SlackCSS />
        <Hover ref={ref} style={counterStyle}>
          {Object.keys(groups).map((emoji) => {
            const names = groups[emoji].map(({ by }) => by);

            return (
              <div style={groupStyle} key={emoji}>
                <SlackCounterGroup
                  emoji={emoji}
                  count={names.length}
                  names={names}
                  user={user}
                  active={names.includes(user)}
                  onSelect={onSelect}
                  onRemove={onRemove}
                />
              </div>
            );
          })}
          <HoverStyle
            hoverStyle={addStyleHover}
            style={addStyle}
            onClick={onAdd}
          >
            <SlackCounterGroup emoji={"💬"} />
          </HoverStyle>
        </Hover>
      </>
    );
  },
);

const counterStyle = {
  display: "flex",
};
const addStyle = {
  cursor: "pointer",
  fontFamily: "Slack",
  paddingLeft: "8px",
  opacity: "0",
  transition: "opacity 0.1s ease-in-out",
};
const groupStyle = {
  marginRight: "4px",
};
const addStyleHover = {
  opacity: "1",
};
