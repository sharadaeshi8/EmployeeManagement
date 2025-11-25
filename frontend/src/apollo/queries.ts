import { gql } from '@apollo/client';

// Employee Fragments
export const EMPLOYEE_FRAGMENT = gql`
  fragment EmployeeFragment on Employee {
    id
    employeeId
    name
    age
    class
    subjects
    attendance
    email
    department
    position
    salary
    hireDate
    isActive
    createdAt
    updatedAt
  }
`;

export const EMPLOYEE_BASIC_FRAGMENT = gql`
  fragment EmployeeBasicFragment on Employee {
    id
    employeeId
    name
    age
    class
    subjects
    attendance
    email
    department
    position
    salary
    isActive
  }
`;

// User Fragments
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    role
    employeeId
    createdAt
    updatedAt
  }
`;

// Queries
export const GET_EMPLOYEES = gql`
  ${EMPLOYEE_BASIC_FRAGMENT}
  query GetEmployees(
    $filter: EmployeeFilter
    $sort: EmployeeSort
    $pagination: PaginationInput
  ) {
    employees(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...EmployeeBasicFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      ...EmployeeFragment
    }
  }
`;

export const GET_EMPLOYEE_BY_EMPLOYEE_ID = gql`
  ${EMPLOYEE_FRAGMENT}
  query GetEmployeeByEmployeeId($employeeId: String!) {
    employeeByEmployeeId(employeeId: $employeeId) {
      ...EmployeeFragment
    }
  }
`;

export const GET_ME = gql`
  ${USER_FRAGMENT}
  query GetMe {
    me {
      ...UserFragment
      employee {
        id
        name
        employeeId
        department
        position
      }
    }
  }
`;

export const GET_EMPLOYEE_STATS = gql`
  query GetEmployeeStats {
    employeeStats {
      totalEmployees
      activeEmployees
      averageAge
      averageAttendance
      departmentBreakdown {
        department
        count
        averageAge
        averageSalary
      }
    }
  }
`;

// Mutations
export const LOGIN = gql`
  ${USER_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFragment
      }
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      ...EmployeeFragment
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
      ...EmployeeFragment
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const UPDATE_MY_PROFILE = gql`
  ${EMPLOYEE_FRAGMENT}
  mutation UpdateMyProfile($input: EmployeeSelfUpdateInput!) {
    updateMyProfile(input: $input) {
      ...EmployeeFragment
    }
  }
`;