import { useCallback, useState } from "react";
import { SlackSelector, SlackCounter } from "./EmojiPicker/Slack";
import { useOutsideClick } from "../hooks/useClickOutside";

export const Message = ({ message, userName, onReaction }) => {
  const [isReactionPickerVisible, setIsReactionPickerVisible] = useState(false);
  const [ref, ignoreNextClick] = useOutsideClick(() =>
    setIsReactionPickerVisible(false),
  );

  const handleSelectReaction = useCallback((reaction) => {
    const updatedReactions = [
      ...message.reactions,
      { emoji: reaction, by: userName },
    ];
    onReaction({ ...message, reactions: updatedReactions });
    setIsReactionPickerVisible((prev) => !prev);
    return updatedReactions;
  });

  const handleAddReaction = useCallback(() => {
    setIsReactionPickerVisible((prev) => !prev);
    ignoreNextClick();
  });

  const handleRemoveReaction = useCallback((reaction) => {
    const shouldBeKept = ({ emoji, by }) =>
      !(emoji === reaction.emoji && by === reaction.by);

    const clearedReactions = message.reactions.filter(shouldBeKept);
    const processedMessage = { ...message, reactions: clearedReactions };

    onReaction(processedMessage);
  });

  const isOutgoingMessage = userName === message.userName;

  return (
    <div
      className={`message ${
        isOutgoingMessage ? "message--outgoing" : "message--incoming"
      }`}
    >
      <div className="avatar">{message?.userName?.[0].toUpperCase()}</div>
      <div>
        <h4>{message.userName + ":"}</h4>

        <p>{message.content}</p>

        <SlackCounter
          user={userName}
          counters={message.reactions}
          onAdd={handleAddReaction}
          onRemove={handleRemoveReaction}
          onSelect={handleSelectReaction}
        />
      </div>
      {isReactionPickerVisible && (
        <SlackSelector
          ref={ref}
          isOutgoingMessage={isOutgoingMessage}
          onSelect={handleSelectReaction}
        />
      )}
    </div>
  );
};
