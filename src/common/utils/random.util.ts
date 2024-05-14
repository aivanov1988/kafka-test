function getRandomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * max);
}

export function getRandomNumberArray(): number[] {
  const n = getRandomInt(1, 10);
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = getRandomInt(1, 100);
  }
  return arr;
}
