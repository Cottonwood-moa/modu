import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { Comment } from "@prisma/client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "./button";
import TextArea from "./textarea";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
interface CommentProps {
  id: number;
  userId: string;
  count: number;
  countMutate: () => void;
}
interface CommentWithUser extends Comment {
  user: {
    id: string;
    name: string;
    image: string;
  };
}
interface CommentResponse {
  ok: boolean;
  comments: CommentWithUser[];
}
interface FormData {
  comment: string;
}
interface CreateCommentResponse {
  ok: boolean;
}
export default function PostComment({
  id,
  userId,
  count,
  countMutate,
}: CommentProps) {
  const { data, mutate } = useSWR<CommentResponse>(
    id ? `/api/comment/${id}` : null
  );
  const [createComment, { data: commentData, loading: createCommentLoading }] =
    useMutation<CreateCommentResponse>(`/api/comment/${id}`, "POST");
  const [deleteComment, { data: deleteData, loading: deleteCommentLoading }] =
    useMutation<CreateCommentResponse>(`/api/comment/${id}`, "DELETE");
  const { user } = useUser();
  const router = useRouter();
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
  useEffect(() => {
    if (commentData && commentData?.ok) {
      mutate();
      countMutate();
    }
  }, [mutate, commentData]);
  useEffect(() => {
    if (deleteData && deleteData?.ok) {
      mutate();
      countMutate();
    }
  }, [mutate, deleteData]);
  return (
    <div className="mt-6 space-y-6">
      <div className="text-2xl font-bold">{count} 개의 댓글이 있습니다.</div>
      <form className="relative" onSubmit={handleSubmit(onValid)}>
        <TextArea register={register("comment", { required: true })}></TextArea>
        <div className=" mt-4 flex justify-end">
          <Button text="댓글등록" />
        </div>
      </form>
      <div className="divide-y-[2px]">
        {data?.comments.map((comment, index) => {
          return (
            <React.Fragment key={comment?.id}>
              <div className="flex justify-between">
                <div className="flex flex-col space-x-6 p-2">
                  {/* comment profile */}
                  <div className="flex items-center space-x-6">
                    <Image
                      src={
                        comment?.user?.image
                          ? comment?.user?.image
                          : "/images/react.png"
                      }
                      width={48}
                      height={48}
                      className="rounded-full"
                      alt=""
                    />
                    <div>
                      <div className="text-lg font-bold text-gray-700 xl:text-xl ">
                        {userId === comment?.user?.id ? (
                          <span className="mr-6 rounded-2xl bg-orange-300 py-1 px-2 text-xs font-bold text-white">
                            작성자
                          </span>
                        ) : null}
                        {comment?.user?.name}
                      </div>
                      <div className="text-sm font-semibold text-gray-400 xl:text-base">
                        {comment?.createdAt}
                      </div>
                    </div>
                  </div>
                  {/* detail  */}
                  <div className="m-6 text-base  font-semibold xl:text-lg">
                    {comment?.content}
                  </div>
                </div>
                {comment?.user?.id === user?.id ? (
                  <div
                    className="flex cursor-pointer items-center whitespace-nowrap p-2 text-base font-normal text-gray-400"
                    onClick={() => deleteHandle(comment?.id)}
                  >
                    삭제
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
