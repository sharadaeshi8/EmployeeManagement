// Employee data type
export interface Employee {
  id: string;
  ID: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: string;
  email?: string;
  department?: string;
  position?: string;
  salary?: number;
  isActive?: boolean;
}

// Menu item types
export interface MenuItem {
  id: string;
  label: string;
  subMenu: SubMenuItem[] | null;
}

export interface SubMenuItem {
  id: string;
  label: string;
}

// Component prop types
export interface EmployeeGridProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onFlag?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => Promise<void>;
}

export interface EmployeeTileProps {
  employee: Employee;
  onEmployeeClick: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onFlag?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => Promise<void>;
}

export interface EmployeeTileViewProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onFlag?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => Promise<void>;
}

export interface EmployeeDetailProps {
  employee: Employee | null;
  onClose: () => void;
}
