import { getConfig } from "@/server/config/env";
import { employeeService } from "@/server/services/employee.service";
import { taskService } from "@/server/services/task.service";
import { ok } from "@/server/utils/apiResponse";
import { withErrorHandling } from "@/server/utils/withErrorHandling";

async function ping(call: () => Promise<unknown>): Promise<"ok" | "down"> {
  try {
    await call();
    return "ok";
  } catch {
    return "down";
  }
}

export const GET = withErrorHandling(async () => {
  const { services } = getConfig();
  const [employeeServiceStatus, taskServiceStatus] = await Promise.all([
    ping(() => employeeService.listEmployees({ limit: 1 })),
    ping(() => taskService.listTasks({ employeeId: 1 })),
  ]);

  return ok({
    status: "ok",
    timestamp: new Date().toISOString(),
    downstream: {
      employeeService: {
        status: employeeServiceStatus,
        baseUrl: services.employeeService.baseUrl,
      },
      taskService: {
        status: taskServiceStatus,
        baseUrl: services.taskService.baseUrl,
      },
    },
  });
});
