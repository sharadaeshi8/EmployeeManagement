import DataLoader from "dataloader";
import { Employee, User } from "./types";
import { db } from "./database";

// DataLoader for batching employee queries
export const employeeLoader = new DataLoader<string, Employee | null>(
  async (ids: readonly string[]) => {
    const employees = db.getAllEmployees();
    const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

    return ids.map((id) => employeeMap.get(id) || null);
  },
  {
    // Cache results for 5 minutes
    cacheKeyFn: (key) => key,
    batchScheduleFn: (callback) => setTimeout(callback, 10),
  }
);

// DataLoader for user queries
export const userLoader = new DataLoader<string, User | null>(async (ids: readonly string[]) => {
  const users = db.getAllUsers();
  const userMap = new Map(users.map((user) => [user.id, user]));

  return ids.map((id) => userMap.get(id) || null);
});

// Department statistics loader
export const departmentStatsLoader = new DataLoader<string, any>(async (departments: readonly string[]) => {
  const employees = db.getAllEmployees();

  return departments.map((dept) => {
    const deptEmployees = employees.filter((emp) => emp.department === dept);
    const totalAge = deptEmployees.reduce((sum, emp) => sum + emp.age, 0);
    const totalSalary = deptEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

    return {
      department: dept,
      count: deptEmployees.length,
      averageAge: deptEmployees.length > 0 ? totalAge / deptEmployees.length : 0,
      averageSalary: deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0,
    };
  });
});

// Create data loaders for each request context
export const createDataLoaders = () => ({
  employeeLoader: new DataLoader<string, Employee | null>(async (ids: readonly string[]) => {
    const employees = db.getAllEmployees();
    const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));
    return ids.map((id) => employeeMap.get(id) || null);
  }),
  userLoader: new DataLoader<string, User | null>(async (ids: readonly string[]) => {
    const users = db.getAllUsers();
    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => userMap.get(id) || null);
  }),
  departmentStatsLoader: new DataLoader<string, any>(async (departments: readonly string[]) => {
    const employees = db.getAllEmployees();

    return departments.map((dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept);
      const totalAge = deptEmployees.reduce((sum, emp) => sum + emp.age, 0);
      const totalSalary = deptEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

      return {
        department: dept,
        count: deptEmployees.length,
        averageAge: deptEmployees.length > 0 ? totalAge / deptEmployees.length : 0,
        averageSalary: deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0,
      };
    });
  }),
});
