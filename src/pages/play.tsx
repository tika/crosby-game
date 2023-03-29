import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "../components/platform";
import playstyles from "../styles/play.module.css";
import playerImage from "../public/assets/paul.png";
import manserImage from "../public/assets/man.png";
import crosby from "../public/assets/crosby.png";
import { Spliff } from "../components/spliff";
import { isIntersecting } from "../lib/intersection";
import { Vape } from "../components/vape";
import { Spices } from "../components/spices";
import exclaImage from "../public/assets/excla.png";
import keaImage from "../public/assets/kea.png";
import { Vodka } from "../components/vodka";
import Image from "next/image";
import Link from "next/link";
import { readHighscore, writeHighscore } from "../lib/utils";
import Head from "next/head";

type Conditions = [boolean, boolean, boolean, boolean];

export default function Play() {
  const [playerPos, setPlayerPos] = useState([10, 500]);
  const [playerSpeed, setPlayerSpeed] = useState([0, 0]);
  const baseGravity = 0.01;
  const [gravity, setGravity] = useState(0.01);
  const baseAcceleration = 0.03;
  const [acceleration, setAcceleration] = useState(0.03);
  const baseMaxSpeed = 2;
  const [maxSpeed, setMaxSpeed] = useState(baseMaxSpeed);
  const baseRefreshRate = 5;
  const [refreshRate, setRefreshRate] = useState(baseRefreshRate);
  const keaAmount = 0;
  const powerupLocations = [
    [100, 100],
    [600, 100],
    [100, 600],
    [600, 600],
    [340, 300],
  ];
  const [mansoorProxity, setMansoorProxity] = useState(0);
  const [slowTeacher, setSlowTeacher] = useState<number>(0);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const vapeRef = useRef<HTMLDivElement | null>(null);
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
  let vodkaRef = useRef<HTMLDivElement | null>(null);

  const [keysdown, setKeysdown] = useState<string[]>([]);
  const mansoorRef = useRef<HTMLDivElement | null>(null);
  const keaRef = useRef<HTMLDivElement | null>(null);
  const spicesRef = useRef<HTMLDivElement | null>(null);
  const [mansoorPos, setMansoorPos] = useState([400, 500]);
  const [keaPos, setKeaPos] = useState([100, 500]);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState<"m" | "kea" | false>(false);
  const [powerupActivated, setPowerupActivated] = useState<
    "vodka" | "vape" | "spices" | null
  >(null);

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

  function isIntersectingWithPlatform(obj: HTMLDivElement) {
    platforms.forEach((platform) => {
      if (platform && isIntersecting(obj, platform)) {
        return true;
      }
    });

    return false;
  }

  useEffect(() => {
    if (vapeRef.current && vodkaRef.current && spicesRef.current) {
      vapeRef.current.style.display = "none";
      vodkaRef.current.style.display = "none";
      spicesRef.current.style.display = "none";
    }
  }, []);

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
        newPlayerSpeed[1] = newPlayerSpeed[1] - acceleration;
        addKey("w");
      }

      if (key === "a") {
        newPlayerSpeed[0] = newPlayerSpeed[0] - acceleration;
        addKey("a");
        setDirection("left");
      }

      if (key === "s") {
        newPlayerSpeed[1] = newPlayerSpeed[1] + acceleration;
        addKey("s");
      }

      if (key === "d") {
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

      const tempPlayerSpeed = playerSpeed;
      if (placement) {
        setPlayerPos(newPosition);
      } else {
        tempPlayerSpeed[1] = -gravity;
      }

      tempPlayerSpeed[1] = Math.min(tempPlayerSpeed[1] + gravity, maxSpeed);

      // kea
      if (score >= keaAmount) {
        setTimeout(() => {
          const yDist = playerPos[1] - keaPos[1];
          const xDist = playerPos[0] - keaPos[0];

          if (
            keaRef.current &&
            mansoorRef.current &&
            isIntersecting(keaRef.current, mansoorRef.current)
          ) {
            return;
          } else {
            setKeaPos([keaPos[0] + xDist / 50, keaPos[1] + yDist / 50]);
          }
        }, 20 * (1 + slowTeacher / 100));
      }
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

      const mansoorSpeed = score >= keaAmount ? 20 : 50;
      const mansoorDelay = score >= keaAmount ? 20 : 10;

      setTimeout(() => {
        const yDist = playerPos[1] - mansoorPos[1];
        const xDist = playerPos[0] - mansoorPos[0];

        setMansoorPos([
          mansoorPos[0] + xDist / mansoorSpeed,
          mansoorPos[1] + yDist / mansoorSpeed,
        ]);
        setMansoorProxity(Math.sqrt(xDist ** 2 + yDist ** 2));
      }, mansoorDelay * (1 + slowTeacher / 100));

      if (playerRef && spliffRef && playerRef.current && spliffRef.current) {
        if (isIntersecting(playerRef.current, spliffRef.current)) {
          const x = Math.floor(Math.random() * 100);
          const y = Math.floor(Math.random() * 100);

          spliffRef.current.style.top = `${x}vh`;
          spliffRef.current.style.left = `${y}vh`;

          while (isIntersectingWithPlatform(spliffRef.current)) {
            const x = Math.floor(Math.random() * 100);
            const y = Math.floor(Math.random() * 100);

            spliffRef.current.style.top = `${x}vh`;
            spliffRef.current.style.left = `${y}vh`;
          }

          setScore(score + 1);
          const choppiness = 1;
          setAcceleration(baseAcceleration * choppiness);
          setRefreshRate(baseRefreshRate * choppiness);
          setGravity(baseGravity * choppiness);
          setMaxSpeed(baseMaxSpeed * choppiness);

          // powerup? random chance of 25%
          if (
            vapeRef.current &&
            vodkaRef.current &&
            spicesRef.current &&
            Math.random() < 0.25
          ) {
            const powerups = ["vodka", "vape", "spices"];

            const randomPowerup =
              powerups[Math.floor(Math.random() * powerups.length)];

            const randomLocation =
              powerupLocations[
                Math.floor(Math.random() * powerupLocations.length)
              ];

            if (randomPowerup === "vodka") {
              vodkaRef.current.style.top = `${randomLocation[0]}px`;
              vodkaRef.current.style.left = `${randomLocation[1]}px`;
              vodkaRef.current.style.display = "block";
            } else if (randomPowerup === "vape") {
              vapeRef.current.style.top = `${randomLocation[0]}px`;
              vapeRef.current.style.left = `${randomLocation[1]}px`;
              vapeRef.current.style.display = "block";
            } else if (randomPowerup === "spices") {
              vapeRef.current.style.top = `${randomLocation[0]}px`;
              vapeRef.current.style.left = `${randomLocation[1]}px`;
              vapeRef.current.style.display = "block";
            } else {
              vapeRef.current.style.display = "none";
              vodkaRef.current.style.display = "none";
            }
          }
        }

        if (
          playerRef &&
          playerRef.current &&
          vapeRef &&
          vapeRef.current &&
          vodkaRef &&
          vodkaRef.current &&
          spicesRef.current &&
          spicesRef &&
          !powerupActivated
        ) {
          if (isIntersecting(playerRef.current, vapeRef.current)) {
            vapeRef.current.style.display = "none";
            setMaxSpeed(baseMaxSpeed / 5);
            setPowerupActivated("vape");
            setSlowTeacher(50);

            setTimeout(() => {
              setMaxSpeed(baseMaxSpeed);
              setPowerupActivated(null);
              setSlowTeacher(0);
            }, 3000);
          }

          if (isIntersecting(playerRef.current, vodkaRef.current)) {
            vodkaRef.current.style.display = "none";
            setPowerupActivated("vodka");
            setTimeout(() => {
              setPowerupActivated(null);
            }, 10000);
          }

          if (isIntersecting(playerRef.current, spicesRef.current)) {
            spicesRef.current.style.display = "none";
            setPowerupActivated("spices");
            setRefreshRate(baseRefreshRate / 3);
            setTimeout(() => {
              setPowerupActivated(null);
              setRefreshRate(baseRefreshRate);
            }, 5000);
          }
        }
      }

      if (
        playerRef &&
        mansoorRef &&
        keaRef &&
        playerRef.current &&
        mansoorRef.current &&
        keaRef.current
      ) {
        if (isIntersecting(playerRef.current, mansoorRef.current)) {
          setGameOver("m");
        }

        if (isIntersecting(playerRef.current, keaRef.current)) {
          setGameOver("kea");
        }

        if (readHighscore() < score) {
          writeHighscore(score);
        }
      }
    }, refreshRate);
    return () => clearInterval(gameloop);
  });

  function shakeAmount() {
    if (mansoorProxity > 200) return "hide";

    if (mansoorProxity < 50) return "a";

    if (mansoorProxity < 100) return "b";

    return "";
  }

  return (
    <main className={playstyles.main + " "}>
      <Head>
        <title>Crosby WEED</title>
      </Head>
      {gameOver ? (
        <section style={{ marginLeft: "5em" }}>
          <Image
            src={crosby.src}
            alt="Crosby"
            priority
            width={300}
            height={300}
          ></Image>
          <h1>Game Over</h1>
          <p>
            You smoked <i>{score}</i> zoots
          </p>
          <p>
            {gameOver === "m" && "Mansergh"} {gameOver === "kea" && "Arnold"}{" "}
            caught you
          </p>
          <p>
            {readHighscore() === score
              ? "NEW HIGHSCORE: " + score + " spliffs!"
              : "Highscore: " + readHighscore() + " spliffs"}
          </p>
          <Link href="/">Refresh</Link>
        </section>
      ) : (
        <>
          <div
            className={powerupActivated === "vape" ? "lsdbg" : ""}
            style={{
              backgroundColor: "red",
              animation: "lsd 2s linear infinite",
              width: "100vh",
              height: "100vh",
              filter: `opacity(${
                powerupActivated === "vape" ? 90 : Math.min(score * 5, 90)
              }%)`,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 100,
            }}
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
              top={"0"}
              height={"100vh"}
            />
            <Platform
              t={platform4Ref}
              width={"100vh"}
              top={"0"}
              right={"0px"}
              height={"10px"}
            />

            <Platform
              t={platform5Ref}
              width={"80vh"}
              bottom={"4em"}
              right={"4.5em"}
              height={"10px"}
            />

            <Platform
              t={platform6Ref}
              width={"80vh"}
              top={"4.5em"}
              right={"4.5em"}
              height={"10px"}
            />

            <Platform
              t={platform7Ref}
              width={"10px"}
              top={"4.5em"}
              right={"4.5em"}
              height={"30px"}
            />

            <Platform
              t={platform8Ref}
              width={"10px"}
              bottom={"4.5"}
              right={"50%"}
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
              bottom={`50%`}
              right={`50%`}
              height={"10px"}
            />
            <Platform
              t={platform15Ref}
              width={"10px"}
              bottom={`50%`}
              right={`50%`}
              height={"150px"}
            />
            <Platform
              t={platform16Ref}
              width={"200px"}
              bottom={`60%`}
              right={`60%`}
              height={"10px"}
            />
            <Platform
              t={platform17Ref}
              width={"10px"}
              bottom={`50%`}
              right={`60%`}
              height={"80px"}
            />

            <Spliff bottom={34} right={34} t={spliffRef} />
            <Vape top={12} left={12} t={vapeRef} />
            <Vodka top={12} left={12} t={vodkaRef} />
            <Spices top={12} left={12} t={spicesRef} />

            <div
              style={{
                backgroundImage: "url(" + playerImage.src + ")",
                backgroundSize: "cover",
                width: "1em",
                height: "1em",
                position: "absolute",
                top: playerPos[1],
                left: playerPos[0],
                transform:
                  powerupActivated !== "vodka"
                    ? `scaleX(${direction === "right" ? -1 : 1})`
                    : "",
                animation:
                  powerupActivated !== "vodka" ? "" : "spin 0.5s infinite",
              }}
              ref={playerRef}
            />

            <div
              style={{
                backgroundImage: "url(" + exclaImage.src + ")",
                backgroundSize: "cover",
                width: "1em",
                height: "1em",
                bottom: "2px",
                right: "2px",
                position: "absolute",
                top: mansoorPos[1] - 20,
                left: mansoorPos[0] + 10,
                animationIterationCount: "infinite",
              }}
              className={shakeAmount()}
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
            {score >= keaAmount && (
              <div
                style={{
                  backgroundImage: "url(" + keaImage.src + ")",
                  backgroundSize: "cover",
                  width: "2em",
                  height: "2em",
                  bottom: "3px",
                  right: "3px",
                  position: "absolute",
                  top: keaPos[1],
                  left: keaPos[0],
                }}
                ref={keaRef}
              />
            )}
          </div>
          <section style={{ marginLeft: "1em" }}>
            <h2>{score}</h2>
            <p>{powerupActivated && powerupActivated + " ACTIVATED"}</p>
          </section>
        </>
      )}
    </main>
  );
}
