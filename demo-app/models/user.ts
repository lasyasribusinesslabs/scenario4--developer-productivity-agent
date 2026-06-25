export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

/**
 * toPublicUser — strips sensitive fields (passwordHash) before sending to client.
 */
export function toPublicUser(user: User): PublicUser {
  const { passwordHash, updatedAt, ...publicFields } = user;
  return publicFields;
}
