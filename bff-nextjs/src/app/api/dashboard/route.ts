import { dashboardController } from "@/server/controllers/dashboard.controller";
import { ok } from "@/server/utils/apiResponse";
import { withErrorHandling } from "@/server/utils/withErrorHandling";

export const GET = withErrorHandling(async () => {
  return ok(await dashboardController.getDashboard());
});
