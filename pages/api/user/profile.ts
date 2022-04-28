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
  const session: UserSession = await getSession({ req });
  const {
    query: { id },
  } = req;
  const user = await client.user.findFirst({
    where: {
      id: id.toString(),
    },
    select: {
      id: true,
      name: true,
      image: true,
      introduce: true,
    },
  });
  const posts = await client.post.findMany({
    where: {
      userId: id.toString(),
    },
    include: {
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
  const totalFavs = await client.fav.count({
    where: {
      userId: id.toString(),
    },
  });
  const totalPosts = await client.post.count({
    where: {
      userId: id.toString(),
    },
  });
  return res.json({
    ok: true,
    posts: jsonSerialize(posts),
    user,
    totalFavs,
    totalPosts,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
});
