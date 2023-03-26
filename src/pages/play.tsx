import { useEffect, useRef, useState } from "react";
import { Platform } from "../components/platform";
import playstyles from "../styles/play.module.css";

type Conditions = [boolean, boolean, boolean, boolean];
type Collision = [1 | 0 | -1, 1 | 0 | -1];

export default function Play() {
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [playerSpeed, setPlayerSpeed] = useState([0, 0]);
  const gravity = 0.0;
  const acceleration = 0.5;
  const gap = 0;
  const refreshRate = 2.5;
  const playerRef = useRef<HTMLDivElement | null>(null);
  const platform1Ref = useRef<HTMLDivElement | null>(null);
  const platform2Ref = useRef<HTMLDivElement | null>(null);

  const [previousConditions, setPreviousConditions] = useState<Conditions[]>(
    []
  );

  useEffect(() => {
    const r = (event: KeyboardEvent) => {
      // console.log(event.key);
      move(event.key);
    };

    document.addEventListener("keydown", r);
    return () => document.removeEventListener("keydown", r);
  }, []);

  function move(key: string) {
    if (key === "w") {
      setPlayerSpeed([playerSpeed[0], playerSpeed[1] - acceleration]);
    }

    if (key === "a") {
      setPlayerSpeed([playerSpeed[0] - acceleration, playerSpeed[1]]);
    }

    if (key === "s") {
      setPlayerSpeed([playerSpeed[0], playerSpeed[1] + acceleration]);
    }

    if (key === "d") {
      setPlayerSpeed([playerSpeed[0] + acceleration, playerSpeed[1]]);
    }
  }

  // assumes current position is valid
  // returns { [validX, validY],
  function getValidPlacement([x, y]: [number, number]): boolean {
    if (!playerRef.current || !platform2Ref.current || !platform1Ref.current)
      return false;

    const playerBox = playerRef.current.getBoundingClientRect();
    const platformBoxes = [
      platform1Ref.current.getBoundingClientRect(),
      platform2Ref.current.getBoundingClientRect(),
    ];

    const [top, right, bottom, left] = [
      y,
      x + playerBox.width,
      y + playerBox.height,
      x,
    ];

    for (let i = 0; i < platformBoxes.length; i++) {
      const currentPlatformBox = platformBoxes[i];

      const conditions = [
        right > currentPlatformBox.left && right <= currentPlatformBox.right,
        left < currentPlatformBox.right && left >= currentPlatformBox.left,
        top > currentPlatformBox.top && top <= currentPlatformBox.bottom,
        bottom < currentPlatformBox.bottom && bottom >= currentPlatformBox.top,
      ];

      // The new previous conditions - when go to new if statement
      // then update array
      let tempPreviousConditions = previousConditions[i];

      if (!tempPreviousConditions || tempPreviousConditions.length < i + 1) {
        tempPreviousConditions = [false, false, false, false];
      }

      if (conditions[0] && conditions[2]) {
        if (tempPreviousConditions[2]) {
          tempPreviousConditions[0] = false;
          return false;
        } else {
          tempPreviousConditions[2] = false;
          return false;
        }
      } else if (conditions[0] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          return false;
        } else {
          tempPreviousConditions[3] = false;
          return false;
        }
      } else if (conditions[1] && conditions[2]) {
        if (tempPreviousConditions[2]) {
          tempPreviousConditions[0] = false;
          return false;
        } else {
          tempPreviousConditions[2] = false;
          return false;
        }
      } else if (conditions[1] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          return false;
        } else {
          tempPreviousConditions[3] = false;
          return false;
        }
      }
      tempPreviousConditions = conditions as Conditions;
      // Now change to 2d array
      const a = previousConditions;

      if (a.length < i + 1) {
        a.push(tempPreviousConditions);
      } else {
        a[i] = tempPreviousConditions;
      }

      setPreviousConditions(a);
    }

    return true;
  }

  // gameloop
  useEffect(() => {
    const gameloop = setInterval(() => {
      let newPlayerSpeed = [playerSpeed[0], playerSpeed[1]];

      const newPosition = [
        playerPos[0] + newPlayerSpeed[0],
        playerPos[1] + newPlayerSpeed[1],
      ];

      const placement = getValidPlacement(newPosition as [number, number]);

      if (placement) {
        setPlayerPos(newPosition);
        setPlayerSpeed(newPlayerSpeed);
      }
    }, refreshRate);

    return () => clearInterval(gameloop);
  });

  return (
    <main className={playstyles.main}>
      <div>
        <Platform
          t={platform1Ref}
          width={100}
          bottom={15}
          right={0}
          height={10}
        />
        <Platform
          t={platform2Ref}
          width={10}
          bottom={20}
          right={20}
          height={100}
        />

        <div
          style={{
            // backgroundImage: 'url("/assets/paul.png")',
            backgroundColor: "blue",
            width: "1em",
            height: "1em",
            position: "absolute",
            top: playerPos[1],
            left: playerPos[0],
          }}
          ref={playerRef}
        ></div>
      </div>
    </main>
  );
}
