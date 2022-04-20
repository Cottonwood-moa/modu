import { UserSession } from "./../user/session";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const session: UserSession = await getSession({ req });
    const {
      body: { title, content },
    } = req;
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    const post = await client.post.create({
      data: {
        title,
        content,
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
    const session: UserSession = await getSession({ req });
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["POST", "GET"],
  handler,
});
