import { MutableRefObject } from "react";

export function Platform(props: {
  height: string;
  width: string;
  bottom: string;
  right: string;
  vertical?: boolean;
  t: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={props.t}
      style={{
        height: props.height,
        width: props.width,
        backgroundColor: "black",
        bottom: props.bottom,
        right: props.right,
        position: "absolute",
      }}
    ></div>
  );
}
