"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const types_1 = require("./types");
const database_1 = require("./database");
const auth_1 = require("./auth");
const graphql_1 = require("graphql");
const graphql_2 = require("graphql");
const language_1 = require("graphql/language");
const DateScalar = new graphql_2.GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'string') {
            return new Date(value);
        }
        throw new Error('GraphQL Date Scalar parser expected a `string`');
    },
    parseLiteral(ast) {
        if (ast.kind === language_1.Kind.STRING) {
            return new Date(ast.value);
        }
        throw new Error('GraphQL Date Scalar parser expected a `string`');
    }
});
const applySorting = (employees, sort) => {
    if (!sort)
        return employees;
    return [...employees].sort((a, b) => {
        let aValue;
        let bValue;
        switch (sort.field) {
            case types_1.EmployeeSortField.NAME:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case types_1.EmployeeSortField.AGE:
                aValue = a.age;
                bValue = b.age;
                break;
            case types_1.EmployeeSortField.HIRE_DATE:
                aValue = a.hireDate.getTime();
                bValue = b.hireDate.getTime();
                break;
            case types_1.EmployeeSortField.DEPARTMENT:
                aValue = a.department.toLowerCase();
                bValue = b.department.toLowerCase();
                break;
            case types_1.EmployeeSortField.ATTENDANCE:
                aValue = parseInt(a.attendance.replace('%', ''));
                bValue = parseInt(b.attendance.replace('%', ''));
                break;
            default:
                return 0;
        }
        if (aValue < bValue) {
            return sort.direction === types_1.SortDirection.ASC ? -1 : 1;
        }
        if (aValue > bValue) {
            return sort.direction === types_1.SortDirection.ASC ? 1 : -1;
        }
        return 0;
    });
};
const applyFiltering = (employees, filter) => {
    if (!filter)
        return employees;
    return employees.filter(employee => {
        if (filter.name && !employee.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }
        if (filter.department && !employee.department.toLowerCase().includes(filter.department.toLowerCase())) {
            return false;
        }
        if (filter.class && employee.class !== filter.class) {
            return false;
        }
        if (filter.isActive !== undefined && employee.isActive !== filter.isActive) {
            return false;
        }
        if (filter.ageRange) {
            if (filter.ageRange.min !== undefined && employee.age < filter.ageRange.min) {
                return false;
            }
            if (filter.ageRange.max !== undefined && employee.age > filter.ageRange.max) {
                return false;
            }
        }
        return true;
    });
};
const applyPagination = (employees, pagination) => {
    const totalCount = employees.length;
    if (!pagination) {
        const edges = employees.map((employee, index) => ({
            node: employee,
            cursor: Buffer.from(`${index}`).toString('base64')
        }));
        return {
            edges,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: edges[0]?.cursor,
                endCursor: edges[edges.length - 1]?.cursor
            },
            totalCount
        };
    }
    const { first = 10, after, last, before } = pagination;
    let startIndex = 0;
    let endIndex = employees.length;
    if (after) {
        const afterIndex = parseInt(Buffer.from(after, 'base64').toString());
        startIndex = afterIndex + 1;
    }
    if (before) {
        const beforeIndex = parseInt(Buffer.from(before, 'base64').toString());
        endIndex = beforeIndex;
    }
    if (first) {
        endIndex = Math.min(startIndex + first, endIndex);
    }
    if (last) {
        startIndex = Math.max(endIndex - last, startIndex);
    }
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    const edges = paginatedEmployees.map((employee, index) => ({
        node: employee,
        cursor: Buffer.from(`${startIndex + index}`).toString('base64')
    }));
    const pageInfo = {
        hasNextPage: endIndex < employees.length,
        hasPreviousPage: startIndex > 0,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor
    };
    return {
        edges,
        pageInfo,
        totalCount
    };
};
const requireAuth = (context) => {
    if (!context.user) {
        throw new graphql_1.GraphQLError('You must be logged in to perform this action', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    return context.user;
};
const requireAdmin = (context) => {
    const user = requireAuth(context);
    if (user.role !== types_1.UserRole.ADMIN) {
        throw new graphql_1.GraphQLError('You must be an admin to perform this action', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return user;
};
exports.resolvers = {
    Date: DateScalar,
    Query: {
        employees: async (_, args, context) => {
            requireAuth(context);
            let employees = database_1.db.getAllEmployees();
            employees = applyFiltering(employees, args.filter);
            employees = applySorting(employees, args.sort);
            return applyPagination(employees, args.pagination);
        },
        employee: async (_, { id }, context) => {
            requireAuth(context);
            return database_1.db.getEmployeeById(id) || null;
        },
        employeeByEmployeeId: async (_, { employeeId }, context) => {
            requireAuth(context);
            return database_1.db.getEmployeeByEmployeeId(employeeId) || null;
        },
        users: async (_, __, context) => {
            requireAdmin(context);
            return database_1.db.getAllUsers();
        },
        me: async (_, __, context) => {
            return context.user || null;
        },
        employeeStats: async (_, __, context) => {
            requireAdmin(context);
            const employees = database_1.db.getAllEmployees();
            const activeEmployees = employees.filter(emp => emp.isActive);
            const departmentMap = new Map();
            employees.forEach(emp => {
                const dept = departmentMap.get(emp.department) || { count: 0, totalAge: 0, totalSalary: 0 };
                dept.count++;
                dept.totalAge += emp.age;
                dept.totalSalary += emp.salary || 0;
                departmentMap.set(emp.department, dept);
            });
            const departmentBreakdown = Array.from(departmentMap.entries()).map(([department, stats]) => ({
                department,
                count: stats.count,
                averageAge: stats.totalAge / stats.count,
                averageSalary: stats.totalSalary / stats.count
            }));
            const totalAge = employees.reduce((sum, emp) => sum + emp.age, 0);
            const averageAge = totalAge / employees.length;
            const totalAttendance = employees.reduce((sum, emp) => {
                return sum + parseInt(emp.attendance.replace('%', ''));
            }, 0);
            const averageAttendance = totalAttendance / employees.length;
            return {
                totalEmployees: employees.length,
                activeEmployees: activeEmployees.length,
                departmentBreakdown,
                averageAge,
                averageAttendance
            };
        }
    },
    Mutation: {
        login: async (_, { input }) => {
            const { email, password } = input;
            const user = database_1.db.getUserByEmail(email);
            if (!user) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const isValidPassword = await (0, auth_1.comparePassword)(password, user.password);
            if (!isValidPassword) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const token = (0, auth_1.generateToken)(user);
            return {
                token,
                user
            };
        },
        register: async (_, { input }, context) => {
            requireAdmin(context);
            const { email, password, role, employeeId } = input;
            const existingUser = database_1.db.getUserByEmail(email);
            if (existingUser) {
                throw new graphql_1.GraphQLError('User with this email already exists', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }
            if (role === types_1.UserRole.EMPLOYEE && employeeId) {
                const employee = database_1.db.getEmployeeById(employeeId);
                if (!employee) {
                    throw new graphql_1.GraphQLError('Employee not found', {
                        extensions: { code: 'BAD_USER_INPUT' }
                    });
                }
            }
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            const user = database_1.db.addUser({
                email,
                password: hashedPassword,
                role,
                ...(employeeId && { employeeId })
            });
            const token = (0, auth_1.generateToken)(user);
            return {
                token,
                user
            };
        },
        createEmployee: async (_, { input }, context) => {
            requireAdmin(context);
            const existing = database_1.db.getEmployeeByEmployeeId(input.employeeId);
            if (existing) {
                throw new graphql_1.GraphQLError('Employee ID already exists', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }
            const employee = database_1.db.addEmployee({
                ...input,
                attendance: '100%',
                hireDate: new Date()
            });
            return employee;
        },
        updateEmployee: async (_, { id, input }, context) => {
            requireAdmin(context);
            const employee = database_1.db.updateEmployee(id, input);
            if (!employee) {
                throw new graphql_1.GraphQLError('Employee not found', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }
            return employee;
        },
        deleteEmployee: async (_, { id }, context) => {
            requireAdmin(context);
            return database_1.db.deleteEmployee(id);
        },
        updateMyProfile: async (_, { input }, context) => {
            const user = requireAuth(context);
            if (!user.employeeId) {
                throw new graphql_1.GraphQLError('Only employees can update their profile', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const employee = database_1.db.updateEmployee(user.employeeId, input);
            if (!employee) {
                throw new graphql_1.GraphQLError('Employee profile not found', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }
            return employee;
        }
    },
    User: {
        employee: async (user) => {
            if (!user.employeeId)
                return null;
            return database_1.db.getEmployeeById(user.employeeId) || null;
        }
    }
};
//# sourceMappingURL=resolvers.js.map