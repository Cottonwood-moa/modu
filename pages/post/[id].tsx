// SWR + SSR
import Layout from "@components/Layout";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import React, { useState } from "react";
import TextArea from "@components/textarea";
import Button from "@components/button";
const Post: NextPage = () => {
  const [pop, setPop] = useState(false);
  const onPop = () => {
    setPop((prev) => !prev);
  };
  return (
    <Layout>
      <div className="bg-white w-[60%] right-0 left-0 m-auto min-w-[800px] mt-32 p-12 text-gray-800 ">
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
          <div className="w-full font-bold text-3xl xl:text-4xl 2xl:text-5xl">
            REACT 존속성 고차함수의 점진적 참조 값과 증분 재생성
          </div>
          {/* user & date */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-blue-500" />
              <span className="font-semibold text-lg xl:text-2xl ">박건우</span>
            </div>
            <div className="font-semibold text-lg xl:text-2xl text-slate-500">
              2022-04-19
            </div>
          </div>
          {/* tag */}
          <div className="space-x-2 border-b-2 pb-8">
            <div className="w-auto bg-slate-500 text-white font-bold rounded-xl inline-block py-1 px-2">
              React
            </div>
            <div className="w-auto bg-slate-500 text-white font-bold rounded-xl inline-block py-1 px-2">
              Next.js
            </div>
            <div className="w-auto bg-slate-500 text-white font-bold rounded-xl inline-block py-1 px-2">
              Typescript
            </div>
          </div>
        </div>
        {/* post content */}
        <div className=" h-[2000px] bg-slate-400 p-12"></div>
        {/* comment */}
        <div className="space-y-6 mt-6">
          <div className="font-bold text-2xl">0 개의 댓글이 있습니다.</div>
          <form className="relative ">
            <TextArea></TextArea>
            <div className=" flex justify-end mt-4">
              <Button text="댓글등록" />
            </div>
          </form>
          <div className="divide-y-[2px]">
            {[1, 2, 3, 4, 5].map((comment, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col space-x-6 p-6">
                    {/* comment profile */}
                    <div className="flex space-x-6">
                      <div className="w-16 h-16 rounded-full bg-slate-700" />
                      <div>
                        <div className="text-lg font-bold text-gray-700 xl:text-xl ">
                          Cottonwood
                        </div>
                        <div className="text-base font-semibold text-slate-700 xl:text-lg">
                          2022-04-19
                        </div>
                      </div>
                    </div>
                    {/* detail  */}
                    <div className="text-base font-semibold  m-6 xl:text-lg">
                      동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라
                      만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이
                      보전하세.
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 추천 글 */}
        {pop ? (
          <motion.div
            layoutId="pop"
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            className="hidden w-56 bg-white border border-gray-300 shadow-xl fixed right-12 top-64 rounded-xl  p-4 space-y-2 xl:block"
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
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">1.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">2.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">3.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">4.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">5.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">6.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
            <div className="text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-blue-500">7.</span> 동해물과 백두산이 마르고
              닳도록 하느님이
            </div>
          </motion.div>
        ) : (
          <motion.div
            layoutId="pop"
            animate={{ rotate: 360 }}
            onClick={onPop}
            className="hidden w-20 h-20 rounded-full bg-blue-300 fixed right-12 top-64 cursor-pointer items-center justify-center xl:flex"
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

export default Post;
