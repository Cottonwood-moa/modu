import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query } = req;

  try {
    if (query?.postId) {
      await res.unstable_revalidate(`/post/${query?.postId}`);
      console.log("revalidate /post/", query?.postId);
      return res.json({ ok: true });
    } else {
      await res.unstable_revalidate(`/`);
      console.log("revalidate /");
      return res.json({ ok: true });
    }
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
