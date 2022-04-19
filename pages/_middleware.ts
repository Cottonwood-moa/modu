// import type { NextRequest, NextFetchEvent } from "next/server";
const secret = process.env.SECRET;
export async function middleware(req: any) {
  if (req.ua?.isBot) {
    return new Response("Plz don't be a BOT. Be human", { status: 403 });
  }

  // json을 return할 수도 있다.
  // api middleware를 사용할때 유용할 것 같다.
  // return NextResponse.json({ ok: true });
}
