/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import ParsingCreatedAt from "@libs/client/parsingCreatedAt";
import OutsideClickHandler from "react-outside-click-handler";
import { CommentWithUser, CreateCommentResponse } from "./PostComment";
import useUser from "@libs/client/useUser";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useMutation from "@libs/client/useMutation";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Button from "./button";
import { Reply, User } from "@prisma/client";
import { useSWRConfig } from "swr";
import ParsingAgo from "@libs/client/parsingAgo";
import ImageDelivery from "@libs/client/imageDelivery";
interface Props {
  id: number;
  userId: string;
  comment: CommentWithUser;
  countMutate: () => void;
}
interface IForm {
  reply: string;
}
interface ReplyResponse {
  ok: boolean;
}
export default function CommentCard({
  userId,
  comment,
  id,
  countMutate,
}: Props) {
  const { user } = useUser();
  const [replyPop, setReplyPop] = useState(false);
  const { register, handleSubmit, reset } = useForm<IForm>();
  const { mutate } = useSWRConfig();
  const [replySubmit, { data, loading }] = useMutation<ReplyResponse>(
    `/api/comment/reply?postId=${id}&commentId=${comment?.id}`,
    "POST"
  );
  // query.postId : 포스트 아이디
  // query.commentId : 코멘트 아이디
  // body.commentUserId : 코멘트 주인
  // body.reply : 대댓글 내용
  const onValid = ({ reply }: IForm) => {
    if (loading) return;
    replySubmit({ reply, commentUserId: comment?.userId });
    reset();
  };
  const [deleteComment, { data: deleteData, loading: deleteCommentLoading }] =
    useMutation<CreateCommentResponse>(`/api/comment/${id}`, "DELETE");
  const deleteHandle = (id: number) => {
    if (deleteCommentLoading) return;
    Swal.fire({
      title: "댓글을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          deleteComment(id);
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "댓글 삭제를 실패하였습니다.",
            footer: `Error : ${err?.message}`,
            confirmButtonColor: "#475569",
            denyButtonColor: "#475569",
            cancelButtonColor: "#475569",
          });
        }
      }
    });
  };
  const [deleteReply, { data: replyData, loading: deleteReplyLoading }] =
    useMutation<CreateCommentResponse>(`/api/comment/reply`, "DELETE");
  const deleteReplyHandle = (replyId: number) => {
    if (deleteReplyLoading) return;
    Swal.fire({
      title: "댓글을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          deleteReply({ replyId });
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "댓글 삭제를 실패하였습니다.",
            footer: `Error : ${err?.message}`,
            confirmButtonColor: "#475569",
            denyButtonColor: "#475569",
            cancelButtonColor: "#475569",
          });
        }
      }
    });
  };
  useEffect(() => {
    if (deleteData && deleteData?.ok) {
      mutate(`/api/comment/${id}`);
      countMutate();
    }
    if (replyData && replyData?.ok) {
      mutate(`/api/comment/${id}`);
      countMutate();
    }
  }, [mutate, countMutate, deleteData, replyData, id]);
  useEffect(() => {
    if (data && data.ok) {
      mutate(`/api/comment/${id}`);
    }
  }, [data, mutate, id]);
  return (
    <div className="flex flex-col  ">
      <div className="flex flex-col space-x-6 rounded-xl bg-gray-50 p-2 dark:rounded-none dark:bg-slate-700 dark:text-white">
        {/* comment profile */}
        <div className="flex items-center space-x-6">
          {comment?.user?.image?.includes("https") ? (
            <img
              src={
                comment?.user?.image ? comment?.user?.image : "/images/modu.png"
              }
              className="rounded-full"
              alt=""
            />
          ) : (
            <img
              src={
                comment?.user?.image
                  ? ImageDelivery(comment?.user?.image)
                  : "/images/modu.png"
              }
              className="h-12 w-12 rounded-full bg-slate-600"
              alt=""
            />
          )}
          <div>
            <div className="text-lg font-bold text-gray-700 dark:text-white xl:text-xl ">
              {userId === comment?.user?.id ? (
                <span className="mr-6 rounded-2xl bg-orange-300 py-1 px-2 text-xs font-bold text-white">
                  작성자
                </span>
              ) : null}
              {comment?.user?.name}
            </div>
            <div className="flex items-center text-sm font-semibold text-gray-400  xl:text-base">
              {ParsingCreatedAt(comment?.createdAt)}
              {comment?.user?.id === user?.id ? (
                <div
                  className="flex cursor-pointer items-center whitespace-nowrap p-2 "
                  onClick={() => deleteHandle(comment?.id)}
                >
                  삭제
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {/* detail  */}
        <div className="m-6 whitespace-pre-wrap text-base font-semibold xl:text-lg">
          {comment?.content}
        </div>
        <OutsideClickHandler onOutsideClick={() => setReplyPop(false)}>
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex items-center text-base font-bold text-gray-600 "
          >
            <label
              onClick={() => setReplyPop((prev) => !prev)}
              className="flex h-12 cursor-pointer items-center whitespace-nowrap dark:text-white"
            >
              답글
            </label>
            <AnimatePresence>
              {replyPop && (
                <>
                  <motion.textarea
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, transformOrigin: "right" }}
                    exit={{ scaleX: 0 }}
                    transition={{
                      type: "tween",
                    }}
                    {...register("reply", { required: true })}
                    className="mx-2 h-12 w-full resize-none appearance-none border-0 border-b-2 border-gray-400 bg-transparent py-2 px-2 leading-tight text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-0 dark:text-white"
                  />
                  <Button
                    onClick={() => setReplyPop(false)}
                    text="등록"
                  ></Button>
                </>
              )}
            </AnimatePresence>
          </form>
        </OutsideClickHandler>
      </div>

      {comment?.replys?.map((reply) => {
        return (
          <div key={reply?.id} className="flex items-center ">
            <div className="p-6 dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <div className="flex flex-col space-x-6 p-2 ">
              {/* recomment profile */}
              <div className="flex items-center space-x-6">
                {reply?.user?.image?.includes("https") ? (
                  <img
                    src={
                      reply?.user?.image
                        ? reply?.user?.image
                        : "/images/react.png"
                    }
                    className="rounded-full"
                    alt=""
                  />
                ) : (
                  <img
                    src={
                      reply?.user?.image
                        ? ImageDelivery(reply?.user?.image)
                        : "/images/react.png"
                    }
                    className="h-12 w-12 rounded-full bg-slate-600"
                    alt=""
                  />
                )}
                <div>
                  <div className="flex items-center text-lg font-bold text-gray-700 dark:text-white xl:text-xl ">
                    {userId === reply?.user?.id ? (
                      <span className="mr-2 rounded-2xl bg-orange-300 py-1 px-2 text-xs font-bold text-white">
                        작성자
                      </span>
                    ) : null}
                    {reply?.user?.name}
                  </div>
                  <div className="flex items-center space-x-4 text-sm font-semibold text-gray-400 xl:text-base">
                    <div>{ParsingAgo(reply?.createdAt)}</div>
                    {user?.id === reply?.user?.id ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => deleteReplyHandle(reply?.id)}
                      >
                        삭제
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              {/* detail  */}
              <div className="m-6 whitespace-pre-wrap text-base font-semibold xl:text-lg">
                {reply?.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
