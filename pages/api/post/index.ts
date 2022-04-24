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
      body: { title, content, thumbnailId, tags },
    } = req;
    const TempPost = await client.post.create({
      data: {
        title,
        content,
        thumnail: thumbnailId,
        category: "임시",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    tags.map(async (tag: any) => {
      // 전달 받은 태그를 돌려서 tag모델에 있는 지 확인하고 없으면 만듬
      const alreayExists = await client.tag.findFirst({
        where: {
          name: tag,
        },
      });
      if (!alreayExists) {
        await client.tag.create({
          data: {
            name: tag,
          },
        });
      }
      await client.postTags.create({
        data: {
          post: {
            connect: {
              id: TempPost.id,
            },
          },
          tag: {
            connect: {
              name: tag,
            },
          },
        },
      });
    });
    const post = await client.post.findUnique({
      where: {
        id: TempPost.id,
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
    const pages = Math.ceil(postsCount / 4);

    const posts = await client.post.findMany({
      take: 4,
      skip: 4 * (+page - 1),
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
  method: ["POST", "GET"],
  handler,
});
