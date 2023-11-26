import { useDrag } from "react-dnd";
import { ItemTypes } from "../utility/ItemTypes";
import { useState } from "react";

const style = {
  position: "absolute",
  border: "1px solid black",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
  width: "max-content",
  outline: "none",
  transform: "skew(-15deg)",
  fontFamily: "'Comic Sans', cursive",
  overflow: "hidden"
};

const role = "Box";

export const SpeechBubble = ({ id, left, top, hideSourceOnDrag, children }) => {
  const [val, setVal] = useState("");

  const handleClickTA= (e)=>{
    setVal(e.target.value);
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [id, left, top]
  );

  const dragElement = (
    <textarea
      ref={drag}
      style={{ ...style, left, top }}
      role={role}
      name={id}
      id={id}
      placeholder={children}
      onChange={(e) => handleClickTA(e)}
      value={val}
    ></textarea>
  );

  return isDragging && hideSourceOnDrag ? <div ref={drag} /> : dragElement;
};
