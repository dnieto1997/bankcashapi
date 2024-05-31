export interface Ikey2PayPayoutResponse {
  uid: string;
  status: string;
  currency: string;
  amount: number;
  method: string;
  message: string;
  createdAt: Date;
  referenceCode: string;
  description: string;
  beneficiary: Beneficiary;
}

export interface Beneficiary {
  account: string;
  accountDigit: string;
  accountType: string;
  bankCode: string;
  branch: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: string;
  country: string;
  region: string;
}
