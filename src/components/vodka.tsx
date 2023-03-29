import { MutableRefObject } from "react";
import vodkaImage from "../public/assets/smirnoff.png";

export function Vodka(props: {
  top: number;
  left: number;
  t?: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      style={{
        backgroundImage: "url(" + vodkaImage.src + ")",
        backgroundSize: "cover",
        width: "2.5em",
        height: "2.5em",
        top: props.top + "px",
        left: props.left + "px",
        position: "absolute",
      }}
      className="powerup"
      ref={props.t}
    ></div>
  );
}
