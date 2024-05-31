import { IKey2PayMethodsOfPayment } from '../interfaces';

export const getPaymentMethodByCountry = (
  methods: IKey2PayMethodsOfPayment[],
  country: string,
) => {
  return methods.filter((method) => method.country === country);
};
