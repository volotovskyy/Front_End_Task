import { useCallback, useState } from "react";
// import { SlackSelector, SlackCounter } from "@charkour/react-reactions";
import { SlackSelector, SlackCounter } from "./EmojiPicker/Slack";
import { useOutsideClick } from "../hooks/useClickOutside";

export const Message = ({ message, userName, onMessageChange, onReaction }) => {
  // const [reactions, setReactions] = useState([]);

  const [isReactionPickerVisible, setIsReactionPickerVisible] = useState(false);
  const [ref, ignoreNextClick] = useOutsideClick(() =>
    setIsReactionPickerVisible(false),
  );
  // useEffect(() => {
  //   onReaction(reactions);
  // }, [reactions]);

  const handleSelectReaction = useCallback((reaction) => {
    // setReactions((prev) => [...prev, { emoji: reaction, by: userName }]);
    // setReactions((prev) => {
    const updatedReactions = [
      ...message.reactions,
      { emoji: reaction, by: userName },
    ];
    // onMessageChange({ ...message, reactions: updatedReactions });
    console.log("Message::handleSelectReaction()", message);
    onReaction({ ...message, reactions: updatedReactions });
    // onReaction(updatedReactions);
    // });
    setIsReactionPickerVisible((prev) => !prev);
    return updatedReactions;
  });

  const handleAddReaction = useCallback(() => {
    setIsReactionPickerVisible((prev) => !prev);
    ignoreNextClick();
  });

  const handleRemoveReaction = useCallback((reaction) => {
    // Define the function to check if a reaction should be kept
    console.log("handleRemoveReaction::reaction", reaction);
    const shouldBeKept = ({ emoji, by }) =>
      !(emoji === reaction.emoji && by === reaction.by);

    // Filter reactions to keep only those that do not match the specified reaction
    const clearedReactions = message.reactions.filter(shouldBeKept);
    console.log("handleRemoveReaction::clearedReactions", clearedReactions);
    const processedMessage = { ...message, reactions: clearedReactions };
    console.log("handleRemoveReaction::processedMessage", processedMessage);

    // Assuming you have a function to update the state or send the processed message to the server
    onReaction(processedMessage);
  });

  // setReactions((prev) => {
  //   console.log("handleRemoveReaction::prev", prev);
  //   const clearedReactions = prev.filter(
  //     (r) => r.emoji !== reaction && r.by === userName,
  //   );
  //   console.log("handleRemoveReaction::clearedReactions", clearedReactions);
  //   onReaction({ ...message, reactions: clearedReactions });
  //   return clearedReactions;
  // });
  // })
  const handleClickOutside = () => setIsReactionPickerVisible((prev) => !prev);

  // const ref = useOutsideClick(handleClickOutside);
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
