// This is an example of how to access a session from an API route
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 유저 정보
  const session = await getSession({ req });
  res.send(JSON.stringify(session, null, 2));
}
