import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware - no admin, no auth needed
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
