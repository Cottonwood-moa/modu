import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
type method = "GET" | "POST" | "DELETE";

interface ConfigType {
  method: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  // 여기서 return하는 function은 next.js api router에서 함수로 return 해줘야 하기 때문
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    const session = await getSession({ req });
    if (req.method && !method.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !session) {
      return res.status(401).json({ ok: false, error: "Plz login" });
    }
    try {
      // handler 호출 부분
      await handler(req, res);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
