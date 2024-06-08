import React, { forwardRef, useState } from "react";
import { SlackSelectorHeaderTab } from "./SlackSelectorHeaderTab";

export const SlackSelectorHeader = forwardRef(({ tabs = [] }, ref) => {
  const [activeString, setActiveString] = useState("");

  const handleClick = (id) => {
    document?.getElementById(id)?.scrollIntoView(false);
    setActiveString(id);
  };

  return (
    <div ref={ref} style={headerStyle}>
      {tabs.map((tab) => (
        <SlackSelectorHeaderTab
          icon={tab.icon}
          id={tab.id}
          key={tab.id}
          active={tab.id === activeString}
          onClick={handleClick}
        />
      ))}
    </div>
  );
});

const headerStyle = {
  padding: "4px 0 0 7px",
  borderBottom: "1px solid rgba(0,0,0,.15)",
  display: "flex",
  filter: "grayscale(1)",
};

SlackSelectorHeader.defaultProps = {
  tabs: [
    {
      // icon: "",
      icon: "🕓",
      id: "mine",
    },
    {
      // icon: "",
      icon: "😃",
      id: "people",
    },
    {
      // icon: "",
      icon: "🌱",
      id: "nature",
    },
    {
      // icon: "",
      icon: "🍔",
      id: "food-and-drink",
    },
    {
      // icon: "",
      icon: "⚽",
      id: "activity",
    },
    {
      // icon: "",
      icon: "✈️",
      id: "travel-and-places",
    },
    {
      // icon: "",
      icon: "💡",
      id: "objects",
    },
    {
      // icon: "",
      icon: "☮️",
      id: "symbols",
    },
    {
      // icon: "",
      icon: "🏁",
      id: "flags",
    },
  ],
};
