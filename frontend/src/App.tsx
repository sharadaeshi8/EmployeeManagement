import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { Grid, LayoutGrid, Loader2, Plus } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { client } from "./apollo/client";
import { GET_EMPLOYEES } from "./apollo/queries";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HamburgerMenu from "./components/HamburgerMenu";
import HorizontalMenu from "./components/HorizontalMenu";
import EmployeeGrid from "./components/EmployeeGrid";
import EmployeeTileView from "./components/EmployeeTileView";
import EmployeeDetail from "./components/EmployeeDetail";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeControls from "./components/EmployeeControls";
import Dashboard from "./components/Dashboard";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "./hooks/useEmployeeHooks";
import { Employee } from "./types";
import "./App.css";

type ViewMode = "grid" | "tile";

// Simple Login Form Component
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/employees");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Navigation handled by useEffect
    } catch (error) {
      alert("Login failed. Try: admin@company.com / admin123");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "300px",
        }}
      >
        <h2>Employee Management Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            background: loading ? "#ccc" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <small>Demo: admin@company.com / admin123 or john.smith@company.com / employee123</small>
      </form>
    </div>
  );
};

// Main App Component
const MainApp: React.FC = () => {
  // State for Filter, Sort, Pagination
  const [filter, setFilter] = useState<{ name?: string; isActive?: boolean; department?: string }>({});
  const [sort, setSort] = useState<{ field: string; direction: string }>({ field: "NAME", direction: "ASC" });
  const [pagination, setPagination] = useState<{ page: number; first: number }>({ page: 1, first: 10 });
  const [pageCursors, setPageCursors] = useState<Record<number, string>>({});
  
  const { isAuthenticated, user, logout } = useAuth();

  // Get cursor for current page (cursor of the previous page end)
  const currentCursor = pagination.page > 1 ? pageCursors[pagination.page - 1] : null;

  // Fetch employees with options
  const { employees, loading, error, refetch, totalCount, pageInfo } = useEmployees({
    filter,
    sort,
    pagination: { first: pagination.first, after: currentCursor },
    skip: !isAuthenticated,
  });

  // Update cursors when pageInfo changes
  useEffect(() => {
    if (pageInfo?.endCursor) {
      setPageCursors(prev => ({
        ...prev,
        [pagination.page]: pageInfo.endCursor
      }));
    }
  }, [pageInfo, pagination.page]);

  const { createEmployee } = useCreateEmployee();
  const { updateEmployee } = useUpdateEmployee();
  const { deleteEmployee } = useDeleteEmployee();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState<boolean>(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);



  // Error handling
  useEffect(() => {
    if (error) {
      alert("Failed to load employees");
    }
  }, [error]);

  // Handlers for Controls
  const handleSearch = (term: string) => {
    setFilter(term ? { name: term } : {});
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    setPageCursors({}); // Reset cursors
  };

  const handleSort = (field: string, direction: string) => {
    setSort({ field, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
    setPageCursors({});
  };

  const handleStatusFilter = (status: string) => {
    setFilter(prev => {
      const newFilter = { ...prev };
      if (status === "active") {
        newFilter.isActive = true;
      } else if (status === "inactive") {
        newFilter.isActive = false;
      } else {
        delete newFilter.isActive;
      }
      return newFilter;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setPageCursors({});
  };

  const handleDepartmentFilter = (department: string) => {
    setFilter(prev => {
      const newFilter = { ...prev };
      if (department === "all") {
        delete newFilter.department;
      } else {
        newFilter.department = department;
      }
      return newFilter;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setPageCursors({});
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ page: 1, first: size });
    setPageCursors({});
  };

  const handleEmployeeClick = (employee: Employee): void => {
    setSelectedEmployee(employee);
    setShowDetail(true);
  };

  const handleCloseDetail = (): void => {
    setShowDetail(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee: Employee): void => {
    setEmployeeToEdit(employee);
    setShowEmployeeForm(true);
  };

  const handleAddEmployee = (): void => {
    setEmployeeToEdit(null);
    setShowEmployeeForm(true);
  };

  const handleEmployeeFormSubmit = async (employeeData: Partial<Employee>): Promise<void> => {
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      setShowEmployeeForm(false);
      setEmployeeToEdit(null);
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleEmployeeFormCancel = (): void => {
    setShowEmployeeForm(false);
    setEmployeeToEdit(null);
  };

  const handleFlag = async (employee: Employee): Promise<void> => {
    // Simulate flag action
    if (window.confirm(`Flag ${employee.name} for review?`)) {
      // In a real app, this would call an API
      // await flagEmployee(employee.id);
      alert(`Flagged ${employee.name}`);
      // Refresh list to show updates (simulated)
      refetch();
    }
  };

  const handleDelete = async (employee: Employee): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await deleteEmployee(employee.id);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Fetch all employees matching the current filter (limit 1000 to be safe)
      const { data } = await client.query({
        query: GET_EMPLOYEES,
        variables: {
          filter,
          sort,
          pagination: { first: 1000 }, // Fetch up to 1000 records
        },
        fetchPolicy: "network-only",
      });

      const employeesToPrint: Employee[] = data.employees.edges.map((edge: any) => edge.node);

      if (employeesToPrint.length === 0) {
        alert("No employees to download.");
        return;
      }

      const doc = new jsPDF({ orientation: "landscape" });

      // Add title
      doc.setFontSize(18);
      doc.text("Employee List", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Add filter details
      let filterY = 38;
      doc.setFontSize(10);
      
      const filters = [];
      if (filter.name) filters.push(`Search: "${filter.name}"`);
      if (filter.department) filters.push(`Department: ${filter.department}`);
      if (filter.isActive !== undefined) filters.push(`Status: ${filter.isActive ? "Active" : "Inactive"}`);
      
      if (filters.length > 0) {
        doc.text(`Filters: ${filters.join(" | ")}`, 14, filterY);
        filterY += 8;
      } else {
        doc.text("Filters: None", 14, filterY);
        filterY += 8;
      }

      // Prepare table data
      const tableHead = ["Name", "Department", "Position", "Status", "Email"];
      if (user?.role === 'ADMIN') {
        tableHead.push("Salary");
      }

      const tableBody = employeesToPrint.map((emp) => {
        const row = [
          emp.name,
          emp.department || "-",
          emp.position || "-",
          emp.isActive ? "Active" : "Inactive",
          emp.email || "-",
        ];
        if (user?.role === 'ADMIN') {
          row.push(emp.salary ? `$${emp.salary.toLocaleString()}` : "-");
        }
        return row;
      });

      // Add table
      autoTable(doc, {
        head: [tableHead],
        body: tableBody,
        startY: filterY,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] }, // Blue header
      });

      doc.save("employees.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <HamburgerMenu />
          <h1 className="app-title">Employee Management</h1>
        </div>
        <div className="header-right">
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleAddEmployee}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              <Plus size={16} />
              Add Employee
            </button>
          )}
          <div className="user-info" style={{ marginRight: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {user && <span>Welcome, {user.employee?.name || user.email}</span>}
            <button
              onClick={logout}
              style={{
                padding: "0.5rem 1rem",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
          <div className="view-toggle">
            <button className={`view-button ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} aria-label="Grid view">
              <Grid size={20} />
              <span>Grid</span>
            </button>
            <button className={`view-button ${viewMode === "tile" ? "active" : ""}`} onClick={() => setViewMode("tile")} aria-label="Tile view">
              <LayoutGrid size={20} />
              <span>Tile</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <HorizontalMenu />
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={
            <>
              <EmployeeControls
                onSearch={handleSearch}
                onSort={handleSort}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                totalCount={totalCount}
                currentPage={pagination.page}
                pageSize={pagination.first}
                sortField={sort.field}
                sortDirection={sort.direction}
                onFilterStatus={handleStatusFilter}
                currentStatus={filter.isActive === undefined ? "all" : filter.isActive ? "active" : "inactive"}
                onFilterDepartment={handleDepartmentFilter}
                currentDepartment={filter.department || "all"}
                onDownloadPDF={handleDownloadPDF}
              />
              
              {loading ? (
                <div className="loading-container">
                  <Loader2 size={48} className="spinner" />
                  <p>Loading employees...</p>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <EmployeeGrid 
                      employees={employees} 
                      onEmployeeClick={handleEmployeeClick}
                      onEdit={handleEdit}
                      onFlag={handleFlag}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <EmployeeTileView employees={employees} onEmployeeClick={handleEmployeeClick} onEdit={handleEdit} onFlag={handleFlag} onDelete={handleDelete} />
                  )}
                </>
              )}
            </>
          } />
          <Route path="/" element={<Navigate to={user?.role === 'ADMIN' ? "/dashboard" : "/employees"} replace />} />
        </Routes>
      </main>

      {showDetail && selectedEmployee && <EmployeeDetail employee={selectedEmployee} onClose={handleCloseDetail} />}
      
      {showEmployeeForm && (
        <EmployeeForm
          employee={employeeToEdit}
          isOpen={showEmployeeForm}
          onClose={handleEmployeeFormCancel}
          onSave={handleEmployeeFormSubmit}
          mode={employeeToEdit ? 'edit' : 'create'}
        />
      )}
    </div>
  );
};

// App with Providers
const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/*" element={<MainApp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
