import React from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download } from "lucide-react";
import "./EmployeeControls.css";

interface EmployeeControlsProps {
  onSearch: (term: string) => void;
  onSort: (field: string, direction: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortField: string;
  sortDirection: string;
  onFilterStatus: (status: string) => void;
  currentStatus: string;
  onFilterDepartment: (department: string) => void;
  currentDepartment: string;
  onDownloadPDF: () => void;
}

const EmployeeControls: React.FC<EmployeeControlsProps> = ({
  onSearch,
  onSort,
  onPageChange,
  onPageSizeChange,
  totalCount,
  currentPage,
  pageSize,
  sortField,
  sortDirection,
  onFilterStatus,
  currentStatus,
  onFilterDepartment,
  currentDepartment,
  onDownloadPDF,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="employee-controls">
      <div className="controls-left">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-box">
          <ArrowUpDown size={16} className="sort-icon" />
          <select 
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split("-");
              onSort(field, direction);
            }}
            className="sort-select"
          >
            <option value="NAME-ASC">Name (A-Z)</option>
            <option value="NAME-DESC">Name (Z-A)</option>
            <option value="AGE-ASC">Age (Low-High)</option>
            <option value="AGE-DESC">Age (High-Low)</option>
            <option value="DEPARTMENT-ASC">Department (A-Z)</option>
            <option value="DEPARTMENT-DESC">Department (Z-A)</option>
          </select>
        </div>

        <div className="filter-box">
          <select
            value={currentStatus}
            onChange={(e) => onFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-box">
          <select
            value={currentDepartment}
            onChange={(e) => onFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Design">Design</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <button
          onClick={onDownloadPDF}
          className="download-button"
          title="Download PDF"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          <Download size={16} />
          <span>PDF</span>
        </button>
      </div>

      <div className="controls-right">
        <div className="pagination-info">
          <span>
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </span>
        </div>
        
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          
          <span className="page-number">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="page-button"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeControls;
