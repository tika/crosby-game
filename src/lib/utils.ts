export function writeHighscore(hs: number) {
  // set in localstorage
  localStorage.setItem("highscore", hs.toString());
}

export function readHighscore(): number {
  //get from localstorage
  const hs = localStorage.getItem("highscore");

  if (hs) {
    return parseInt(hs);
  }

  return 0;
}
