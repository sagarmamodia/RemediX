export type Role = 'Patient' | 'Provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
}
