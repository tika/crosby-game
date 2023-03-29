import { useRouter } from "next/router";
import { readHighscore } from "../lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Index() {
  const [highscore, setHighscore] = useState(0);

  useEffect(() => {
    setHighscore(readHighscore());
  }, []);

  return (
    <div>
      <Head>
        <title>Crosby WEED</title>
      </Head>
      <h1>Crosby Weed Smoking Game</h1>
      <h2>
        Smoke as many J&apos;s as possible without{" "}
        <b style={{ fontWeight: "bolder" }}>Lord Capt. Mansergh</b> enlisting
        you in the army!
      </h2>

      <h3>Your high score is currently {highscore}</h3>

      <Link href="/play">Play game</Link>
    </div>
  );
}
