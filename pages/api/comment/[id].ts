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
  const { query, body } = req;
  if (req.method === "POST") {
    const session: UserSession = await getSession({ req });
    if (!session)
      return res.json({
        ok: false,
        messgae: "Plz login",
      });
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    const comment = await client.comment.create({
      data: {
        content: body,
        post: {
          connect: {
            id: +query.id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id.toString(),
          },
        },
      },
    });
    res.json({
      ok: true,
    });
  }
  if (req.method === "GET") {
    const comments = await client.comment.findMany({
      where: {
        postId: +query?.id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      comments,
    });
  }
  if (req.method === "DELETE") {
    const { body } = req;
    const deleteData = await client.comment.delete({
      where: {
        id: body,
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET", "POST", "DELETE"],
  handler,
});
