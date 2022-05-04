import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { Comment, Reply, User } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "./button";
import TextArea from "./textarea";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

import CommentCard from "./comment";
export interface CommentProps {
  id: number;
  userId: string;
  count: number;
  countMutate: () => void;
}
interface ReplyWithUser extends Reply {
  user: User;
}
export interface CommentWithUser extends Comment {
  user: {
    id: string;
    name: string;
    image: string;
  };
  replys: ReplyWithUser[];
}
export interface CreateCommentResponse {
  ok: boolean;
}
interface CommentResponse {
  ok: boolean;
  comments: CommentWithUser[];
}
interface FormData {
  comment: string;
  reply: string;
}
export default function PostComment({
  id, // 포스트 아이디
  userId,
  count,
  countMutate,
}: CommentProps) {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<CommentResponse>(
    id ? `/api/comment/${id}` : null
  );
  const [createComment, { data: commentData, loading: createCommentLoading }] =
    useMutation<CreateCommentResponse>(`/api/comment/${id}`, "POST");
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onValid = ({ comment }: FormData) => {
    if (createCommentLoading) return;
    if (!user) {
      Swal.fire({
        title: "로그인이 필요합니다!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#475569",
        cancelButtonColor: "#d33",
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
          return;
        } else {
          return;
        }
      });
    } else {
      Swal.fire({
        title: "댓글을 등록하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#475569",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            createComment({ comment, userId });
          } catch (err: any) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "댓글 등록에 실패했습니다.",
              footer: `Error : ${err?.message}`,
              confirmButtonColor: "#475569",
              denyButtonColor: "#475569",
              cancelButtonColor: "#475569",
            });
          } finally {
            reset();
          }
        }
      });
    }
  };

  useEffect(() => {
    if (commentData && commentData?.ok) {
      mutate();
      countMutate();
    }
  }, [mutate, commentData]);

  return (
    <div className="mt-6 space-y-6">
      <div className="text-2xl font-bold dark:bg-slate-900 dark:text-white">
        {count} 개의 댓글이 있습니다.
      </div>
      <form className="relative" onSubmit={handleSubmit(onValid)}>
        <TextArea register={register("comment", { required: true })}></TextArea>
        <div className=" mt-4 flex justify-end">
          <Button text="댓글등록" />
        </div>
      </form>
      <div>
        {data?.comments.map((comment, index) => {
          return (
            <React.Fragment key={comment?.id}>
              <CommentCard
                id={id}
                userId={userId}
                comment={comment}
                countMutate={countMutate}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
