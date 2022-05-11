import { UserSession } from "./session";
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
    query: { id, page },
  } = req;

  const user = await client.user.findFirst({
    where: {
      id: id.toString(),
    },
    select: {
      id: true,
      name: true,
      image: true,
      introduce: true,
      links: true,
    },
  });

  const totalFavs = await client.fav.count({
    where: {
      post: {
        userId: id.toString(),
      },
    },
  });

  return res.json({
    ok: true,
    totalFavs,
    user,
  });
}

export default withHandler({
  method: ["GET"],
  handler,
});
