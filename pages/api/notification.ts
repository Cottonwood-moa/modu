import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query } = req;
  const notification = await client.notification.findMany({
    where: {
      userId: query?.userId.toString(),
    },
  });
  if (!notification) return res.json({ ok: false, message: "no alert" });
  res.json({
    ok: true,
    notification,
  });
}

export default withHandler({
  method: ["GET"],
  isPrivate: true,
  handler,
});
