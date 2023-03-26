import { useEffect, useRef, useState } from "react";
import { Platform } from "../components/platform";
import playstyles from "../styles/play.module.css";

type Conditions = [boolean, boolean, boolean, boolean];
type Collision = [1 | 0 | -1, 1 | 0 | -1];

export default function Play() {
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [playerSpeed, setPlayerSpeed] = useState([0, 0]);
  const gravity = 0.0;
  const acceleration = 2;
  const gap = acceleration + 0.1;
  const refreshRate = 10;
  const playerRef = useRef<HTMLDivElement | null>(null);
  const platform1Ref = useRef<HTMLDivElement | null>(null);
  const platform2Ref = useRef<HTMLDivElement | null>(null);

  const [previousConditions, setPreviousConditions] = useState<Conditions[]>(
    []
  );

  // []
  // [[false, false, false, false], [false, false, false, false], [false, false, false, false]]

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
  function getValidPlacement([x, y]: [number, number]): {
    coords: [number, number];
    collision: Collision;
  } {
    if (!playerRef.current || !platform2Ref.current)
      return { coords: [x, y], collision: [0, 0] };

    const playerBox = playerRef.current.getBoundingClientRect();
    const platformBoxes = [
      // platform1Ref.current.getBoundingClientRect(),§
      platform2Ref.current.getBoundingClientRect(),
    ];

    const [top, right, bottom, left] = [
      playerBox.y,
      playerBox.x + playerBox.width,
      playerBox.y + playerBox.height,
      playerBox.x,
    ];

    let finalCoords = {
      coords: [x, y] as [number, number],
      collision: [0, 0] as Collision,
    };

    let returnVals = [x, y];
    // [1 or 0 or -1 (+ve collison or -ve collision or no collision), 1 or 0 or -1]
    let returnCollision: Collision = [0, 0];

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
          returnCollision = [1, returnCollision[1]];
          returnVals = [
            currentPlatformBox.left - playerBox.width - gap,
            returnVals[1],
          ];
        } else {
          tempPreviousConditions[2] = false;
          returnCollision = [returnCollision[0], -1];
          returnVals = [returnVals[0], currentPlatformBox.bottom + gap];
        }
      } else if (conditions[0] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          returnCollision = [1, returnCollision[1]];
          returnVals = [
            currentPlatformBox.left - playerBox.width - gap,
            returnVals[1],
          ];
        } else {
          // console.log("2");
          tempPreviousConditions[3] = false;
          returnCollision = [returnCollision[0], 1];
          returnVals = [
            returnVals[0],
            currentPlatformBox.top - playerBox.height - gap,
          ];
        }
      } else if (conditions[1] && conditions[2]) {
        if (tempPreviousConditions[2]) {
          tempPreviousConditions[0] = false;
          returnCollision = [-1, returnCollision[1]];
          returnVals = [currentPlatformBox.right + gap, returnVals[1]];
        } else {
          tempPreviousConditions[2] = false;
          returnCollision = [returnCollision[0], -1];
          returnVals = [returnVals[0], currentPlatformBox.bottom + gap];
        }
      } else if (conditions[1] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          returnCollision = [-1, returnCollision[1]];
          returnVals = [currentPlatformBox.right + gap, returnVals[1]];
        } else {
          tempPreviousConditions[3] = false;
          returnCollision = [returnCollision[0], 1];
          returnVals = [
            returnVals[0],
            currentPlatformBox.top - playerBox.height - gap,
          ];
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
    finalCoords = {
      coords: returnVals as [number, number],
      collision: returnCollision,
    };

    return finalCoords;
  }

  // gameloop
  useEffect(() => {
    const gameloop = setInterval(() => {
      const placement = getValidPlacement(playerPos as [number, number]);

      console.log(placement.collision);

      let newPlayerSpeed = [playerSpeed[0], playerSpeed[1] + gravity];

      if (placement.collision[0] !== 0) {
        newPlayerSpeed = [0, newPlayerSpeed[1]];
      }

      if (placement.collision[1] !== 0) {
        newPlayerSpeed = [newPlayerSpeed[0], 0];
      }

      setPlayerPos([
        placement.coords[0] + newPlayerSpeed[0],
        placement.coords[1] + newPlayerSpeed[1],
      ]);
      setPlayerSpeed(newPlayerSpeed);
    }, refreshRate);

    return () => clearInterval(gameloop);
  });

  return (
    <main className={playstyles.main}>
      <div>
        {/* <Platform
          t={platform1Ref}
          width={100}
          bottom={15}
          right={0}
          height={10}
        /> */}
        <Platform
          t={platform2Ref}
          width={10}
          bottom={20}
          right={20}
          height={100}
        />

        <div
          style={{
            backgroundColor: "aqua",
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
