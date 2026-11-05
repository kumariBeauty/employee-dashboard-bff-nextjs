/** Shape returned to the React client for one employee. */
export interface EmployeeSummaryDTO {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  image: string;
}

export interface EmployeeDetailDTO extends EmployeeSummaryDTO {
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
  /** `null` when the Task service is unavailable — see `warnings`. */
  taskCount: number | null;
  pendingTaskCount: number | null;
  warnings: string[];
}
