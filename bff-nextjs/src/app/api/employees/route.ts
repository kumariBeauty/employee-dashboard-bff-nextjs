import { NextRequest } from "next/server";
import { z } from "zod";
import { employeeController } from "@/server/controllers/employee.controller";
import { ok } from "@/server/utils/apiResponse";
import { withErrorHandling } from "@/server/utils/withErrorHandling";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().min(0).optional(),
  search: z.string().trim().min(1).optional(),
});

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const { limit, skip, search } = querySchema.parse({
    limit: searchParams.get("limit") ?? undefined,
    skip: searchParams.get("skip") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  const { items, total } = await employeeController.listEmployees({
    limit,
    skip,
    search,
  });

  return ok(items, { total, limit: limit ?? items.length, skip: skip ?? 0 });
});
