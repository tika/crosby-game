import { MutableRefObject } from "react";
import vapeImage from "../public/assets/smok.png";

export function Vape(props: {
  top: number;
  left: number;
  t?: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      style={{
        backgroundImage: "url(" + vapeImage.src + ")",
        backgroundSize: "cover",
        width: "2.5em",
        height: "2.5em",
        top: props.top + "px",
        left: props.left + "px",
        position: "absolute",
      }}
      className="vape"
      ref={props.t}
    ></div>
  );
}
