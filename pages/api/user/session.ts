// This is an example of how to access a session from an API route
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";
interface User {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string | null;
}
export type UserSession = User | null;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 로그인된 유저 정보
  const session: UserSession = await getSession({ req });

  if (req.method === "GET") {
    const { query } = req;
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    if (req?.query?.alert) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          alert: 0,
        },
      });
      return res.json({ ok: true, message: "알림 초기화" });
    }
    res.json({
      ok: true,
      user,
    });
  }
  if (req.method === "DELETE") {
    const {
      body: { id },
    } = req;
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    if (user?.id !== id) {
      return res.json({
        ok: false,
        message: "로그인된 유저와 삭제할 유저 아이디 불일치",
      });
    }
    await client.user.delete({
      where: {
        id,
      },
    });
    return res.json({ ok: true });
  }
}

export default withHandler({
  method: ["GET", "DELETE"],
  handler,
  isPrivate: true,
});
