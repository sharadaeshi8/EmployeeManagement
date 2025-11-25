import { gql } from "graphql-tag";

export const typeDefs = gql`
  # Scalars
  scalar Date

  # Enums
  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  enum EmployeeSortField {
    NAME
    AGE
    HIRE_DATE
    DEPARTMENT
    ATTENDANCE
  }

  enum SortDirection {
    ASC
    DESC
  }

  # Types
  type Employee {
    id: ID!
    employeeId: String!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: String!
    email: String!
    department: String!
    position: String!
    salary: Float
    hireDate: Date!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
    employeeId: String
    employee: Employee
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type EmployeeEdge {
    node: Employee!
    cursor: String!
  }

  type EmployeeConnection {
    edges: [EmployeeEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  # Input Types
  input EmployeeInput {
    employeeId: String!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    email: String!
    department: String!
    position: String!
    salary: Float
    isActive: Boolean = true
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    class: String
    subjects: [String!]
    email: String
    department: String
    position: String
    salary: Float
    isActive: Boolean
  }

  input EmployeeFilter {
    name: String
    department: String
    class: String
    isActive: Boolean
    ageRange: AgeRangeInput
  }

  input AgeRangeInput {
    min: Int
    max: Int
  }

  input EmployeeSort {
    field: EmployeeSortField!
    direction: SortDirection!
  }

  input PaginationInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    role: UserRole!
    employeeId: String
  }

  # Queries
  type Query {
    # Employee queries
    employees(filter: EmployeeFilter, sort: EmployeeSort, pagination: PaginationInput): EmployeeConnection!

    employee(id: ID!): Employee

    employeeByEmployeeId(employeeId: String!): Employee

    # User queries (Admin only)
    users: [User!]! @auth(requires: ADMIN)

    me: User @auth(requires: USER)

    # Analytics queries
    employeeStats: EmployeeStats! @auth(requires: ADMIN)
  }

  # Mutations
  type Mutation {
    # Authentication
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload! @auth(requires: ADMIN)

    # Employee mutations
    createEmployee(input: EmployeeInput!): Employee! @auth(requires: ADMIN)

    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee! @auth(requires: ADMIN)

    deleteEmployee(id: ID!): Boolean! @auth(requires: ADMIN)

    # Employee self-update (limited fields)
    updateMyProfile(input: EmployeeSelfUpdateInput!): Employee! @auth(requires: USER)
  }

  # Additional types for analytics
  type EmployeeStats {
    totalEmployees: Int!
    activeEmployees: Int!
    departmentBreakdown: [DepartmentStats!]!
    averageAge: Float!
    averageAttendance: Float!
  }

  type DepartmentStats {
    department: String!
    count: Int!
    averageAge: Float!
    averageSalary: Float
  }

  input EmployeeSelfUpdateInput {
    subjects: [String!]
    email: String
  }

  # Directives
  directive @auth(requires: UserRole!) on FIELD_DEFINITION
`;
