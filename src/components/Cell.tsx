import React from "react";

const Cell = (props: any) => {
  return (
    <div
      className="cell"
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        backgroundColor: props.value === 1 ? "pink" : "white",
        outline: "1px solid black",
      }}
      onClick={() => props.onClick()}
    ></div>
  );
};

export default React.memo(Cell);
