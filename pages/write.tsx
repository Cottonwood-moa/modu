// SWR + SSR
import Layout from "@components/Layout";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import React, { useState } from "react";
import TextArea from "@components/textarea";
import Button from "@components/button";
const Write: NextPage = () => {
  const [pop, setPop] = useState(false);
  const onPop = () => {
    setPop((prev) => !prev);
  };
  return (
    <Layout>
      <div className="bg-white w-[70%] right-0 left-0 m-auto min-w-[800px] mt-32 p-12 text-gray-800 ">
        {/* post header */}
        <form>
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
              placeholder="제목을 입력해주세요"
              className="w-full border-b-2 text-4xl font-bold p-2 appearance-none focus:outline-none"
            ></input>
            {/* tag */}
            <div className="space-x-2 pb-8 flex items-center">
              <div className="w-auto bg-slate-500 text-white font-bold rounded-xl  py-1 px-2">
                React
              </div>
              <div className="w-auto bg-slate-500 text-white font-bold rounded-xl  py-1 px-2">
                Next.js
              </div>
              <div className="w-auto bg-slate-500 text-white font-bold rounded-xl  py-1 px-2">
                Typescript
              </div>
              <div className="flex item-center cursor-pointer">
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
                <span className="font-semibold text-base text-slate-500">
                  태그추가
                </span>
              </div>
            </div>
          </div>
          <div className=" h-[800px] border-4 p-12"></div>
          <div className="flex space-x-2 p-4 justify-end">
            <Button text="취소" large css="bg-slate-400"></Button>
            <Button text="글 등록" large css="bg-slate-800"></Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Write;
