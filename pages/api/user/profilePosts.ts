import { UserSession } from "./session";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import jsonSerialize from "@libs/server/jsonSerialize";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id, page },
  } = req;

  const totalPosts = await client.post.count({
    where: {
      userId: id.toString(),
    },
  });
  const pages = Math.ceil(totalPosts / 9);
  const posts = await client.post.findMany({
    take: 9,
    skip: 9 * (+page - 1),
    where: {
      userId: id.toString(),
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      title: true,
      thumnail: true,
      views: true,
      postTags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          favs: true,
        },
      },
    },
  });
  return res.json({
    ok: true,
    posts: jsonSerialize(posts),
    totalPosts,
    pages,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
});
