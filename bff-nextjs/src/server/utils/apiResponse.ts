import { NextResponse } from "next/server";

/** Every BFF endpoint responds in this shape so the React client has one contract to parse. */
export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}
