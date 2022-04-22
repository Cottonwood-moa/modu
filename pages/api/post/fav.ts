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
  if (req.method === "GET") {
    const { query } = req;
    const liked = Boolean(
      await client.fav.findFirst({
        where: {
          userId: query.userId.toString(),
          postId: +query.postId.toString(),
        },
      })
    );
    res.json({
      ok: true,
      liked,
    });
  }
  if (req.method === "POST") {
    const { body } = req;

    const liked = await client.fav.findFirst({
      where: {
        userId: body.userId.toString(),
        postId: +body.postId.toString(),
      },
    });

    if (liked) {
      await client.fav.delete({
        where: {
          id: liked.id,
        },
      });
    } else {
      await client.fav.create({
        data: {
          post: {
            connect: {
              id: +body.postId.toString(),
            },
          },
          user: {
            connect: {
              id: body.userId.toString(),
            },
          },
        },
      });
    }
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET", "POST"],
  handler,
});
