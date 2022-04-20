/* eslint-disable react/no-children-prop */
// SWR + SSR
import Layout from "@components/Layout";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { motion } from "framer-motion";
import React, { useState } from "react";
import client from "@libs/server/client";
import { Post, User } from "@prisma/client";
import jsonSerialize from "@libs/server/jsonSerialize";
import PostComment from "@components/PostComment";
// import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PageLoading from "@components/pageLoading";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
export interface PostWithUser extends Post {
  user: User;
}
interface staticProps {
  title: string;
  content: string;
  name: string;
  avatar: string;
  createdAt: string;
}
const PostDetail: NextPage<staticProps> = ({
  title,
  content,
  name,
  avatar,
  createdAt,
}) => {
  const router = useRouter();
  const [pop, setPop] = useState(false);
  const onPop = () => {
    setPop((prev) => !prev);
  };
  if (router.isFallback) {
    return <PageLoading text="포스트 생성중" />;
  }
  return (
    <Layout>
      <div className="right-0 left-0 m-auto mt-32 w-[60%] min-w-[800px] bg-white p-12 text-gray-800 ">
        {/* post header */}
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
          <div className="w-full text-3xl font-bold xl:text-4xl 2xl:text-5xl">
            {title}
          </div>
          {/* user & date */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded-full bg-blue-500" />
              <span className="text-lg font-semibold xl:text-2xl ">{name}</span>
            </div>
            <div className="text-lg font-semibold text-slate-500 xl:text-2xl">
              2022-04-19
            </div>
          </div>
          {/* tag */}
          <div className="space-x-2 border-b-2 pb-8">
            <div className="inline-block w-auto rounded-xl bg-slate-500 py-1 px-2 font-bold text-white">
              React
            </div>
            <div className="inline-block w-auto rounded-xl bg-slate-500 py-1 px-2 font-bold text-white">
              Next.js
            </div>
            <div className="inline-block w-auto rounded-xl bg-slate-500 py-1 px-2 font-bold text-white">
              Typescript
            </div>
          </div>
        </div>
        {/* post content */}
        <div className="post-content">
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={a11yDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
        <PostComment />
        {/* 추천 글 */}
        {pop ? (
          <motion.div
            layoutId="pop"
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            className="fixed right-12 top-64 hidden w-56 space-y-2 rounded-xl border border-gray-300 bg-white  p-4 shadow-xl xl:block"
          >
            <div className="flex justify-between ">
              <span>😀태그 기반 추천글</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                onClick={onPop}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">1.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">2.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">3.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">4.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">5.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">6.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
              <span className="text-blue-500">7.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
          </motion.div>
        ) : (
          <motion.div
            layoutId="pop"
            animate={{ rotate: 360 }}
            onClick={onPop}
            className="fixed right-12 top-64 hidden h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-blue-300 xl:flex"
          >
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
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps = async (ctx: any) => {
  const {
    params: { id },
  } = ctx;
  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
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
  if (!post)
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  return {
    props: {
      title: post?.title,
      content: post?.content,
      name: post?.user?.name,
      avatar: post?.user?.image,
      createdAt: jsonSerialize(post?.createdAt),
    },
  };
};
export default PostDetail;
