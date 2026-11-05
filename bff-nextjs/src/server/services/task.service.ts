import { getConfig } from "../config/env";
import { httpGet } from "../http/httpClient";
import { RawTask } from "../types/external/task.types";

/** Talks to JSONPlaceholder, used here as the "Task" service. No auth required. */
export const taskService = {
  async listTasks(params: {
    employeeId?: number;
    completed?: boolean;
  }): Promise<RawTask[]> {
    return httpGet<RawTask[]>({
      ...getConfig().services.taskService,
      path: "/todos",
      searchParams: {
        userId: params.employeeId,
        completed: params.completed,
      },
    });
  },
};
