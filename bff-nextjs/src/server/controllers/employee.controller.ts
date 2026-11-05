import { HttpError } from "../http/HttpError";
import { employeeService } from "../services/employee.service";
import { taskService } from "../services/task.service";
import { EmployeeDetailDTO, EmployeeSummaryDTO } from "../dto/employee.dto";
import { RawEmployee } from "../types/external/employee.types";
import { settle } from "../utils/settle";

function toSummaryDTO(employee: RawEmployee): EmployeeSummaryDTO {
  return {
    id: employee.id,
    fullName: `${employee.firstName} ${employee.lastName}`.trim(),
    email: employee.email,
    phone: employee.phone,
    jobTitle: employee.company.title,
    department: employee.company.department,
    image: employee.image,
  };
}

export const employeeController = {
  async listEmployees(params: {
    limit?: number;
    skip?: number;
    search?: string;
  }): Promise<{ items: EmployeeSummaryDTO[]; total: number }> {
    const result = await employeeService.listEmployees(params);
    return { items: result.users.map(toSummaryDTO), total: result.total };
  },

  async getEmployeeById(id: string): Promise<EmployeeDetailDTO> {
    if (!id || !/^\d+$/.test(id)) {
      throw HttpError.badRequest(`Invalid employee id: "${id}"`);
    }

    // The employee is required; their task counts are optional extras, so a
    // Task service failure degrades to `null` counts instead of failing.
    const [employeeResult, tasksResult] = await Promise.allSettled([
      employeeService.getEmployeeById(id),
      taskService.listTasks({ employeeId: Number(id) }),
    ]);

    if (employeeResult.status === "rejected") throw employeeResult.reason;
    const employee = employeeResult.value;

    const warnings: string[] = [];
    const tasks = settle(tasksResult, "Task service", warnings);

    return {
      ...toSummaryDTO(employee),
      username: employee.username,
      age: employee.age,
      gender: employee.gender,
      address: {
        street: employee.address.address,
        city: employee.address.city,
        state: employee.address.state,
        postalCode: employee.address.postalCode,
        country: employee.address.country,
      },
      companyName: employee.company.name,
      taskCount: tasks?.length ?? null,
      pendingTaskCount: tasks ? tasks.filter((t) => !t.completed).length : null,
      warnings,
    };
  },
};
