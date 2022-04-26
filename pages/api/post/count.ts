import { UserSession } from "./../user/session";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { postId },
  } = req;
  const count = await client.post.findFirst({
    where: {
      id: +postId,
    },
    select: {
      _count: {
        select: {
          favs: true,
          comments: true,
        },
      },
    },
  });
  res.json({ ok: true, count });
}

export default withHandler({
  method: ["GET"],
  handler,
});
