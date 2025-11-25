import {
  Employee,
  User,
  Context,
  EmployeeFilter,
  EmployeeSort,
  PaginationInput,
  EmployeeConnection,
  EmployeeEdge,
  PageInfo,
  UserRole,
  EmployeeSortField,
  SortDirection,
} from "./types";
import { db } from "./database";
import { generateToken, comparePassword, hashPassword } from "./auth";
import { GraphQLError } from "graphql";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

// Date scalar resolver
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value: any) {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("GraphQL Date Scalar parser expected a `string`");
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error("GraphQL Date Scalar parser expected a `string`");
  },
});

// Helper functions
const applySorting = (employees: Employee[], sort?: EmployeeSort): Employee[] => {
  if (!sort) return employees;

  return [...employees].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case EmployeeSortField.NAME:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case EmployeeSortField.AGE:
        aValue = a.age;
        bValue = b.age;
        break;
      case EmployeeSortField.HIRE_DATE:
        aValue = a.hireDate.getTime();
        bValue = b.hireDate.getTime();
        break;
      case EmployeeSortField.DEPARTMENT:
        aValue = a.department.toLowerCase();
        bValue = b.department.toLowerCase();
        break;
      case EmployeeSortField.ATTENDANCE:
        aValue = parseInt(a.attendance.replace("%", ""));
        bValue = parseInt(b.attendance.replace("%", ""));
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sort.direction === SortDirection.ASC ? -1 : 1;
    }
    if (aValue > bValue) {
      return sort.direction === SortDirection.ASC ? 1 : -1;
    }
    return 0;
  });
};

