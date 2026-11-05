import { getConfig } from "../config/env";
import { httpGet } from "../http/httpClient";
import {
  RawEmployee,
  RawEmployeeListResponse,
} from "../types/external/employee.types";

/** Talks to DummyJSON, used here as the "Employee" service. No auth required. */
export const employeeService = {
  async listEmployees(params: {
    limit?: number;
    skip?: number;
    search?: string;
  }): Promise<RawEmployeeListResponse> {
    return httpGet<RawEmployeeListResponse>({
      ...getConfig().services.employeeService,
      path: params.search ? "/users/search" : "/users",
      searchParams: {
        limit: params.limit,
        skip: params.skip,
        q: params.search,
      },
    });
  },

  async getEmployeeById(id: string): Promise<RawEmployee> {
    return httpGet<RawEmployee>({
      ...getConfig().services.employeeService,
      path: `/users/${id}`,
    });
  },
};
