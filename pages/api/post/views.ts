import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const { query } = req;
    const post = await client.post.findFirst({
      where: {
        id: +query.postId.toString(),
      },
    });
    if (!post) return res.json({ ok: false, message: "post not found" });
    await client.post.update({
      where: {
        id: post?.id,
      },
      data: {
        views: post?.views + 1,
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET"],
  handler,
});
