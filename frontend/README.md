# Employee Management Frontend

The frontend application for the Employee Management System, built with React and Apollo Client.

## Features

-   **Interactive UI**: Responsive design with Grid and Tile views.
-   **Real-time Data**: Powered by GraphQL subscriptions/queries.
-   **Authentication**: Secure login with role-based redirection.
-   **PDF Export**: Generate landscape PDF reports of employee data.
    -   *Note*: Salary columns are only visible to Admins in the PDF.
-   **Dynamic Filtering**: Filter by Department and Status without page reloads.

## Tech Stack

-   **React** (v18)
-   **TypeScript**
-   **Apollo Client**
-   **React Router Dom**
-   **Lucide React** (Icons)
-   **jsPDF** (PDF Generation)

## Installation & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm start
    ```
    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    Builds the app for production to the `build` folder.

## Environment Variables

Create a `.env` file in the root of the `frontend` directory if you need to customize the configuration:

```env
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

## Key Components

-   `App.tsx`: Main application layout and routing logic.
-   `EmployeeGrid.tsx`: Tabular view of employees.
-   `EmployeeTile.tsx`: Card view of employees.
-   `EmployeeForm.tsx`: Modal form for creating/editing employees.
-   `AuthContext.tsx`: Handles user authentication state.
