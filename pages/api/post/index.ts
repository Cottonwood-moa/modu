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
  const takePostNumber = 12;
  // ===========================================================
  if (req.method === "POST") {
    const {
      body: { title, content, thumbnailId, tags },
      query: { postId },
    } = req;
    if (postId) {
      await client.post.update({
        where: {
          id: +postId,
        },
        data: {
          content,
          thumnail: thumbnailId,
          title,
        },
      });
      await client.postTags.deleteMany({
        where: {
          postId: +postId,
        },
      });
      await Promise.all(
        tags.map(async (tag: any) => {
          const alreayExistsTag = await client.tag.findFirst({
            where: {
              name: tag,
            },
          });
          if (!alreayExistsTag) {
            await client.tag.create({
              data: {
                name: tag,
              },
            });
          }
          const postTag = await client.postTags.create({
            data: {
              post: {
                connect: {
                  id: +postId,
                },
              },
              tag: {
                connect: {
                  name: tag,
                },
              },
            },
          });
        })
      );
      await res.unstable_revalidate(`/post/${postId}`);
      return res.json({ ok: true });
    }
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
    await Promise.all(
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
      })
    );
    const post = await client.post.findUnique({
      where: {
        id: TempPost.id,
      },
    });
    // await res.unstable_revalidate(`/`);
    return res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { page, order, search },
    } = req;

    if (order === "favs") {
      // 검색어 o
      if (search) {
        const postsCountWithSearch = await client.post.count({
          where: {
            OR: [
              {
                title: {
                  contains: search.toString(),
                },
              },
              {
                postTags: {
                  some: {
                    tag: {
                      name: {
                        contains: search.toString(),
                      },
                    },
                  },
                },
              },
            ],
          },
        });
        const pagesWithSearch = Math.ceil(
          postsCountWithSearch / takePostNumber
        );
        const posts = await client.post.findMany({
          take: takePostNumber,
          skip: takePostNumber * (+page - 1),
          where: {
            OR: [
              {
                title: {
                  contains: search.toString(),
                },
              },
              {
                postTags: {
                  some: {
                    tag: {
                      name: {
                        contains: search.toString(),
                      },
                    },
                  },
                },
              },
            ],
          },
          orderBy: [
            {
              favs: {
                _count: "desc",
              },
            },
          ],
          select: {
            id: true,
            thumnail: true,
            userId: true,
            views: true,
            title: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            postTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
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
        return res.json({
          posts: jsonSerialize(posts),
          pages: pagesWithSearch,
          ok: true,
        });
      } else {
        // 검색어 x
        // post 전체 갯수
        const postsCount = await client.post.count();
        // 페이지 전체 갯수
        const pages = Math.ceil(postsCount / takePostNumber);
        const posts = await client.post.findMany({
          take: takePostNumber,
          skip: takePostNumber * (+page - 1),
          orderBy: [
            {
              favs: {
                _count: "desc",
              },
            },
          ],
          select: {
            id: true,
            thumnail: true,
            userId: true,
            views: true,
            title: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            postTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
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
        return res.json({
          posts: jsonSerialize(posts),
          pages,
          ok: true,
        });
      }
    } else if (order === "latest") {
      // 검색어 o
      if (search) {
        const postsCountWithSearch = await client.post.count({
          where: {
            OR: [
              {
                title: {
                  contains: search.toString(),
                },
              },
              {
                postTags: {
                  some: {
                    tag: {
                      name: {
                        contains: search.toString(),
                      },
                    },
                  },
                },
              },
            ],
          },
        });
        const pagesWithSearch = Math.ceil(
          postsCountWithSearch / takePostNumber
        );
        const posts = await client.post.findMany({
          take: takePostNumber,
          skip: takePostNumber * (+page - 1),
          where: {
            OR: [
              {
                title: {
                  contains: search.toString(),
                },
              },
              {
                postTags: {
                  some: {
                    tag: {
                      name: {
                        contains: search.toString(),
                      },
                    },
                  },
                },
              },
            ],
          },
          orderBy: {
            id: "desc",
          },
          select: {
            id: true,
            thumnail: true,
            userId: true,
            views: true,
            title: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            postTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
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
        return res.json({
          posts: jsonSerialize(posts),
          pages: pagesWithSearch,
          ok: true,
        });
      } else {
        // 검색어 x
        // post 전체 갯수
        const postsCount = await client.post.count();
        // 페이지 전체 갯수
        const pages = Math.ceil(postsCount / takePostNumber);
        const posts = await client.post.findMany({
          take: takePostNumber,
          skip: takePostNumber * (+page - 1),
          orderBy: {
            id: "desc",
          },
          select: {
            id: true,
            thumnail: true,
            userId: true,
            views: true,
            title: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            postTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
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
        return res.json({
          posts: jsonSerialize(posts),
          pages,
          ok: true,
        });
      }
    }
  }
}

export default withHandler({
  method: ["POST", "GET"],
  handler,
});
