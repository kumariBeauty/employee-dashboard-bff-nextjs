/**
 * These types are hand-mirrored from the BFF's DTOs
 * (bff-nextjs/src/server/dto/*.ts). The React app never talks to DummyJSON
 * or JSONPlaceholder directly, so it only ever needs to know this shape —
 * not whatever either free API actually returns.
 */

export interface EmployeeSummary {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  image: string;
}

export interface EmployeeDetail extends EmployeeSummary {
  username: string;
  age: number;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  companyName: string;
  taskCount: number | null;
  pendingTaskCount: number | null;
  warnings: string[];
}

export interface Task {
  id: number;
  employeeId: number;
  title: string;
  completed: boolean;
}

/** Counts are `null` when the BFF couldn't reach the Task service. */
export interface EmployeeWorkload {
  employee: EmployeeSummary;
  taskCount: number | null;
  pendingTaskCount: number | null;
}

/** A field is `null` when its downstream service failed; `warnings` says which one. */
export interface Dashboard {
  totalEmployees: number | null;
  totalTasks: number | null;
  pendingTasks: number | null;
  busiestEmployees: EmployeeWorkload[];
  warnings: string[];
}
