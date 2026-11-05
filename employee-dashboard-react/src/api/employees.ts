import { bffGet } from "./client";
import type { EmployeeDetail, EmployeeSummary } from "../types";

export function fetchEmployees(params: {
  limit?: number;
  search?: string;
}): Promise<EmployeeSummary[]> {
  return bffGet<EmployeeSummary[]>("/api/employees", params);
}

export function fetchEmployeeById(id: number): Promise<EmployeeDetail> {
  return bffGet<EmployeeDetail>(`/api/employees/${id}`);
}
