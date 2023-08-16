export const isDataString = (data: any): asserts data is string => {
  if (typeof data !== 'string') {
    throw new Error('El tipo de dato es invalido');
  }
};
