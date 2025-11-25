"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const types_1 = require("./types");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class Database {
    constructor() {
        this.employees = [];
        this.users = [];
        this.initializeSampleData();
    }
    async initializeSampleData() {
        const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
        this.users.push({
            id: (0, uuid_1.v4)(),
            email: 'admin@company.com',
            password: adminPassword,
            role: types_1.UserRole.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const sampleEmployees = [
            {
                name: 'John Smith',
                age: 32,
                class: 'Senior Level',
                subjects: ['JavaScript', 'React', 'Node.js'],
                department: 'Engineering',
                position: 'Senior Software Engineer',
                email: 'john.smith@company.com',
                salary: 95000
            },
            {
                name: 'Sarah Johnson',
                age: 28,
                class: 'Mid Level',
                subjects: ['Python', 'Django', 'PostgreSQL'],
                department: 'Engineering',
                position: 'Software Engineer',
                email: 'sarah.johnson@company.com',
                salary: 75000
            },
            {
                name: 'Michael Brown',
                age: 35,
                class: 'Senior Level',
                subjects: ['Project Management', 'Agile', 'Scrum'],
                department: 'Management',
                position: 'Project Manager',
                email: 'michael.brown@company.com',
                salary: 85000
            },
            {
                name: 'Emily Davis',
                age: 29,
                class: 'Mid Level',
                subjects: ['UX Design', 'Figma', 'User Research'],
                department: 'Design',
                position: 'UX Designer',
                email: 'emily.davis@company.com',
                salary: 70000
            },
            {
                name: 'David Wilson',
                age: 26,
                class: 'Junior Level',
                subjects: ['HTML', 'CSS', 'JavaScript'],
                department: 'Engineering',
                position: 'Frontend Developer',
                email: 'david.wilson@company.com',
                salary: 60000
            },
            {
                name: 'Lisa Anderson',
                age: 31,
                class: 'Senior Level',
                subjects: ['Marketing', 'SEO', 'Content Strategy'],
                department: 'Marketing',
                position: 'Marketing Manager',
                email: 'lisa.anderson@company.com',
                salary: 80000
            },
            {
                name: 'Robert Taylor',
                age: 27,
                class: 'Mid Level',
                subjects: ['Java', 'Spring Boot', 'MySQL'],
                department: 'Engineering',
                position: 'Backend Developer',
                email: 'robert.taylor@company.com',
                salary: 72000
            },
            {
                name: 'Jennifer Martinez',
                age: 33,
                class: 'Senior Level',
                subjects: ['Sales', 'Customer Relations', 'CRM'],
                department: 'Sales',
                position: 'Sales Manager',
                email: 'jennifer.martinez@company.com',
                salary: 88000
            },
            {
                name: 'Christopher Lee',
                age: 24,
                class: 'Junior Level',
                subjects: ['Data Analysis', 'Excel', 'SQL'],
                department: 'Analytics',
                position: 'Data Analyst',
                email: 'christopher.lee@company.com',
                salary: 55000
            },
            {
                name: 'Amanda Garcia',
                age: 30,
                class: 'Mid Level',
                subjects: ['HR Management', 'Recruitment', 'Employee Relations'],
                department: 'Human Resources',
                position: 'HR Specialist',
                email: 'amanda.garcia@company.com',
                salary: 65000
            }
        ];
        for (let i = 0; i < sampleEmployees.length; i++) {
            const sample = sampleEmployees[i];
            const employee = {
                id: (0, uuid_1.v4)(),
                employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
                name: sample.name,
                age: sample.age,
                class: sample.class,
                subjects: sample.subjects,
                attendance: `${Math.floor(Math.random() * 20 + 80)}%`,
                email: sample.email,
                department: sample.department,
                position: sample.position,
                salary: sample.salary,
                hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            this.employees.push(employee);
            const employeePassword = await bcryptjs_1.default.hash('employee123', 10);
            this.users.push({
                id: (0, uuid_1.v4)(),
                email: sample.email,
                password: employeePassword,
                role: types_1.UserRole.EMPLOYEE,
                employeeId: employee.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }
    getAllEmployees() {
        return [...this.employees];
    }
    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id);
    }
    getEmployeeByEmployeeId(employeeId) {
        return this.employees.find(emp => emp.employeeId === employeeId);
    }
    addEmployee(employeeData) {
        const employee = {
            ...employeeData,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.employees.push(employee);
        return employee;
    }
    updateEmployee(id, updates) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1)
            return null;
        this.employees[index] = {
            ...this.employees[index],
            ...updates,
            updatedAt: new Date()
        };
        return this.employees[index];
    }
    deleteEmployee(id) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1)
            return false;
        this.employees.splice(index, 1);
        return true;
    }
    getAllUsers() {
        return [...this.users];
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }
    addUser(userData) {
        const user = {
            ...userData,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(user);
        return user;
    }
}
exports.db = new Database();
//# sourceMappingURL=database.js.map