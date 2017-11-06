export interface IMockUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const MockUserDatabase: Array<IMockUser> = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@fake.com',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@fake.com',
  },
  {
    id: 3,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@fake.com',
  },
  {
    id: 4,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@fake.com',
  },
];
