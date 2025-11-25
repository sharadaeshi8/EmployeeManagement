import React from "react";
import { Users, UserCheck, Clock, Calendar } from "lucide-react";
import { useEmployeeStats } from "../hooks/useEmployeeHooks";
import { Loader2 } from "lucide-react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useEmployeeStats();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 size={48} className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error">Failed to load dashboard data</div>;
  }

  if (!stats) return null;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <p className="stat-value">{stats.activeEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>Average Age</h3>
            <p className="stat-value">{Math.round(stats.averageAge)} years</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Avg Attendance</h3>
            <p className="stat-value">{Math.round(stats.averageAttendance)}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Department Breakdown</h2>
        <div className="department-table-wrapper">
          <table className="department-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Avg Age</th>
                <th>Avg Salary</th>
              </tr>
            </thead>
            <tbody>
              {stats.departmentBreakdown.map((dept: any) => (
                <tr key={dept.department}>
                  <td>{dept.department}</td>
                  <td>{dept.count}</td>
                  <td>{Math.round(dept.averageAge)}</td>
                  <td>${Math.round(dept.averageSalary || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
