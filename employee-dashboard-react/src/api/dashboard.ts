import { bffGet } from "./client";
import type { Dashboard } from "../types";

export function fetchDashboard(): Promise<Dashboard> {
  return bffGet<Dashboard>("/api/dashboard");
}
