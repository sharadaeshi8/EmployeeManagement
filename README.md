# Employee Management System

A comprehensive full-stack application for managing employee records, featuring a modern React frontend and a robust GraphQL backend.

## Overview

The Employee Management System allows organizations to efficiently manage their workforce. It provides tools for adding, updating, and deleting employee records, visualizing data in different formats (Grid/Tile), and generating reports. The system includes role-based access control, ensuring that sensitive actions and data are restricted to authorized administrators.

## Features

-   **Role-Based Access Control (RBAC)**:
    -   **Admin**: Full access to Dashboard, Employee Management (Create, Edit, Delete), and Salary details.
    -   **Employee**: Read-only access to the Employee list (excluding sensitive data like Salary).
-   **Employee Management**:
    -   Create, Read, Update, and Delete (CRUD) operations.
    -   Flag employees for review.
    -   Track attendance, department, position, and skills.
-   **Advanced Visualization**:
    -   **Grid View**: Tabular representation for quick data scanning.
    -   **Tile View**: Card-based layout for a more visual experience.
-   **Search & Filtering**:
    -   Real-time search by name.
    -   Filter by Department and Active Status.
    -   Sort by various fields (Name, Age, etc.).
-   **Reporting**:
    -   Download filtered employee lists as PDF.
    -   Admin reports include salary details.
-   **Dashboard**:
    -   Visual statistics on employee distribution, attendance, and more (Admin only).

## Tech Stack

### Frontend
-   **React**: UI library for building interactive interfaces.
-   **Apollo Client**: State management and GraphQL data fetching.
-   **React Router**: Client-side routing.
-   **Lucide React**: Modern icon set.
-   **jsPDF & AutoTable**: PDF generation.
-   **CSS**: Custom styling for a polished look.

### Backend
-   **Node.js & Express**: Server runtime and framework.
-   **Apollo Server**: GraphQL server implementation.
-   **GraphQL**: Query language for flexible API interactions.
-   **TypeScript**: Type safety across the entire stack.
-   **In-Memory Database**: Simulated persistence for demonstration purposes.

## Prerequisites

-   **Node.js** (v14 or higher)
-   **npm** (v6 or higher)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd employee-management
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Start the backend server:
```bash
npm run dev
```
The backend will start at `http://localhost:4000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend application:
```bash
npm start
```
The application will open at `http://localhost:3000`.

## Project Structure

```
employee-management/
├── backend/                # Node.js + GraphQL Backend
│   ├── src/
│   │   ├── schema.ts       # GraphQL Type Definitions
│   │   ├── resolvers.ts    # API Logic & Resolvers
│   │   ├── database.ts     # Mock Database & Data Seeding
│   │   └── ...
│   └── ...
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # React Context (Auth, etc.)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── apollo/         # Apollo Client Setup
│   │   └── ...
│   └── ...
└── README.md               # Project Documentation
```

## Authentication

**Admin Credentials:**
-   Email: `admin@company.com`
-   Password: `admin123`

**Employee Credentials:**
-   Email: `john.smith@company.com`
-   Password: `employee123`
