import { UserSession } from "../user/session";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import jsonSerialize from "@libs/server/jsonSerialize";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // 로그인 된 유저
  const session: UserSession = await getSession({ req });
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  // 페이지네이션 추가
  const favsList = await client.fav.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      post: {
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
      },
    },
  });
  res.json({
    ok: true,
    favsList,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
  isPrivate: true,
});
