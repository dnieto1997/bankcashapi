export const randomInt = (min: number, max: number, length: number = 1) => {
  let num = '';
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * (max - min + 1) + min);
  }

  return num;
};
