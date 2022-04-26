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
  const postCount = await client.post.findFirst({
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
  const favsCount = await client.fav.count({
    where: {
      postId: +postId,
    },
  });
  const commentsCount = await client.comment.count({
    where: {
      postId: +postId,
    },
  });
  const replysCount = await client.reply.count({
    where: {
      postId: +postId,
    },
  });
  const count = {
    favs: favsCount,
    comments: commentsCount + replysCount,
  };
  res.json({ ok: true, count });
}

export default withHandler({
  method: ["GET"],
  handler,
});
