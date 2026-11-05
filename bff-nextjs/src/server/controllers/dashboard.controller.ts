import { DashboardDTO, EmployeeWorkloadDTO } from "../dto/dashboard.dto";
import { settle } from "../utils/settle";
import { employeeController } from "./employee.controller";
import { taskController } from "./task.controller";

/**
 * Aggregates the Employee and Task services into one response shaped for a
 * single dashboard screen — fetched in parallel, combined here so the React
 * app makes one network call instead of two.
 *
 * `allSettled` (not `all`): if one service is down or times out, the
 * dashboard still returns the other service's data plus a warning. Only when
 * both fail does the whole request fail.
 *
 * DummyJSON and JSONPlaceholder are unrelated APIs with no real foreign key
 * between them; matching employee.id to task.employeeId (JSONPlaceholder's
 * userId, 1-10) is a demo-only convenience to illustrate the aggregation
 * pattern, not a real relationship.
 */
export const dashboardController = {
  async getDashboard(): Promise<DashboardDTO> {
    const [employeesResult, tasksResult] = await Promise.allSettled([
      employeeController.listEmployees({ limit: 10 }),
      taskController.listTasks({}),
    ]);

    if (employeesResult.status === "rejected" && tasksResult.status === "rejected") {
      throw employeesResult.reason;
    }

    const warnings: string[] = [];
    const employees = settle(employeesResult, "Employee service", warnings);
    const tasks = settle(tasksResult, "Task service", warnings);

    const tasksByEmployee = new Map<number, { total: number; pending: number }>();
    for (const task of tasks ?? []) {
      const entry = tasksByEmployee.get(task.employeeId) ?? {
        total: 0,
        pending: 0,
      };
      entry.total += 1;
      if (!task.completed) entry.pending += 1;
      tasksByEmployee.set(task.employeeId, entry);
    }

    const busiestEmployees: EmployeeWorkloadDTO[] = (employees?.items ?? [])
      .map((employee) => {
        const workload = tasksByEmployee.get(employee.id);
        return {
          employee,
          taskCount: tasks ? (workload?.total ?? 0) : null,
          pendingTaskCount: tasks ? (workload?.pending ?? 0) : null,
        };
      })
      .sort((a, b) => (b.taskCount ?? 0) - (a.taskCount ?? 0))
      .slice(0, 5);

    return {
      totalEmployees: employees?.total ?? null,
      totalTasks: tasks?.length ?? null,
      pendingTasks: tasks ? tasks.filter((t) => !t.completed).length : null,
      busiestEmployees,
      warnings,
    };
  },
};
