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
  const { query, body } = req;
  if (req.method === "POST") {
    // 로그인 된 유저
    const session: UserSession = await getSession({ req });
    if (!session)
      return res.json({
        ok: false,
        messgae: "Plz login",
      });
    const user = await client.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    if (!user)
      return res.json({
        ok: false,
        messgae: "Plz login",
      });
    // 코멘트 만들기
    const comment = await client.comment.create({
      data: {
        content: body?.comment,
        post: {
          connect: {
            // 포스트 아이디
            id: +query.id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id.toString(),
          },
        },
      },
    });
    if (body?.userId === user?.id)
      return res.json({
        ok: true,
      });
    const postUser = await client.user.findFirst({
      where: {
        id: body?.userId,
      },
    });
    if (!postUser)
      return res.json({ ok: false, message: "post user not defined" });
    await client.user.update({
      where: {
        id: body?.userId,
      },
      data: {
        alert: postUser?.alert + 1,
      },
    });
    // 알림 디테일
    await client.notification.create({
      data: {
        user: {
          connect: {
            id: body?.userId,
          },
        },
        post: {
          connect: {
            id: +query.id.toString(),
          },
        },
        message: `${user?.name}님이 댓글을 남겼습니다. ${body?.comment}`,
        kind: "comment",
      },
    });
    res.json({
      ok: true,
    });
  }
  // 포스트 코멘트 전체
  if (req.method === "GET") {
    const comments = await client.comment.findMany({
      where: {
        postId: +query?.id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      comments,
    });
  }
  // delete
  if (req.method === "DELETE") {
    const { body } = req;
    const deleteData = await client.comment.delete({
      where: {
        id: body,
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET", "POST", "DELETE"],
  handler,
});
