import { taskService } from "../services/task.service";
import { TaskDTO } from "../dto/task.dto";
import { RawTask } from "../types/external/task.types";

function toDTO(task: RawTask): TaskDTO {
  return {
    id: task.id,
    employeeId: task.userId,
    title: task.title,
    completed: task.completed,
  };
}

export const taskController = {
  async listTasks(params: {
    employeeId?: number;
    completed?: boolean;
  }): Promise<TaskDTO[]> {
    const tasks = await taskService.listTasks(params);
    return tasks.map(toDTO);
  },
};
