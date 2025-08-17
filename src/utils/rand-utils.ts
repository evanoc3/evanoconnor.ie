export function randInt(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function gibberish(length = 5): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for(let i = 0; i < length; i++) {
    result += characters.charAt(randInt(0, characters.length - 1));
  }
  return result;
}
