export type Role = 'patient' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
}
