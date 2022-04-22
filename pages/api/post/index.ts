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
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  if (req.method === "POST") {
    const {
      body: { title, content, thumbnailId },
    } = req;
    const post = await client.post.create({
      data: {
        title,
        content,
        thumnail: thumbnailId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { page, postId },
    } = req;
    // post 전체 갯수
    const postsCount = await client.post.count();
    // 페이지 전체 갯수
    const pages = Math.ceil(postsCount / 8);

    const posts = await client.post.findMany({
      take: 8,
      skip: 8 * (+page - 1),
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
  method: ["POST", "GET"],
  handler,
});
