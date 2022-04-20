// SWR + SSR
import Layout from "@components/Layout";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Button from "@components/button";
import "@toast-ui/editor/dist/toastui-editor.css";
import WysiwygEditor from "@components/WysiwygEditor";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { Post } from "@prisma/client";
interface PostForm {
  title: string;
}
interface PostCreateResponse {
  ok: boolean;
  post: Post;
}
const Write: NextPage = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { register, handleSubmit } = useForm<PostForm>();
  const [postSubmit, { data, loading }] = useMutation<PostCreateResponse>(
    `/api/post`,
    "POST"
  );
  const onValid = ({ title }: PostForm) => {
    if (loading) return;
    postSubmit({
      title,
      content,
    });
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/post/${data.post.id}`);
    }
  }, [data, router]);
  return (
    <Layout>
      <div className="right-0 left-0 m-auto mt-32 w-[70%] min-w-[800px] bg-white p-12 text-gray-800 ">
        {/* post header */}
        <form onSubmit={handleSubmit(onValid)}>
          <div className="space-y-12">
            <div className="w-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </div>
            {/* title */}
            <input
              {...register("title", { required: true })}
              placeholder="제목을 입력해주세요"
              required
              className="w-full appearance-none border-b-2 p-2 text-4xl font-bold focus:outline-none"
            ></input>
            {/* tag */}
            <div className="flex items-center space-x-2 pb-8">
              <div className="w-auto rounded-xl bg-slate-500 py-1 px-2  font-bold text-white">
                React
              </div>
              <div className="w-auto rounded-xl bg-slate-500 py-1 px-2  font-bold text-white">
                Next.js
              </div>
              <div className="w-auto rounded-xl bg-slate-500 py-1 px-2  font-bold text-white">
                Typescript
              </div>
              <div className="item-center flex cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-base font-semibold text-slate-500">
                  태그추가
                </span>
              </div>
            </div>
          </div>
          <WysiwygEditor onChange={(value) => setContent(value)} />
          <div className="flex justify-end space-x-2 p-4">
            <Button text="글 등록" large css="bg-slate-800"></Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Write;
