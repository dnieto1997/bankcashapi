import { AccountRols } from 'src/account/enums';
import { randomInt } from 'src/common/helpers/random-int.helper';

interface IUserRolSeed {
  name: string;
  description: string;
}

interface ICountries {
  countryCode: string;
  countryName: string;
  currencyCode?: string;
  currencyName?: string;
}

interface IUser {
  names: string;
  surnames: string;
  numDocument: number;
  email: string;
  password: string;
  cellphone: string;
  country: IUserCountry;
  city: string;
  address: string;
  postcode: string;
  idUserRole?: number;
}

interface IUserCountry {
  idCountry: number;
}

export const USER_ROL_SEED: IUserRolSeed[] = [
  {
    name: 'ADMIN',
    description: 'this user has all permissions',
  },
  {
    name: 'CLIENT',
    description: 'this user has all permissions',
  },
];

export const COUNTRIES_SEED: ICountries[] = [
  {
    countryCode: '00',
    countryName: 'WorldWide',
  },
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    currencyCode: 'ARS',
    currencyName: 'ARS',
  },
  {
    countryCode: 'BO',
    countryName: 'Bolivia',
    currencyCode: 'BOB',
    currencyName: 'BOB',
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    currencyCode: 'BRL',
    currencyName: 'Brazil Real',
  },
  {
    countryCode: 'BF',
    countryName: 'Burkina',
    currencyCode: 'XOF',
    currencyName: 'CFA franc BCEAO',
  },
  {
    countryCode: 'CM',
    countryName: 'Cameroon',
    currencyCode: 'XAF',
    currencyName: 'Central African CFA Franc BEAC',
  },
  {
    countryCode: 'CL',
    countryName: 'Chile',
    currencyCode: 'CLP',
    currencyName: 'Chile Peso',
  },
  {
    countryCode: 'CO',
    countryName: 'Colombia',
    currencyCode: 'COP',
    currencyName: 'Colombia Peso',
  },
  {
    countryCode: 'CR',
    countryName: 'Costa Rica',
    currencyCode: 'CRC',
    currencyName: 'Costa Rica Colon',
  },
  {
    countryCode: 'DO',
    countryName: 'Dominican Republic',
    currencyCode: 'DOP',
    currencyName: 'Dominican Peso',
  },
  {
    countryCode: 'EC',
    countryName: 'Ecuador',
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
  },
  {
    countryCode: 'EG',
    countryName: 'Egypt',
    currencyCode: 'EGP',
    currencyName: 'Egypt Pound',
  },
  {
    countryCode: 'SV',
    countryName: 'El Salvador',
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
  },
  {
    countryCode: 'ET',
    countryName: 'Ethiopia',
    currencyCode: 'ETB',
    currencyName: 'Birr',
  },
  {
    countryCode: 'GH',
    countryName: 'Ghana',
    currencyCode: 'GHS',
    currencyName: 'Cedi',
  },
  {
    countryCode: 'GT',
    countryName: 'Guatemala',
    currencyCode: 'GTQ',
    currencyName: 'Guatemala Peso',
  },
  {
    countryCode: 'GN',
    countryName: 'Guinea',
    currencyCode: 'GNF',
    currencyName: 'Guinea Franc',
  },
  {
    countryCode: 'GY',
    countryName: 'Guyana',
    currencyCode: 'GYD',
    currencyName: 'Guyana Dollar',
  },
  {
    countryCode: 'HN',
    countryName: 'Honduras',
    currencyCode: 'HNL',
    currencyName: 'Honduras Lempira',
  },
  {
    countryCode: 'IN',
    countryName: 'India',
    currencyCode: 'INR',
    currencyName: 'Indian Rupee',
  },
  {
    countryCode: 'CI',
    countryName: 'Ivory Coast',
    currencyCode: 'XOF',
    currencyName: 'CFA franc BCEAO',
  },
  {
    countryCode: 'KE',
    countryName: 'Kenya',
    currencyCode: 'KES',
    currencyName: 'Kenyan Shilling',
  },
  {
    countryCode: 'MY',
    countryName: 'Malaysia',
    currencyCode: 'MYR',
    currencyName: 'Malaysian Ringgit',
  },
  {
    countryCode: 'ML',
    countryName: 'Mali',
    currencyCode: 'XOF',
    currencyName: 'CFA franc BCEAO',
  },
  {
    countryCode: 'MX',
    countryName: 'Mexico',
    currencyCode: 'MXN',
    currencyName: 'Mexico Peso',
  },
  {
    countryCode: 'MZ',
    countryName: 'Mozambique',
    currencyCode: 'MZN',
    currencyName: 'Mozambique Metical',
  },
  {
    countryCode: 'NI',
    countryName: 'Nicaragua',
    currencyCode: 'NIO',
    currencyName: 'Nicaragua Cordoba',
  },
  {
    countryCode: 'NG',
    countryName: 'Nigeria',
    currencyCode: 'NGN',
    currencyName: 'Naira',
  },
  {
    countryCode: 'PA',
    countryName: 'Panama',
    currencyCode: 'PAB',
    currencyName: 'Panama Balboa',
  },
  {
    countryCode: 'PY',
    countryName: 'Paraguay',
    currencyCode: 'PYG',
    currencyName: 'Paraguay Guarani',
  },
  {
    countryCode: 'PE',
    countryName: 'Peru',
    currencyCode: 'PEN',
    currencyName: 'Peru Sol',
  },
  {
    countryCode: 'PR',
    countryName: 'Puerto Rico',
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
  },
  {
    countryCode: 'RU',
    countryName: 'Russia',
    currencyCode: 'RUB',
    currencyName: 'Russian Ruble',
  },
  {
    countryCode: 'RW',
    countryName: 'Rwanda',
    currencyCode: 'RWF',
    currencyName: 'Rwandan Franc',
  },
  {
    countryCode: 'SN',
    countryName: 'Senegal',
    currencyCode: 'XOF',
    currencyName: 'CFA franc BCEAO',
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    currencyCode: 'SGD',
    currencyName: 'Singapore Dollar',
  },
  {
    countryCode: 'ZA',
    countryName: 'South Africa',
    currencyCode: 'ZAR',
    currencyName: 'South African Rand',
  },
  {
    countryCode: 'SR',
    countryName: 'Suriname',
    currencyCode: 'SRD',
    currencyName: 'Suriname Dollar',
  },
  {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    currencyCode: 'TZS',
    currencyName: 'Tanzania Shilling',
  },
  {
    countryCode: 'TH',
    countryName: 'Thailand',
    currencyCode: 'THB',
    currencyName: 'Baht',
  },
  {
    countryCode: 'TR',
    countryName: 'Turkey',
    currencyCode: 'TRY',
    currencyName: 'Turkey Lira',
  },
  {
    countryCode: 'UG',
    countryName: 'Uganda',
    currencyCode: 'UGX',
    currencyName: 'Uganda Shilling',
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    currencyCode: 'GBP',
    currencyName: 'Pound sterling',
  },
  {
    countryCode: 'UY',
    countryName: 'Uruguay',
    currencyCode: 'UYU',
    currencyName: 'Uruguay Peso',
  },
  {
    countryCode: 'VE',
    countryName: 'Venezuela',
    currencyCode: 'VES',
    currencyName: 'Venezuelan Bolívar',
  },
  {
    countryCode: 'VN',
    countryName: 'Vietnam',
    currencyCode: 'VND',
    currencyName: 'Dong',
  },
  {
    countryCode: 'ZM',
    countryName: 'Zambia',
    currencyCode: 'ZMW',
    currencyName: 'Zambian Kwacha',
  },
  {
    countryCode: 'ZW',
    countryName: 'Zimbabwe',
    currencyCode: 'ZWL',
    currencyName: 'Zimbabwe Dollar',
  },
];

