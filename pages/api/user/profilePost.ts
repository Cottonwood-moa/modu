import { UserSession } from "./../user/session";
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
    query: { page, order, userId },
  } = req;
  // 해당 유저의 post 전체 갯수
  const postsCount = await client.post.count({
    where: {
      userId: userId.toString(),
    },
  });
  // 페이지 전체 갯수
  const pages = Math.ceil(postsCount / 5);
  if (order === "favs") {
    const posts = await client.post.findMany({
      where: {
        userId: userId.toString(),
      },
      take: 5,
      skip: 5 * (+page - 1),
      orderBy: [
        {
          favs: {
            _count: "desc",
          },
        },
      ],
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        favs: true,
        _count: {
          select: {
            favs: true,
            comments: true,
          },
        },
      },
    });
    if (!posts) {
      return res.json({
        ok: false,
        message: "There is no Posts",
      });
    }
    res.json({
      posts: jsonSerialize(posts),
      pages,
      ok: true,
    });
  } else if (order === "latest") {
    const posts = await client.post.findMany({
      where: {
        userId: userId.toString(),
      },
      take: 5,
      skip: 5 * (+page - 5),
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        favs: true,
        _count: {
          select: {
            favs: true,
            comments: true,
          },
        },
      },
    });
    if (!posts) {
      return res.json({
        ok: false,
        message: "There is no Posts",
      });
    }
    res.json({
      posts: jsonSerialize(posts),
      pages,
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET"],
  handler,
});
