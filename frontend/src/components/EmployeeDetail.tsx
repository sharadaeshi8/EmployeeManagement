import React from "react";
import {
  X,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { EmployeeDetailProps } from "../types";
import "./EmployeeDetail.css";

type AttendanceClass = "excellent" | "good" | "fair" | "poor";

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  onClose,
}) => {
  if (!employee) return null;

  const getAttendanceClass = (attendance: string): AttendanceClass => {
    const percentage = parseInt(attendance);
    if (percentage >= 90) return "excellent";
    if (percentage >= 80) return "good";
    if (percentage >= 70) return "fair";
    return "poor";
  };

  return (
    <div className="employee-detail-overlay" onClick={onClose}>
      <div
        className="employee-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="detail-header">
          <div className="detail-avatar-placeholder">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <div className="detail-title">
            <h1>{employee.name}</h1>
            <p className="detail-id">ID: {employee.ID}</p>
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
              style={{ marginLeft: "0.5rem" }}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>Name</label>
                  <p>{employee.name}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>ID</label>
                  <p>{employee.ID}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>Email</label>
                  <p>{employee.email}</p>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={18} className="detail-icon" />
                <div>
                  <label>Age</label>
                  <p>{employee.age} years</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>Department</label>
                  <p>{employee.department}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>Position</label>
                  <p>{employee.position}</p>
                </div>
              </div>

              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div>
                  <label>Salary</label>
                  <p>{employee.salary ? `$${employee.salary.toLocaleString()}` : "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Academic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <GraduationCap size={18} className="detail-icon" />
                <div>
                  <label>Class</label>
                  <p>{employee.class}</p>
                </div>
              </div>

              <div className="detail-item full-width">
                <BookOpen size={18} className="detail-icon" />
                <div>
                  <label>Subjects</label>
                  <div className="subjects-container">
                    {Array.isArray(employee.subjects) ? (
                      employee.subjects.map((subject, index) => (
                        <span key={index} className="subject-tag">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="subject-tag">{employee.subjects}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Attendance</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <CheckCircle size={18} className="detail-icon" />
                <div>
                  <label>Attendance Percentage</label>
                  <p className="attendance-value">
                    <span
                      className={`attendance-badge-large ${getAttendanceClass(
                        employee.attendance
                      )}`}
                    >
                      {employee.attendance}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-footer">
          <button className="back-button" onClick={onClose}>
            Back to View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
