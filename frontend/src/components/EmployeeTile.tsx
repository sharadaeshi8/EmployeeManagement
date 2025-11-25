import React, { useState } from "react";
import { MoreVertical, Edit, Flag, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EmployeeTileProps } from "../types";
import "./EmployeeTile.css";

type AttendanceClass = "excellent" | "good" | "fair" | "poor";
type ActionType = "edit" | "flag" | "delete";

const EmployeeTile: React.FC<EmployeeTileProps> = ({
  employee,
  onEmployeeClick,
  onEdit,
  onFlag,
  onDelete,
}) => {
  const { isAdmin } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (
    action: ActionType,
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();
    setShowMenu(false);

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

  const getAttendanceClass = (attendance: string): AttendanceClass => {
    const percentage = parseInt(attendance);
    if (percentage >= 90) return "excellent";
    if (percentage >= 80) return "good";
    if (percentage >= 70) return "fair";
    return "poor";
  };

  return (
    <div className="employee-tile" onClick={() => onEmployeeClick(employee)}>
      <div className="tile-header">
        <div className="tile-avatar-placeholder">
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div className="tile-actions">
          <button
            className="menu-button"
            onClick={handleMenuToggle}
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="action-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="action-item"
                onClick={(e) => handleAction("edit", e)}
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                className="action-item"
                onClick={(e) => handleAction("flag", e)}
              >
                <Flag size={16} />
                <span>Flag</span>
              </button>
              <button
                className="action-item"
                onClick={(e) => handleAction("flag", e)}
              >
                <Flag size={16} />
                <span>Flag</span>
              </button>
              {isAdmin && (
                <button
                  className="action-item delete"
                  onClick={(e) => handleAction("delete", e)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="tile-content">
        <h3 className="tile-name">{employee.name}</h3>
        <p className="tile-id">ID: {employee.ID}</p>
        <p className="tile-age">Age: {employee.age}</p>
        <p className="tile-class">Class: {employee.class}</p>
        <p className="tile-department">Department: {employee.department}</p>
        {employee.salary && <p className="tile-salary">Salary: ${employee.salary.toLocaleString()}</p>}
        <p className="tile-subjects">
          Subjects:{" "}
          {Array.isArray(employee.subjects)
            ? employee.subjects.join(", ")
            : employee.subjects}
        </p>
      </div>

      <div className="tile-footer">
        <span
          className={`attendance-badge ${getAttendanceClass(
            employee.attendance
          )}`}
        >
          Attendance: {employee.attendance}
        </span>
        <span
          className={`status-badge ${
            employee.isActive ? "active" : "inactive"
          }`}
        >
          {employee.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default EmployeeTile;
