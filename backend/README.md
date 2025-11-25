# Employee Management GraphQL Backend

A modern GraphQL API for employee management with authentication, authorization, and advanced querying capabilities.

## Features

-   **GraphQL API** with comprehensive schema.
-   **JWT Authentication** with role-based access control.
-   **Pagination & Sorting** for efficient data handling.
-   **Advanced Filtering** with multiple criteria (Department, Active Status).
-   **Salary Management**: Secure handling of salary data (Admin only).
-   **Type Safety** with TypeScript throughout.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

-   **GraphQL Playground**: `http://localhost:4000/graphql`
-   **Health Check**: `http://localhost:4000/health`

## Authentication

### Default Credentials

**Admin Account:**
-   Email: `admin@company.com`
-   Password: `admin123`

**Employee Accounts:**
-   Email: Any employee email (e.g., `john.smith@company.com`)
-   Password: `employee123`

### Usage

1.  **Login** to get JWT token:

```graphql
mutation Login {
  login(input: { email: "admin@company.com", password: "admin123" }) {
    token
    user {
      id
      email
      role
    }
  }
}
```

2.  **Include token** in requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Sample Queries

### Get Employees with Pagination

```graphql
query GetEmployees {
  employees(pagination: { first: 10 }, sort: { field: NAME, direction: ASC }, filter: { department: "Engineering" }) {
    edges {
      node {
        id
        name
        department
        position
        attendance
        salary # Only accessible if requested by Admin
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

### Create Employee (Admin only)

```graphql
mutation CreateEmployee {
  createEmployee(
    input: {
      employeeId: "EMP9999"
      name: "New Employee"
      age: 30
      class: "Mid Level"
      subjects: ["JavaScript", "React"]
      email: "new.employee@company.com"
      department: "Engineering"
      position: "Software Developer"
      salary: 75000
      isActive: true
    }
  ) {
    id
    name
    employeeId
    salary
  }
}
```

## Architecture

-   **Schema-First Design** with comprehensive type definitions.
-   **Resolver-based Architecture** for clean separation of concerns.
-   **Service Layer** with database abstraction.
-   **Middleware Pattern** for authentication and authorization.
-   **Error Handling** with detailed GraphQL error responses.

## Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
```
