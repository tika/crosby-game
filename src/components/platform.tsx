import { MutableRefObject } from "react";

export function Platform(props: {
  height: number;
  width: number;
  bottom: number;
  right: number;
  vertical?: boolean;
  t: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={props.t}
      style={{
        height: props.height,
        width: props.width + "%",
        backgroundColor: "red",
        bottom: props.bottom + "em",
        right: props.right + "em",
        position: "absolute",
      }}
    ></div>
  );
}
