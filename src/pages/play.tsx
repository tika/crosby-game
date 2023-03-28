import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "../components/platform";
import playstyles from "../styles/play.module.css";
import playerImage from "../public/assets/paul.png";
import manserImage from "../public/assets/man.png";
import crosby from "../public/assets/crosby.png";
import { Spliff } from "../components/spliff";
import { isIntersecting } from "../lib/intersection";

type Conditions = [boolean, boolean, boolean, boolean];

export default function Play() {
  const [playerPos, setPlayerPos] = useState([10, 10]);
  const [playerSpeed, setPlayerSpeed] = useState([0, 0]);
  const baseGravity = 0.01;
  const [gravity, setGravity] = useState(0.01);
  const baseAcceleration = 0.03;
  const [acceleration, setAcceleration] = useState(0.03);
  const baseMaxSpeed = 2;
  const [maxSpeed, setMaxSpeed] = useState(2);
  const baseRefreshRate = 5;
  const [refreshRate, setRefreshRate] = useState(5);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const platform1Ref = useRef<HTMLDivElement | null>(null);
  const platform2Ref = useRef<HTMLDivElement | null>(null);
  const platform3Ref = useRef<HTMLDivElement | null>(null);
  const platform4Ref = useRef<HTMLDivElement | null>(null);

  const platform5Ref = useRef<HTMLDivElement | null>(null);
  const platform6Ref = useRef<HTMLDivElement | null>(null);
  const platform7Ref = useRef<HTMLDivElement | null>(null);
  const platform8Ref = useRef<HTMLDivElement | null>(null);

  const platform9Ref = useRef<HTMLDivElement | null>(null);
  const platform10Ref = useRef<HTMLDivElement | null>(null);
  const platform11Ref = useRef<HTMLDivElement | null>(null);
  const platform12Ref = useRef<HTMLDivElement | null>(null);
  const platform13Ref = useRef<HTMLDivElement | null>(null);
  const platform14Ref = useRef<HTMLDivElement | null>(null);
  const platform15Ref = useRef<HTMLDivElement | null>(null);
  const platform16Ref = useRef<HTMLDivElement | null>(null);
  const platform17Ref = useRef<HTMLDivElement | null>(null);
  const platform18Ref = useRef<HTMLDivElement | null>(null);
  const platform19Ref = useRef<HTMLDivElement | null>(null);
  const platform20Ref = useRef<HTMLDivElement | null>(null);

  const [direction, setDirection] = useState<"right" | "left">("right");

  let spliffRef = useRef<HTMLDivElement | null>(null);
  const [keysdown, setKeysdown] = useState<string[]>([]);
  const mansoorRef = useRef<HTMLDivElement | null>(null);
  const [mansoorPos, setMansoorPos] = useState([400, 500]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function getRand(): [number, number] {
    return [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
  }

  const [randomPos, setRandomPos] = useState<[number, number][]>([
    getRand(),
    getRand(),
    getRand(),
    getRand(),
    getRand(),
  ]);

  const platforms = [
    platform1Ref.current,
    platform2Ref.current,
    platform3Ref.current,
    platform4Ref.current,
    platform5Ref.current,
    platform6Ref.current,
    platform7Ref.current,
    platform8Ref.current,
    platform10Ref.current,
    platform11Ref.current,
    platform12Ref.current,
    platform13Ref.current,
    platform14Ref.current,
    platform15Ref.current,
    platform16Ref.current,
    platform17Ref.current,
    platform18Ref.current,
    platform19Ref.current,
    platform20Ref.current,
  ];

  const [previousConditions, setPreviousConditions] = useState<Conditions[]>(
    []
  );

  // console.log(keysdown, playerSpeed);

  useEffect(() => {
    const r = (event: KeyboardEvent) => {
      // console.log(event.key);
      move(event.key);
    };

    document.addEventListener("keydown", r);
    return () => document.removeEventListener("keydown", r);
  });

  useEffect(() => {
    const r = (event: KeyboardEvent) => {
      if (event.key === "w" || event.key === "s") {
        setPlayerSpeed([playerSpeed[0], 0]);
      }

      if (event.key === "a" || event.key === "d") {
        setPlayerSpeed([0, playerSpeed[1]]);
      }

      let newKeysdown = keysdown;

      newKeysdown = newKeysdown.filter((it) => it !== event.key.toLowerCase());

      setKeysdown(newKeysdown);
    };

    document.addEventListener("keyup", r);
    return () => document.removeEventListener("keyup", r);
  });

  const addKey = useCallback(
    (key: "w" | "a" | "s" | "d") => {
      setKeysdown((prev) => [...prev, key]);
      setKeysdown([...keysdown, key]);
    },
    [keysdown]
  );

  const move = useCallback(
    (key: string) => {
      let newPlayerSpeed = playerSpeed;

      if (key === "w") {
        // setPlayerSpeed([playerSpeed[0], playerSpeed[1] - acceleration]);
        newPlayerSpeed[1] = newPlayerSpeed[1] - acceleration;
        addKey("w");
      }

      if (key === "a") {
        // setPlayerSpeed([playerSpeed[0] - acceleration, playerSpeed[1]]);
        newPlayerSpeed[0] = newPlayerSpeed[0] - acceleration;
        addKey("a");
        setDirection("left");
      }

      if (key === "s") {
        // setPlayerSpeed([playerSpeed[0], playerSpeed[1] + acceleration]);
        newPlayerSpeed[1] = newPlayerSpeed[1] + acceleration;
        addKey("s");
      }

      if (key === "d") {
        // setPlayerSpeed([playerSpeed[0] + acceleration, playerSpeed[1]]);
        newPlayerSpeed[0] = newPlayerSpeed[0] + acceleration;
        addKey("d");
        setDirection("right");
      }

      setPlayerSpeed(newPlayerSpeed);
    },
    [playerSpeed, addKey, acceleration]
  );

  // assumes current position is valid
  // returns { [validX, validY],
  function getValidPlacement([x, y]: [number, number]): boolean {
    if (!playerRef.current || !platform2Ref.current || !platform1Ref.current)
      return false;
    if (!playerRef.current) return false;

    const playerBox = playerRef.current.getBoundingClientRect();

    const platformBoxes: (DOMRect | undefined)[] = platforms.map((it) =>
      it?.getBoundingClientRect()
    );

    const [top, right, bottom, left] = [
      y,
      x + playerBox.width,
      y + playerBox.height,
      x,
    ];

    for (let i = 0; i < platformBoxes.length; i++) {
      const currentPlatformBox = platformBoxes[i];

      if (!currentPlatformBox) continue;

      const conditions = [
        right > currentPlatformBox.left && right < currentPlatformBox.right,
        left < currentPlatformBox.right && left > currentPlatformBox.left,
        top > currentPlatformBox.top && top < currentPlatformBox.bottom,
        bottom < currentPlatformBox.bottom && bottom > currentPlatformBox.top,
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
      const newPosition = [
        playerPos[0] + playerSpeed[0],
        playerPos[1] + playerSpeed[1],
      ];

      const placement = getValidPlacement(newPosition as [number, number]);
      // console.log(placement);
      const tempPlayerSpeed = playerSpeed;
      if (placement) {
        setPlayerPos(newPosition);
      } else {
        tempPlayerSpeed[1] = -gravity;
      }
      // console.log(tempPlayerSpeed);
      tempPlayerSpeed[1] = Math.min(tempPlayerSpeed[1] + gravity, maxSpeed);

      if (keysdown.includes("w")) {
        tempPlayerSpeed[1] = Math.max(
          tempPlayerSpeed[1] - acceleration,
          -maxSpeed
        );
      }

      if (keysdown.includes("a")) {
        tempPlayerSpeed[0] = Math.max(playerSpeed[0] - acceleration, -maxSpeed);
      }

      if (keysdown.includes("s")) {
        tempPlayerSpeed[1] = Math.min(playerSpeed[1] + acceleration, maxSpeed);
      }

      if (keysdown.includes("d")) {
        tempPlayerSpeed[0] = Math.min(playerSpeed[0] + acceleration, maxSpeed);
      }

      setPlayerSpeed(tempPlayerSpeed);

      setTimeout(() => {
        const yDist = playerPos[1] - mansoorPos[1];
        const xDist = playerPos[0] - mansoorPos[0];

        setMansoorPos([mansoorPos[0] + xDist / 50, mansoorPos[1] + yDist / 50]);
      }, 20);
      if (playerRef && spliffRef && playerRef.current && spliffRef.current) {
        // console.log("hello");
        if (isIntersecting(playerRef.current, spliffRef.current)) {
          // get random number between 0 and 200
          spliffRef.current.style.top = `${Math.floor(Math.random() * 100)}vh`;
          spliffRef.current.style.left = `${Math.floor(Math.random() * 100)}vh`;
          setScore(score + 1);
          const choppiness = score * 0.2 + 1;
          setAcceleration(baseAcceleration * choppiness);
          setRefreshRate(baseRefreshRate * choppiness);
          setGravity(baseGravity * choppiness);
          setMaxSpeed(baseMaxSpeed * choppiness);
        }
      }
    }, refreshRate);
    return () => clearInterval(gameloop);
  });

  return (
    <main className={playstyles.main}>
      {gameOver ? (
        <section>
          <p>Game Over</p>
          <p>You smoked {score} zoots</p>
        </section>
      ) : (
        <>
          <div
            style={{
              backgroundColor: "red",
              width: "100vh",
              height: "100vh",
              filter: `opacity(${Math.min(score, 90)}%)`,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 100,
            }}
            className={playstyles.m}
          />
          <div>
            <Platform
              t={platform1Ref}
              width={"100vh"}
              bottom={"0px"}
              right={"0px"}
              height={"10px"}
            />
            <Platform
              t={platform2Ref}
              width={"10px"}
              bottom={"0px"}
              right={"0px"}
              height={"100vh"}
            />
            <Platform
              t={platform3Ref}
              width={"10px"}
              bottom={"0"}
              right={"calc(100vh - 10px)"}
              height={"100vh"}
            />
            <Platform
              t={platform4Ref}
              width={"100vh"}
              bottom={"calc(100vh - 10px)"}
              right={"0px"}
              height={"10px"}
            />

            <Platform
              t={platform5Ref}
              width={"calc(100vh - 20px - 2*4em)"}
              bottom={"4em"}
              right={"calc(10px + 4em)"}
              height={"10px"}
            />

            <Platform
              t={platform6Ref}
              width={"calc(100vh - 20px - 2*4em)"}
              bottom={"calc(100vh - 10px - 4em)"}
              right={"calc(10px + 4em)"}
              height={"10px"}
            />

            <Platform
              t={platform7Ref}
              width={"10px"}
              bottom={"calc(100vh - 10px - 4em)"}
              right={"calc(10px + 4em)"}
              height={"30px"}
            />

            <Platform
              t={platform8Ref}
              width={"10px"}
              bottom={"calc(10px + 4em)"}
              right={"calc((100vh - 20px)/2)"}
              height={"100px"}
            />

            <Platform
              t={platform9Ref}
              width={"50px"}
              bottom={`${randomPos[0][0]}vh`}
              right={`${randomPos[0][1]}vh`}
              height={"50px"}
            />
            <Platform
              t={platform10Ref}
              width={"50px"}
              bottom={`${randomPos[1][0]}vh`}
              right={`${randomPos[1][1]}vh`}
              height={"50px"}
            />
            <Platform
              t={platform11Ref}
              width={"50px"}
              bottom={`${randomPos[2][0]}vh`}
              right={`${randomPos[2][1]}vh`}
              height={"50px"}
            />
            <Platform
              t={platform12Ref}
              width={"50px"}
              bottom={`${randomPos[3][0]}vh`}
              right={`${randomPos[3][1]}vh`}
              height={"50px"}
            />
            <Platform
              t={platform13Ref}
              width={"50px"}
              bottom={`${randomPos[4][0]}vh`}
              right={`${randomPos[4][1]}vh`}
              height={"50px"}
            />

            <Platform
              t={platform14Ref}
              width={"200px"}
              bottom={`calc(100vh/2 - 50px)`}
              right={`calc(100vh/2 - 100px)`}
              height={"10px"}
            />
            <Platform
              t={platform15Ref}
              width={"10px"}
              bottom={`calc(100vh/2 - 50px)`}
              right={`calc(100vh/2 - 100px)`}
              height={"150px"}
            />
            <Platform
              t={platform16Ref}
              width={"200px"}
              bottom={`calc(100vh/2 + 100px)`}
              right={`calc(100vh/2 - 100px)`}
              height={"10px"}
            />
            <Platform
              t={platform17Ref}
              width={"10px"}
              bottom={`calc(100vh/2 - 50px)`}
              right={`calc(100vh/2 + 100px)`}
              height={"80px"}
            />

            <Spliff bottom={34} right={34} t={spliffRef} />

            <div
              style={{
                backgroundImage: "url(" + playerImage.src + ")",
                backgroundSize: "cover",
                width: "1em",
                height: "1em",
                position: "absolute",
                top: playerPos[1],
                left: playerPos[0],
                transform: `scaleX(${direction === "right" ? -1 : 1})`,
              }}
              ref={playerRef}
            />

            <div
              style={{
                backgroundImage: "url(" + manserImage.src + ")",
                backgroundSize: "cover",
                width: "2em",
                height: "2em",
                bottom: "3px",
                right: "3px",
                position: "absolute",
                top: mansoorPos[1],
                left: mansoorPos[0],
              }}
              ref={mansoorRef}
            />
          </div>
          <h1>{score}</h1>
        </>
      )}
    </main>
  );
}
