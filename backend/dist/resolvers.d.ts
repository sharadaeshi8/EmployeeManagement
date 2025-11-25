import { Employee, User, Context, EmployeeFilter, EmployeeSort, PaginationInput, EmployeeConnection, UserRole } from './types';
import { GraphQLScalarType } from 'graphql';
export declare const resolvers: {
    Date: GraphQLScalarType<Date, string>;
    Query: {
        employees: (_: any, args: {
            filter?: EmployeeFilter;
            sort?: EmployeeSort;
            pagination?: PaginationInput;
        }, context: Context) => Promise<EmployeeConnection>;
        employee: (_: any, { id }: {
            id: string;
        }, context: Context) => Promise<Employee | null>;
        employeeByEmployeeId: (_: any, { employeeId }: {
            employeeId: string;
        }, context: Context) => Promise<Employee | null>;
        users: (_: any, __: any, context: Context) => Promise<User[]>;
        me: (_: any, __: any, context: Context) => Promise<User | null>;
        employeeStats: (_: any, __: any, context: Context) => Promise<{
            totalEmployees: number;
            activeEmployees: number;
            departmentBreakdown: {
                department: string;
                count: number;
                averageAge: number;
                averageSalary: number;
            }[];
            averageAge: number;
            averageAttendance: number;
        }>;
    };
    Mutation: {
        login: (_: any, { input }: {
            input: {
                email: string;
                password: string;
            };
        }) => Promise<{
            token: string;
            user: User;
        }>;
        register: (_: any, { input }: {
            input: {
                email: string;
                password: string;
                role: UserRole;
                employeeId?: string;
            };
        }, context: Context) => Promise<{
            token: string;
            user: User;
        }>;
        createEmployee: (_: any, { input }: {
            input: any;
        }, context: Context) => Promise<Employee>;
        updateEmployee: (_: any, { id, input }: {
            id: string;
            input: any;
        }, context: Context) => Promise<Employee>;
        deleteEmployee: (_: any, { id }: {
            id: string;
        }, context: Context) => Promise<boolean>;
        updateMyProfile: (_: any, { input }: {
            input: {
                subjects?: string[];
                email?: string;
            };
        }, context: Context) => Promise<Employee>;
    };
    User: {
        employee: (user: User) => Promise<Employee | null>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map