export const USERS_SEED = [
  {
    names: 'Max',
    surnames: 'Miller',
    numDocument: 10012349462,
    email: 'admin@correo.com',
    password: 'Abc1234',
    cellphone: '312456780',
    country: {
      idCountry: 8,
    },
    account: {
      numberOfAccount: `5${randomInt(0, 999_999_999, 9)}`,
      accountBalance: [
        {
          balance: '0',
          currencyCode: 'COP',
        },
      ],
      accountRols: [
        {
          idAccountRole: AccountRols.SEE,
        },
        {
          idAccountRole: AccountRols.MANAGMENT,
        },
        {
          idAccountRole: AccountRols.TRANSACTION,
        },
      ],
    },
    city: 'barranquilla',
    address: 'cra 38 # 72',
    postcode: '08001',
    idUserRole: 1,
  },
  {
    names: 'Elliot',
    surnames: 'Alderson',
    numDocument: 10012349467,
    email: 'client@correo.com',
    password: 'Abc1234',
    cellphone: '312456782',
    country: {
      idCountry: 8,
    },
    account: {
      numberOfAccount: `5${randomInt(0, 999_999_999, 9)}`,
      accountBalance: [
        {
          balance: '0',
          currencyCode: 'COP',
        },
      ],
      accountRols: [
        {
          idAccountRole: AccountRols.SEE,
        },
        {
          idAccountRole: AccountRols.MANAGMENT,
        },
        {
          idAccountRole: AccountRols.TRANSACTION,
        },
      ],
    },
    city: 'barranquilla',
    address: 'cra 38 # 76',
    postcode: '08001',
  },
];

export const ACCOUNT_ROLE_SEED = [
  {
    name: 'Consultation',
    description:
      'allows the user to consult the balance, statement, history and information of their financial products such as accounts, cards, credits, investments, etc.',
  },
  {
    name: 'Transaction',
    description:
      'allows the user to perform operations such as transfers, payments, recharges, withdrawals, sending and receiving money, etc.',
  },
  {
    name: 'Administration',
    description:
      'allows the user to manage aspects such as blocking and unblocking cards, changing passwords, updating personal data, requesting and canceling products, etc.',
  },
];
