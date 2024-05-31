import { IKey2PayPaymentMethods } from '../interfaces/key2pay-payment-methods-response.interface';

export const checkCurrencyByCountry = (
  countries: IKey2PayPaymentMethods[],
  currency: string,
  country: string,
) => {
  const countryFound = countries.find((c) => c.country === country);

  return countryFound.currencies.includes(currency);
};
