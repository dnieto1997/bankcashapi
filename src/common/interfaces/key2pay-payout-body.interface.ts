export interface Ikey2PayPayoutBody {
  amount: number;
  currency: string;
  referenceCode: string;
  method: string;
  description: string;
  notificationUrl: string;
  beneficiary: Beneficiary;
}

export interface Beneficiary {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  accountType: string;
  account: string;
  accountDigit?: string;
  bankCode?: string;
  branch?: string;
  country: string;
  region?: string;
  documentNumber: string;
  documentType: string;
}
