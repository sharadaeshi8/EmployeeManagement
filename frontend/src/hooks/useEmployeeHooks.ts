import { useQuery, useMutation } from "@apollo/client";
import { GET_EMPLOYEES, GET_EMPLOYEE, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE, GET_EMPLOYEE_STATS } from "../apollo/queries";
import { Employee } from "../types";

export const useEmployees = (options?: { filter?: any; sort?: any; pagination?: any; skip?: boolean }) => {
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      filter: options?.filter,
      sort: options?.sort || { field: "NAME", direction: "ASC" },
      pagination: options?.pagination || { first: 50 },
    },
    skip: options?.skip,
    fetchPolicy: "cache-and-network", // Ensure we get fresh data but show cache first
  });

  const employees: Employee[] = data?.employees?.edges.map((edge: any) => ({
    id: edge.node.id,
    ID: edge.node.employeeId,
    name: edge.node.name,
    age: edge.node.age,
    class: edge.node.class,
    subjects: edge.node.subjects,
    attendance: edge.node.attendance,
    email: edge.node.email || "",
    department: edge.node.department,
    position: edge.node.position,
    isActive: edge.node.isActive,
    salary: edge.node.salary,
  })) || [];

  const totalCount = data?.employees?.totalCount || 0;
  const pageInfo = data?.employees?.pageInfo || { hasNextPage: false, hasPreviousPage: false };

  return { employees, loading, error, refetch, totalCount, pageInfo };
};

export const useEmployee = (id: string) => {
  const { data, loading, error } = useQuery(GET_EMPLOYEE, {
    variables: { id },
    skip: !id,
  });

  const employee: Employee | null = data?.employee ? {
    id: data.employee.id,
    ID: data.employee.employeeId,
    name: data.employee.name,
    age: data.employee.age,
    class: data.employee.class,
    subjects: data.employee.subjects,
    attendance: data.employee.attendance,
    email: data.employee.email,
    department: data.employee.department,
    position: data.employee.position,
  } : null;

  return { employee, loading, error };
};

export const useCreateEmployee = () => {
  const [createEmployeeMutation, { loading, error }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: ["GetEmployees"], // Refetch list after creation
  });

  const createEmployee = async (employeeData: Partial<Employee>) => {
    const { data } = await createEmployeeMutation({
      variables: {
        input: {
          employeeId: employeeData.ID,
          name: employeeData.name,
          age: employeeData.age,
          class: employeeData.class,
          subjects: employeeData.subjects,
          email: employeeData.email || `${employeeData.name?.toLowerCase().replace(" ", ".")}@company.com`,
          department: employeeData.department || "General",
          position: employeeData.position || "Employee",
          salary: employeeData.salary,
          isActive: employeeData.isActive ?? true,
        },
      },
    });
    return data?.createEmployee;
  };

  return { createEmployee, loading, error };
};

export const useUpdateEmployee = () => {
  const [updateEmployeeMutation, { loading, error }] = useMutation(UPDATE_EMPLOYEE);

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const { data } = await updateEmployeeMutation({
      variables: {
        id,
        input: {
          name: updates.name,
          age: updates.age,
          class: updates.class,
          subjects: updates.subjects,
          email: updates.email,
          department: updates.department,
          position: updates.position,
          salary: updates.salary,
          isActive: updates.isActive,
        },
      },
    });
    return data?.updateEmployee;
  };

  return { updateEmployee, loading, error };
};

export const useDeleteEmployee = () => {
  const [deleteEmployeeMutation, { loading, error }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: ["GetEmployees"],
  });

  const deleteEmployee = async (id: string) => {
    const { data } = await deleteEmployeeMutation({
      variables: { id },
      update(cache) {
        // Optimistic update or cache eviction
        const normalizedId = cache.identify({ id, __typename: 'Employee' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    });
    return data?.deleteEmployee;
  };

  return { deleteEmployee, loading, error };
};

export const useEmployeeStats = () => {
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEE_STATS, {
    fetchPolicy: "cache-and-network",
  });

  return { stats: data?.employeeStats, loading, error, refetch };
};
