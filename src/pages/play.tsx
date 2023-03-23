import { useEffect, useRef, useState } from "react";
import { Platform } from "../components/platform";
import playstyles from "../styles/play.module.css";

type Conditions = [boolean, boolean, boolean, boolean];

export default function Play() {
  const [playerPos, setPlayerPos] = useState([0, 625]);
  const [playerSpeed, setPlayerSpeed] = useState([1, 0]);
  const gravity = 0.02;
  const refreshRate = 10;
  const playerRef = useRef<HTMLDivElement | null>(null);
  const platform1Ref = useRef<HTMLDivElement | null>(null);
  const platform2Ref = useRef<HTMLDivElement | null>(null);

  const [previousConditions, setPreviousConditions] = useState<Conditions[]>(
    []
  );

  // []
  // [[false, false, false, false], [false, false, false, false], [false, false, false, false]]

  // assumes current position is vali
  // returns { [validX, validY],
  function getValidPlacement([x, y]: [number, number]): {
    coords: [number, number];
    collision: [boolean, boolean];
  } {
    if (!playerRef.current || !platform1Ref.current || !platform2Ref.current)
      return { coords: [x, y], collision: [false, false] };

    const playerBox = playerRef.current.getBoundingClientRect();
    const platformBoxes = [
      platform1Ref.current.getBoundingClientRect(),
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
      collision: [false, false] as [boolean, boolean],
    };

    let returnVals = [x, y];
    let returnCollision = [false, false];

    for (let i = 0; i < platformBoxes.length; i++) {
      const currentPlatformBox = platformBoxes[i];

      console.log(currentPlatformBox.toJSON(), playerBox.toJSON());

      const conditions = [
        right > currentPlatformBox.left && right <= currentPlatformBox.right,
        left < currentPlatformBox.right && left >= currentPlatformBox.left,
        top > currentPlatformBox.top && top <= currentPlatformBox.bottom,
        bottom < currentPlatformBox.bottom && bottom >= currentPlatformBox.top,
      ];

      // let tempPrevConditions = []; // [][]

      // if (tempPrevConditions.length < i + 1) {
      //   // tempPrevConditions = [...tempPrevConditions, conditions as Conditions];
      //   tempPrevConditions.push(conditions);
      // } else {
      //   tempPrevConditions[i] = conditions;
      // }
      //   const newPrevConditions = prevConditions;

      //   newPrevConditions[i] = conditions as Conditions;

      //   tempPrevConditions = newPrevConditions;
      // }

      // The new previous conditions - when go to new if statement
      // then update array
      let tempPreviousConditions = previousConditions[i];

      if (!tempPreviousConditions || tempPreviousConditions.length < i + 1) {
        tempPreviousConditions = conditions as Conditions;
      }

      if (conditions[0] && conditions[2]) {
        if (tempPreviousConditions[2]) {
          tempPreviousConditions[0] = false;
          returnCollision = [true, returnCollision[1]];
          returnVals = [
            currentPlatformBox.left - playerBox.width,
            returnVals[1],
          ];
        } else {
          console.log("1");
          tempPreviousConditions[2] = false;
          returnCollision = [returnCollision[0], true];
          returnVals = [
            returnVals[0],
            currentPlatformBox.bottom + playerBox.height,
          ];
        }
      }

      if (conditions[0] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          returnCollision = [true, returnCollision[1]];
          returnVals = [
            currentPlatformBox.left - playerBox.width,
            returnVals[1],
          ];
        } else {
          tempPreviousConditions[3] = false;
          returnCollision = [returnCollision[0], true];
          returnVals = [
            returnVals[0],
            currentPlatformBox.top - playerBox.height,
          ];
        }
      }

      if (conditions[1] && conditions[2]) {
        if (tempPreviousConditions[2]) {
          tempPreviousConditions[0] = false;
          returnCollision = [true, returnCollision[1]];
          returnVals = [
            currentPlatformBox.right + playerBox.width,
            returnVals[1],
          ];
        } else {
          tempPreviousConditions[2] = false;
          returnCollision = [returnCollision[0], true];
          returnVals = [
            returnVals[0],
            currentPlatformBox.bottom + playerBox.height,
          ];
        }
      }

      if (conditions[1] && conditions[3]) {
        if (tempPreviousConditions[3]) {
          tempPreviousConditions[0] = false;
          returnCollision = [true, returnCollision[1]];
          returnVals = [
            currentPlatformBox.right + playerBox.width,
            returnVals[1],
          ];
        } else {
          console.log("2");

          tempPreviousConditions[3] = false;
          returnCollision = [returnCollision[0], true];
          returnVals = [
            returnVals[0],
            currentPlatformBox.top - playerBox.height,
          ];
        }
      }

      // Now change to 2d array
      const a = previousConditions;

      if (a.length < i + 1) {
        a.push(tempPreviousConditions);
      } else {
        a[i] = tempPreviousConditions;
      }

      setPreviousConditions(a);

      // if (returnVals[0] !== -1 || returnVals[1] !== -1) {
      // finalCoords = coords: returnVals as [number, number];

      // console.log(returnVals);
      // }
    }

    console.log(returnCollision);

    finalCoords = {
      coords: returnVals as [number, number],
      collision: returnCollision as [boolean, boolean],
    };

    return finalCoords;
  }

  // gameloop
  useEffect(() => {
    const t = setInterval(() => {
      const newSpeed = gravity + playerSpeed[1];
      const placement = getValidPlacement(playerPos as [number, number]);
      setPlayerPos([
        placement.coords[0] + playerSpeed[0],
        placement.coords[1] + newSpeed,
      ]);

      setPlayerSpeed([
        placement.collision[0] ? 1 : playerSpeed[0],
        placement.collision[1] ? 0 : newSpeed,
      ]);
    }, refreshRate);

    return () => clearInterval(t);
  });

  return (
    <main className={playstyles.main}>
      <div>
        <Platform
          t={platform1Ref}
          width={100}
          bottom={0}
          right={0}
          height={10}
        />
        <Platform
          t={platform2Ref}
          width={10}
          bottom={0}
          right={0}
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
