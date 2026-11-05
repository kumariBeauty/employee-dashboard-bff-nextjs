import { NextRequest } from "next/server";
import { employeeController } from "@/server/controllers/employee.controller";
import { ok } from "@/server/utils/apiResponse";
import { withErrorHandling } from "@/server/utils/withErrorHandling";

export const GET = withErrorHandling(
  async (_request: NextRequest, { params }: RouteContext<"/api/employees/[id]">) => {
    const { id } = await params;
    return ok(await employeeController.getEmployeeById(id));
  }
);
