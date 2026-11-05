import { EmployeeSummaryDTO } from "./employee.dto";

/** One entry in the "busiest employees" leaderboard. Counts are `null` when the Task service is unavailable. */
export interface EmployeeWorkloadDTO {
  employee: EmployeeSummaryDTO;
  taskCount: number | null;
  pendingTaskCount: number | null;
}

/**
 * Purpose-built shape for a single dashboard screen, aggregated from two
 * independent downstream services (Employee + Task) in one round trip
 * instead of the React app orchestrating two calls itself.
 *
 * A field is `null` when the service it comes from failed; `warnings` then
 * says which one.
 */
export interface DashboardDTO {
  totalEmployees: number | null;
  totalTasks: number | null;
  pendingTasks: number | null;
  busiestEmployees: EmployeeWorkloadDTO[];
  warnings: string[];
}
