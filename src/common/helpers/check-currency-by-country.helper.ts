import { IKey2PayPaymentMethods } from '../interfaces/key2pay-payment-methods-response.interface';

export const checkCurrencyByCountry = (
  countries: IKey2PayPaymentMethods[],
  currency: string,
  country: string,
) => {
  const countryFound = countries.find((c) => c.country === country);

  console.log('@@@@@@@q', country);
  console.log('1111111', currency);
  console.log(countryFound);

  return countryFound.currencies.includes(currency);
};
