import { useEffect } from "react";

export function Player(props: { x: number; y: number; t: any }) {
  return (
    <div
      style={{
        backgroundColor: "aqua",
        width: "1em",
        height: "1em",
        position: "absolute",
        top: props.y,
        left: props.x,
      }}
      ref={props.t}
    ></div>
  );
}
