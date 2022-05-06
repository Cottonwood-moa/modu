import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  await res.unstable_revalidate(`/`);
  res.json({
    ok: true,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
});
