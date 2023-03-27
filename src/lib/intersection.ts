export function isIntersecting(a: HTMLDivElement, b: HTMLDivElement) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  const conditions = [
    aRect.right > bRect.left && aRect.right < bRect.right,
    aRect.left < bRect.right && aRect.left > bRect.left,
    aRect.top > bRect.top && aRect.top < bRect.bottom,
    aRect.bottom < bRect.bottom && aRect.bottom > bRect.top,
  ];

  // The new previous conditions - when go to new if statement
  // then update array

  if (conditions[0] && conditions[2]) {
    return true;
  } else if (conditions[0] && conditions[3]) {
    return true;
  } else if (conditions[1] && conditions[2]) {
    return true;
  } else if (conditions[1] && conditions[3]) {
    return true;
  }

  return false;
}
