import { Role } from '@/types/models/Role';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  activated?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: Role;
}
