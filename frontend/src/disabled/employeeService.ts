import { Employee } from "../types";
import { client } from "../apollo/client";
import { 
  GET_EMPLOYEES, 
  GET_EMPLOYEE, 
  LOGIN, 
  CREATE_EMPLOYEE, 
  UPDATE_EMPLOYEE, 
  DELETE_EMPLOYEE 
} from "../apollo/queries";

// Authentication
export const login = async (email: string, password: string) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: {
        input: { email, password }
      }
    });

    if (data?.login) {
      localStorage.setItem('authToken', data.login.token);
      return data.login.user;
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  // Reset Apollo cache
  client.resetStore();
};

// Employee operations
export const fetchEmployees = async (options?: {
  filter?: any;
  sort?: any;
  pagination?: any;
}): Promise<Employee[]> => {
  try {
    const { data } = await client.query({
      query: GET_EMPLOYEES,
      variables: {
        filter: options?.filter,
        sort: options?.sort || { field: 'NAME', direction: 'ASC' },
        pagination: options?.pagination || { first: 50 }
      },
      fetchPolicy: 'cache-and-network'
    });

    return data.employees.edges.map((edge: any) => ({
      id: edge.node.id,
      ID: edge.node.employeeId,
      name: edge.node.name,
      age: edge.node.age,
      class: edge.node.class,
      subjects: edge.node.subjects,
      attendance: edge.node.attendance,
      email: edge.node.email || '',
      department: edge.node.department,
      position: edge.node.position
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    // Fallback to mock data in case of GraphQL errors
    return getMockEmployees();
  }
};

export const fetchEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const { data } = await client.query({
      query: GET_EMPLOYEE,
      variables: { id }
    });

    if (data?.employee) {
      const emp = data.employee;
      return {
        id: emp.id,
        ID: emp.employeeId,
        name: emp.name,
        age: emp.age,
        class: emp.class,
        subjects: emp.subjects,
        attendance: emp.attendance,
        email: emp.email,
        department: emp.department,
        position: emp.position
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
};

export const createEmployee = async (employeeData: Partial<Employee>) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_EMPLOYEE,
      variables: {
        input: {
          employeeId: employeeData.ID,
          name: employeeData.name,
          age: employeeData.age,
          class: employeeData.class,
          subjects: employeeData.subjects,
          email: employeeData.email || `${employeeData.name?.toLowerCase().replace(' ', '.')}@company.com`,
          department: employeeData.department || 'General',
          position: employeeData.position || 'Employee'
        }
      },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });

    return data?.createEmployee;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (id: string, updates: Partial<Employee>) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id,
        input: {
          name: updates.name,
          age: updates.age,
          class: updates.class,
          subjects: updates.subjects,
          email: updates.email,
          department: updates.department,
          position: updates.position
        }
      },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });

    return data?.updateEmployee;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [{ query: GET_EMPLOYEES }]
    });

    return data?.deleteEmployee || false;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
};

// Fallback mock data function
const getMockEmployees = (): Employee[] => {
  return [
    {
      id: "1",
      ID: "EMP0001",
      name: "John Smith",
      age: 32,
      class: "Senior Level",
      subjects: ["JavaScript", "React", "Node.js"],
      attendance: "95%",
      email: "john.smith@company.com",
      department: "Engineering",
      position: "Senior Software Engineer"
    },
    {
      id: "2", 
      ID: "EMP0002",
      name: "Sarah Johnson",
      age: 28,
      class: "Mid Level", 
      subjects: ["Python", "Django", "PostgreSQL"],
      attendance: "92%",
      email: "sarah.johnson@company.com",
      department: "Engineering",
      position: "Software Engineer"
    }
  ];
};


