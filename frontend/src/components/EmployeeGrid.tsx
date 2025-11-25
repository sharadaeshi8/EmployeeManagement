import React, { useState } from "react";
import { EmployeeGridProps, Employee } from "../types";
import { useAuth } from "../context/AuthContext";
import { MoreVertical, Edit, Flag, Trash2 } from "lucide-react";
import "./EmployeeGrid.css";

type AttendanceClass = "excellent" | "good" | "fair" | "poor";
type ActionType = "edit" | "flag" | "delete";

const getAttendanceClass = (attendance: string): AttendanceClass => {
  const percentage = parseInt(attendance);
  if (percentage >= 90) return "excellent";
  if (percentage >= 80) return "good";
  if (percentage >= 70) return "fair";
  return "poor";
};

interface Column {
  key: keyof Employee | "actions";
  label: string;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  onEmployeeClick,
  onEdit,
  onFlag,
  onDelete,
}) => {
  const { isAdmin } = useAuth();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const columns: Column[] = [
    { key: "ID", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "class", label: "Class" },
    { key: "department", label: "Department" },
    { key: "salary", label: "Salary" },
    { key: "isActive", label: "Status" },
    { key: "subjects", label: "Subjects" },
    { key: "attendance", label: "Attendance" },
    { key: "actions", label: "" },
  ];

  const handleMenuToggle = (e: React.MouseEvent, employeeId: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === employeeId ? null : employeeId);
  };

  const handleAction = (
    action: ActionType,
    e: React.MouseEvent,
    employee: Employee
  ) => {
    e.stopPropagation();
    setActiveMenuId(null);

    switch (action) {
      case "edit":
        onEdit && onEdit(employee);
        break;
      case "flag":
        onFlag && onFlag(employee);
        break;
      case "delete":
        onDelete && onDelete(employee);
        break;
      default:
        break;
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="employee-grid-container">
      <div className="grid-wrapper">
        <table className="employee-grid">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                onClick={() => onEmployeeClick(employee)}
                className="grid-row"
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.key === "actions" ? (
                      <div className="action-cell">
                        <button
                          className="menu-button"
                          onClick={(e) => handleMenuToggle(e, employee.id)}
                          aria-label="More options"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {activeMenuId === employee.id && (
                          <div
                            className="action-menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="action-item"
                              onClick={(e) => handleAction("edit", e, employee)}
                            >
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="action-item"
                              onClick={(e) => handleAction("flag", e, employee)}
                            >
                              <Flag size={16} />
                              <span>Flag</span>
                            </button>

                            {isAdmin && (
                              <button
                                className="action-item delete"
                                onClick={(e) => handleAction("delete", e, employee)}
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : column.key === "subjects" ? (
                      <span className="subjects-list">
                        {Array.isArray(employee[column.key as keyof Employee])
                          ? (employee[column.key as keyof Employee] as string[]).join(", ")
                          : String(employee[column.key as keyof Employee])}
                      </span>
                    ) : column.key === "attendance" ? (
                      <span
                        className={`attendance-badge ${getAttendanceClass(
                          employee[column.key as keyof Employee] as string
                        )}`}
                      >
                        {employee[column.key as keyof Employee]}
                      </span>
                    ) : column.key === "isActive" ? (
                      <span
                        className={`status-badge ${
                          employee.isActive ? "active" : "inactive"
                        }`}
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </span>
                    ) : column.key === "salary" ? (
                      employee.salary ? `$${employee.salary.toLocaleString()}` : "-"
                    ) : (
                      String(employee[column.key as keyof Employee])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeGrid;
