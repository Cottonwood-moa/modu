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
  // query.postId : 포스트 아이디
  // query.commentId : 코멘트 아이디
  // body.commentUserId : 코멘트 주인
  // body.reply : 대댓글 내용
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
    // 대댓글 만들기
    const reply = await client.reply.create({
      data: {
        content: body?.reply,
        comment: {
          connect: {
            // 연결할 코멘트
            id: +query.commentId,
          },
        },
        user: {
          connect: {
            id: user?.id.toString(),
          },
        },
        post: {
          connect: {
            id: +query.postId,
          },
        },
      },
    });
    // 코멘트 주인
    const commentUser = await client.user.findFirst({
      where: {
        id: body?.commentUserId,
      },
    });
    if (!commentUser)
      return res.json({ ok: false, message: "post user not defined" });
    // reply와 코멘트 주인이 같으면 알림이 가지 않음.
    if (reply?.userId === commentUser?.id) return res.json({ ok: true });
    // 코멘트 주인에게 알림
    await client.user.update({
      where: {
        id: body?.commentUserId,
      },
      data: {
        alert: commentUser?.alert + 1,
      },
    });
    // 알림 디테일
    await client.notification.create({
      data: {
        user: {
          connect: {
            id: body?.commentUserId,
          },
        },
        post: {
          connect: {
            id: +query.postId,
          },
        },
        message: `${user?.name}님이 대댓글을 남겼습니다. ${body?.reply}`,
        kind: "reply",
      },
    });
    return res.json({
      ok: true,
    });
  }
  // delete
  if (req.method === "DELETE") {
    const {
      body: { replyId },
    } = req;
    const deleteData = await client.reply.delete({
      where: {
        id: replyId,
      },
    });
    return res.json({
      ok: true,
    });
  }
}

export default withHandler({
  method: ["GET", "POST", "DELETE"],
  handler,
});
