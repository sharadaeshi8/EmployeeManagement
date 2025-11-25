import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Employee } from '../types';
import './EmployeeForm.css';

interface EmployeeFormProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => Promise<void>;
  mode: 'create' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    ID: '',
    name: '',
    age: 25,
    class: '',
    subjects: [],
    attendance: '100%',
    email: '',
    department: '',
    position: '',
    salary: 0,
    isActive: true
  });
  const [subjectsInput, setSubjectsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        ID: employee.ID,
        name: employee.name,
        age: employee.age,
        class: employee.class,
        subjects: employee.subjects,
        attendance: employee.attendance,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        isActive: employee.isActive
      });
      setSubjectsInput(employee.subjects?.join(', ') || '');
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        ID: '',
        name: '',
        age: 25,
        class: '',
        subjects: [],
        attendance: '100%',
        email: '',
        department: '',
        position: '',
        salary: 0,
        isActive: true
      });
      setSubjectsInput('');
    }
    setErrors({});
  }, [employee, mode, isOpen]);

  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.ID?.trim() && mode === 'create') {
      newErrors.ID = 'Employee ID is required';
    }
    if (!formData.age || formData.age < 18 || formData.age > 70) {
      newErrors.age = 'Age must be between 18 and 70';
    }
    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.position?.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert subjects string to array
      const subjects = subjectsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const employeeData = {
        ...formData,
        subjects,
        attendance: formData.attendance || '100%'
      };

      await onSave(employeeData);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="employee-form-overlay">
      <div className="employee-form-container">
        <div className="employee-form-header">
          <div className="employee-form-title">
            <User size={24} />
            <h2>{mode === 'create' ? 'Add New Employee' : 'Edit Employee'}</h2>
          </div>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID *</label>
              <input
                id="employeeId"
                type="text"
                value={formData.ID || ''}
                onChange={(e) => handleInputChange('ID', e.target.value)}
                disabled={mode === 'edit' || loading}
                className={errors.ID ? 'error' : ''}
                placeholder="e.g., EMP001"
              />
              {errors.ID && <span className="error-message">{errors.ID}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={loading}
                className={errors.name ? 'error' : ''}
                placeholder="Enter full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                id="age"
                type="number"
                min="18"
                max="70"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                disabled={loading}
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="class">Class/Level</label>
              <select
                id="class"
                value={formData.class || ''}
                onChange={(e) => handleInputChange('class', e.target.value)}
                disabled={loading}
              >
                <option value="">Select Level</option>
                <option value="Junior Level">Junior Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead Level">Lead Level</option>
                <option value="Principal Level">Principal Level</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={loading}
                className={errors.department ? 'error' : ''}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position"
                type="text"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={loading}
                className={errors.position ? 'error' : ''}
                placeholder="e.g., Software Engineer"
              />
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              type="number"
              min="0"
              value={formData.salary || ''}
              onChange={(e) => handleInputChange('salary', e.target.value ? parseInt(e.target.value) : 0)}
              disabled={loading}
              placeholder="e.g., 50000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={loading}
              className={errors.email ? 'error' : ''}
              placeholder="name@company.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subjects">Skills/Subjects</label>
            <input
              id="subjects"
              type="text"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              disabled={loading}
              placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
            />
            <small className="help-text">Enter skills separated by commas</small>
          </div>

          <div className="form-group">
            <input
              id="attendance"
              type="text"
              value={formData.attendance || ''}
              onChange={(e) => handleInputChange('attendance', e.target.value)}
              disabled={loading}
              placeholder="e.g., 95%"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                disabled={loading}
              />
              <span style={{ marginLeft: '0.5rem' }}>Active Status</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="save-button"
            >
              <Save size={16} />
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Employee' : 'Update Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;