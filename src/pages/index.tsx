import { useRouter } from "next/router";
import { readHighscore } from "../lib/utils";
import Link from "next/link";

export default function Index() {
  return (
    <div>
      <h1>Crosby Weed Smoking Game</h1>
      <h2>
        Smoke as many J&apos;s as possible without Mansergh enlisting you in the
        army!
      </h2>

      <h3>Your high score is currently {readHighscore()}</h3>

      <Link href="/play">Play game</Link>
    </div>
  );
}
