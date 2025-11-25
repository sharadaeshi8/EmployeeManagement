"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortDirection = exports.EmployeeSortField = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (exports.UserRole = UserRole = {}));
var EmployeeSortField;
(function (EmployeeSortField) {
    EmployeeSortField["NAME"] = "name";
    EmployeeSortField["AGE"] = "age";
    EmployeeSortField["HIRE_DATE"] = "hireDate";
    EmployeeSortField["DEPARTMENT"] = "department";
    EmployeeSortField["ATTENDANCE"] = "attendance";
})(EmployeeSortField || (exports.EmployeeSortField = EmployeeSortField = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
//# sourceMappingURL=types.js.map