import { User, UserRole } from './types';
export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    employeeId?: string;
}
export declare const generateToken: (user: User) => string;
export declare const verifyToken: (token: string) => JWTPayload | null;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
//# sourceMappingURL=auth.d.ts.map
