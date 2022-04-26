import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { UserSession } from "../user/session";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { postId },
  } = req;
  const session: UserSession = await getSession({ req });
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    select: {
      id: true,
    },
  });
  const post = await client.post.findFirst({
    where: {
      id: +postId,
    },
    select: {
      userId: true,
    },
  });
  if (user?.id !== post?.userId) {
    return res.json({ ok: false });
  }
  await client.post.delete({
    where: {
      id: +postId,
    },
  });
  res.json({
    ok: true,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
});
