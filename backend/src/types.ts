export interface Employee {
  id: string;
  employeeId: string; // EMP0001 format
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: string;
  email: string;
  department: string;
  position: string;
  salary?: number;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  employeeId?: string; // Links to Employee if role is EMPLOYEE
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface PaginationInput {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface EmployeeFilter {
  name?: string;
  department?: string;
  class?: string;
  isActive?: boolean;
  ageRange?: {
    min?: number;
    max?: number;
  };
}

export interface EmployeeSort {
  field: EmployeeSortField;
  direction: SortDirection;
}

export enum EmployeeSortField {
  NAME = "name",
  AGE = "age",
  HIRE_DATE = "hireDate",
  DEPARTMENT = "department",
  ATTENDANCE = "attendance",
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface EmployeeEdge {
  node: Employee;
  cursor: string;
}

export interface EmployeeConnection {
  edges: EmployeeEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface Context {
  user?: User;
  dataSources?: any;
}
