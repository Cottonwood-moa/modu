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
  const {
    query: { postId },
  } = req;
  const favsList = await client.post.findFirst({
    where: {
      id: +postId,
    },
    select: {
      favs: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
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
});
