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
    const {
      query: { linkId },
    } = req;
    console.log(linkId);
    await client.link.delete({
      where: {
        id: +linkId,
      },
    });
    return res.json({ ok: true });
  }
  if (req.method === "POST") {
    const {
      body: { name, url, userId },
    } = req;
    await client.user.update({
      where: {
        id: userId.toString(),
      },
      data: {},
    });
    await client.link.create({
      data: {
        url,
        name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET", "POST"],
  handler,
});
