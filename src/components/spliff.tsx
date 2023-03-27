import { MutableRefObject } from "react";
import spliffImage from "../public/assets/zoot.png";

export function Spliff(props: {
  bottom: number;
  right: number;
  t?: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      style={{
        backgroundImage: "url(" + spliffImage.src + ")",
        backgroundSize: "cover",
        width: "2.5em",
        height: "2.5em",
        bottom: props.bottom + "em",
        right: props.right + "em",
        position: "absolute",
      }}
      className="spliff"
      ref={props.t}
    ></div>
  );
}