const applyFiltering = (employees: Employee[], filter?: EmployeeFilter): Employee[] => {
  if (!filter) return employees;

  return employees.filter((employee) => {
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

const applyPagination = (employees: Employee[], pagination?: PaginationInput): EmployeeConnection => {
  const totalCount = employees.length;

  if (!pagination) {
    const edges: EmployeeEdge[] = employees.map((employee, index) => ({
      node: employee,
      cursor: Buffer.from(`${index}`).toString("base64"),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount,
    };
  }

  const { first = 10, after, last, before } = pagination;

  let startIndex = 0;
  let endIndex = employees.length;

  if (after) {
    const afterIndex = parseInt(Buffer.from(after, "base64").toString());
    startIndex = afterIndex + 1;
  }

  if (before) {
    const beforeIndex = parseInt(Buffer.from(before, "base64").toString());
    endIndex = beforeIndex;
  }

  if (first) {
    endIndex = Math.min(startIndex + first, endIndex);
  }

  if (last) {
    startIndex = Math.max(endIndex - last, startIndex);
  }

  const paginatedEmployees = employees.slice(startIndex, endIndex);

  const edges: EmployeeEdge[] = paginatedEmployees.map((employee, index) => ({
    node: employee,
    cursor: Buffer.from(`${startIndex + index}`).toString("base64"),
  }));

  const pageInfo: PageInfo = {
    hasNextPage: endIndex < employees.length,
    hasPreviousPage: startIndex > 0,
    startCursor: edges[0]?.cursor,
    endCursor: edges[edges.length - 1]?.cursor,
  };

  return {
    edges,
    pageInfo,
    totalCount,
  };
};

const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new GraphQLError("You must be logged in to perform this action", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
};

const requireAdmin = (context: Context) => {
  const user = requireAuth(context);
  if (user.role !== UserRole.ADMIN) {
    throw new GraphQLError("You must be an admin to perform this action", {
      extensions: { code: "FORBIDDEN" },
    });
  }
  return user;
};

export const resolvers = {
  Date: DateScalar,
  EmployeeSortField,
  SortDirection,

  Query: {
    employees: async (
      _: any,
      args: {
        filter?: EmployeeFilter;
        sort?: EmployeeSort;
        pagination?: PaginationInput;
      },
      context: Context
    ): Promise<EmployeeConnection> => {
      requireAuth(context);

      let employees = db.getAllEmployees();
      employees = applyFiltering(employees, args.filter);
      employees = applySorting(employees, args.sort);

      return applyPagination(employees, args.pagination);
    },

    employee: async (_: any, { id }: { id: string }, context: Context): Promise<Employee | null> => {
      requireAuth(context);
      return db.getEmployeeById(id) || null;
    },

    employeeByEmployeeId: async (_: any, { employeeId }: { employeeId: string }, context: Context): Promise<Employee | null> => {
      requireAuth(context);
      return db.getEmployeeByEmployeeId(employeeId) || null;
    },

    users: async (_: any, __: any, context: Context): Promise<User[]> => {
      requireAdmin(context);
      return db.getAllUsers();
    },

    me: async (_: any, __: any, context: Context): Promise<User | null> => {
      return context.user || null;
    },

    employeeStats: async (_: any, __: any, context: Context) => {
      requireAdmin(context);

      const employees = db.getAllEmployees();
      const activeEmployees = employees.filter((emp) => emp.isActive);

      // Department breakdown
      const departmentMap = new Map<string, { count: number; totalAge: number; totalSalary: number }>();

      employees.forEach((emp) => {
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
        averageSalary: stats.totalSalary / stats.count,
      }));

      // Calculate averages
      const totalAge = employees.reduce((sum, emp) => sum + emp.age, 0);
      const averageAge = totalAge / employees.length;

      const totalAttendance = employees.reduce((sum, emp) => {
        return sum + parseInt(emp.attendance.replace("%", ""));
      }, 0);
      const averageAttendance = totalAttendance / employees.length;

      return {
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        departmentBreakdown,
        averageAge,
        averageAttendance,
      };
    },
  },

  Mutation: {
    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      const { email, password } = input;

      const user = db.getUserByEmail(email);
      if (!user) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    register: async (_: any, { input }: { input: { email: string; password: string; role: UserRole; employeeId?: string } }, context: Context) => {
      requireAdmin(context);

      const { email, password, role, employeeId } = input;

      // Check if user already exists
      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        throw new GraphQLError("User with this email already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // If registering an employee, validate employeeId
      if (role === UserRole.EMPLOYEE && employeeId) {
        const employee = db.getEmployeeById(employeeId);
        if (!employee) {
          throw new GraphQLError("Employee not found", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
      }

      const hashedPassword = await hashPassword(password);

      const user = db.addUser({
        email,
        password: hashedPassword,
        role,
        ...(employeeId && { employeeId }),
      });

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    createEmployee: async (_: any, { input }: { input: any }, context: Context): Promise<Employee> => {
      requireAdmin(context);

      // Check if employeeId is unique
      const existing = db.getEmployeeByEmployeeId(input.employeeId);
      if (existing) {
        throw new GraphQLError("Employee ID already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const employee = db.addEmployee({
        employeeId: input.employeeId,
        name: input.name,
        age: input.age,
        class: input.class,
        subjects: input.subjects,
        attendance: "100%",
        email: input.email,
        department: input.department,
        position: input.position,
        salary: input.salary,
        hireDate: new Date(),
        isActive: input.isActive !== undefined ? input.isActive : true,
      });
      return employee;
    },

    updateEmployee: async (_: any, { id, input }: { id: string; input: any }, context: Context): Promise<Employee> => {
      requireAdmin(context);

      const employee = db.updateEmployee(id, input);
      if (!employee) {
        throw new GraphQLError("Employee not found", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return employee;
    },

    deleteEmployee: async (_: any, { id }: { id: string }, context: Context): Promise<boolean> => {
      requireAdmin(context);

      return db.deleteEmployee(id);
    },

    updateMyProfile: async (_: any, { input }: { input: { subjects?: string[]; email?: string } }, context: Context): Promise<Employee> => {
      const user = requireAuth(context);

      if (!user.employeeId) {
        throw new GraphQLError("Only employees can update their profile", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const employee = db.updateEmployee(user.employeeId, input);
      if (!employee) {
        throw new GraphQLError("Employee profile not found", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return employee;
    },
  },

  User: {
    employee: async (user: User): Promise<Employee | null> => {
      if (!user.employeeId) return null;
      return db.getEmployeeById(user.employeeId) || null;
    },
  },
};
