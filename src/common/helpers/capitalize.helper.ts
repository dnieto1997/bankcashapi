export const capitalize = (property: string) =>
  property
    .split(' ')
    .map((palabra) => palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1))
    .join(' ');
