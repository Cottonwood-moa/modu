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
    body: { name, userId, loggedUserId },
  } = req;
  if (userId !== loggedUserId) return res.json({ ok: false });
  await client.user.update({
    where: {
      id: userId.toString(),
    },
    data: {
      name,
    },
  });
  res.json({
    ok: true,
  });
}

export default withHandler({
  method: ["POST"],
  handler,
});
