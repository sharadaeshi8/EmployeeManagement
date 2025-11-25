import React from "react";
import EmployeeTile from "./EmployeeTile";
import { EmployeeTileViewProps } from "../types";
import "./EmployeeTileView.css";

const EmployeeTileView: React.FC<EmployeeTileViewProps> = ({
  employees,
  onEmployeeClick,
  onEdit,
  onFlag,
  onDelete,
}) => {
  return (
    <div className="employee-tile-view">
      <div className="tile-grid">
        {employees.map((employee) => (
          <EmployeeTile
            key={employee.id}
            employee={employee}
            onEmployeeClick={onEmployeeClick}
            onEdit={onEdit}
            onFlag={onFlag}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeTileView;
