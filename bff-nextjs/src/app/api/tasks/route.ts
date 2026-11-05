import { NextRequest } from "next/server";
import { z } from "zod";
import { taskController } from "@/server/controllers/task.controller";
import { ok } from "@/server/utils/apiResponse";
import { withErrorHandling } from "@/server/utils/withErrorHandling";

const querySchema = z.object({
  employeeId: z.coerce.number().int().min(1).optional(),
  completed: z.enum(["true", "false"]).optional(),
});

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const { employeeId, completed } = querySchema.parse({
    employeeId: searchParams.get("employeeId") ?? undefined,
    completed: searchParams.get("completed") ?? undefined,
  });

  const tasks = await taskController.listTasks({
    employeeId,
    completed: completed === undefined ? undefined : completed === "true",
  });

  return ok(tasks, { count: tasks.length });
});
