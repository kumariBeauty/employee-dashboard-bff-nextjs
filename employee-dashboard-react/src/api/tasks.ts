import { bffGet } from "./client";
import type { Task } from "../types";

export function fetchTasks(params: {
  employeeId?: number;
  completed?: boolean;
}): Promise<Task[]> {
  return bffGet<Task[]>("/api/tasks", params);
}
