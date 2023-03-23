import data from "../../data.json";

export function writeHighscore(hs: number) {
  data.highscore = hs;
}

export function readHighscore(): number {
  return data.highscore;
}
