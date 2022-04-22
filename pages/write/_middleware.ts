// import type { NextRequest, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const secret = process.env.SECRET;
export async function middleware(req: any) {
  const session = await getToken({ req, secret });
  if (!session?.name) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }
}
