import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query: postId } = req;
  try {
    await res.unstable_revalidate(`/post/${postId}`);
    return res.json({ ok: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({ ok: false });
  }
}

export default withHandler({
  method: ["GET"],
  handler,
});
