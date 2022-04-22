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
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  res.json({
    ok: true,
    user,
  });
}

export default withHandler({
  method: ["GET", "POST"],
  handler,
  isPrivate: true,
});
