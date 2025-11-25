import { Employee, User, UserRole } from "./types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// In-memory database simulation
class Database {
  private employees: Employee[] = [];
  private users: User[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    this.users.push({
      id: uuidv4(),
      email: "admin@company.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample employee data
    const sampleEmployees = [
      {
        name: "John Smith",
        age: 32,
        class: "Senior Level",
        subjects: ["JavaScript", "React", "Node.js"],
        department: "Engineering",
        position: "Senior Software Engineer",
        email: "john.smith@company.com",
        salary: 95000,
      },
      {
        name: "Sarah Johnson",
        age: 28,
        class: "Mid Level",
        subjects: ["Python", "Django", "PostgreSQL"],
        department: "Engineering",
        position: "Software Engineer",
        email: "sarah.johnson@company.com",
        salary: 75000,
      },
      {
        name: "Michael Brown",
        age: 35,
        class: "Senior Level",
        subjects: ["Project Management", "Agile", "Scrum"],
        department: "Management",
        position: "Project Manager",
        email: "michael.brown@company.com",
        salary: 85000,
      },
      {
        name: "Emily Davis",
        age: 29,
        class: "Mid Level",
        subjects: ["UX Design", "Figma", "User Research"],
        department: "Design",
        position: "UX Designer",
        email: "emily.davis@company.com",
        salary: 70000,
      },
      {
        name: "David Wilson",
        age: 26,
        class: "Junior Level",
        subjects: ["HTML", "CSS", "JavaScript"],
        department: "Engineering",
        position: "Frontend Developer",
        email: "david.wilson@company.com",
        salary: 60000,
      },
      {
        name: "Lisa Anderson",
        age: 31,
        class: "Senior Level",
        subjects: ["Marketing", "SEO", "Content Strategy"],
        department: "Marketing",
        position: "Marketing Manager",
        email: "lisa.anderson@company.com",
        salary: 80000,
      },
      {
        name: "Robert Taylor",
        age: 27,
        class: "Mid Level",
        subjects: ["Java", "Spring Boot", "MySQL"],
        department: "Engineering",
        position: "Backend Developer",
        email: "robert.taylor@company.com",
        salary: 72000,
      },
      {
        name: "Jennifer Martinez",
        age: 33,
        class: "Senior Level",
        subjects: ["Sales", "Customer Relations", "CRM"],
        department: "Sales",
        position: "Sales Manager",
        email: "jennifer.martinez@company.com",
        salary: 88000,
      },
      {
        name: "Christopher Lee",
        age: 24,
        class: "Junior Level",
        subjects: ["Data Analysis", "Excel", "SQL"],
        department: "Analytics",
        position: "Data Analyst",
        email: "christopher.lee@company.com",
        salary: 55000,
      },
      {
        name: "Amanda Garcia",
        age: 30,
        class: "Mid Level",
        subjects: ["HR Management", "Recruitment", "Employee Relations"],
        department: "Human Resources",
        position: "HR Specialist",
        email: "amanda.garcia@company.com",
        salary: 65000,
      },
    ];

    // Generate employees with calculated attendance
    for (let i = 0; i < sampleEmployees.length; i++) {
      const sample = sampleEmployees[i]!;
      const employee: Employee = {
        id: uuidv4(),
        employeeId: `EMP${String(i + 1).padStart(4, "0")}`,
        name: sample.name,
        age: sample.age,
        class: sample.class,
        subjects: sample.subjects,
        attendance: `${Math.floor(Math.random() * 20 + 80)}%`,
        email: sample.email,
        department: sample.department,
        position: sample.position,
        salary: sample.salary,
        hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3), // Random date within last 3 years
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.employees.push(employee);

      // Create employee user account
      const employeePassword = await bcrypt.hash("employee123", 10);
      this.users.push({
        id: uuidv4(),
        email: sample.email,
        password: employeePassword,
        role: UserRole.EMPLOYEE,
        employeeId: employee.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // Employee CRUD operations
  getAllEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((emp) => emp.id === id);
  }

  getEmployeeByEmployeeId(employeeId: string): Employee | undefined {
    return this.employees.find((emp) => emp.employeeId === employeeId);
  }

  addEmployee(employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">): Employee {
    const employee: Employee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.employees.push(employee);
    return employee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index === -1) return null;

    this.employees[index] = {
      ...this.employees[index]!,
      ...updates,
      updatedAt: new Date(),
    };
    return this.employees[index]!;
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index === -1) return false;

    this.employees.splice(index, 1);
    return true;
  }

  // User operations
  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}

export const db = new Database();
