import { Employee, User } from './types';
declare class Database {
    private employees;
    private users;
    constructor();
    private initializeSampleData;
    getAllEmployees(): Employee[];
    getEmployeeById(id: string): Employee | undefined;
    getEmployeeByEmployeeId(employeeId: string): Employee | undefined;
    addEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee;
    updateEmployee(id: string, updates: Partial<Employee>): Employee | null;
    deleteEmployee(id: string): boolean;
    getAllUsers(): User[];
    getUserById(id: string): User | undefined;
    getUserByEmail(email: string): User | undefined;
    addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User;
}
export declare const db: Database;
export {};
//# sourceMappingURL=database.d.ts.map