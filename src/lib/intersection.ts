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

export function isIntersectingMany(...elements: HTMLDivElement[]) {
  const rects = elements.map((el) => el.getBoundingClientRect());

  const conditions = rects.map((rect, i) => {
    return rects
      .filter((_, j) => i !== j)
      .map((otherRect) => {
        return [
          rect.right > otherRect.left && rect.right < otherRect.right,
          rect.left < otherRect.right && rect.left > otherRect.left,
          rect.top > otherRect.top && rect.top < otherRect.bottom,
          rect.bottom < otherRect.bottom && rect.bottom > otherRect.top,
        ];
      });
  });

  // The new previous conditions - when go to new if statement
  // then update array

  for (let i = 0; i < conditions.length; i++) {
    for (let j = 0; j < conditions[i].length; j++) {
      const [a, b, c, d] = conditions[i][j];

      if (a && c) {
        return true;
      } else if (a && d) {
        return true;
      } else if (b && c) {
        return true;
      } else if (b && d) {
        return true;
      }
    }
  }

  return false;
}
