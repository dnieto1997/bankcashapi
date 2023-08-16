interface IUserRolSeed {
  name: string;
  description: string;
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
