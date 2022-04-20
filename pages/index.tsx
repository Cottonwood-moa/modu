// useSWR Infinite loading
// 최신순, 인기순
//
import Layout from "@components/Layout";
import type { NextApiRequest, NextPage } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import CategoryIcon from "@components/categoryIcon";
import { useSession } from "next-auth/react";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import { UserSession } from "./api/user/session";
import { useRouter } from "next/router";
const Home: NextPage = () => {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const onSetCategory = (category: string) => {
    setCategory(category);
  };
  return (
    <Layout>
      {/* main */}
      <div className="flex h-[30rem] w-full items-center  justify-start space-x-24 bg-white">
        <div className="space-y-8 p-4">
          <div
            onClick={() => router.push("post/8")}
            className="text-6xl font-bold"
          >
            모두의 hook
          </div>
          <div className="text-2xl font-bold">
            개발자 동료들에게 도움이 되는 여러분의 훅을 공유해보세요.
          </div>
        </div>
        <div className="flex space-x-24">
          <div className="hidden lg:block ">
            <Image width={360} height={360} src="/images/main.svg" alt="" />
          </div>
        </div>
      </div>
      {/* category */}
      <div className="flex w-full  flex-wrap items-center justify-center space-x-2 bg-slate-200">
        {category && (
          <CategoryIcon layoutId="Posts" text="전체" onClick={onSetCategory} />
        )}
        {category === "React" || (
          <CategoryIcon layoutId="React" text="React" onClick={onSetCategory} />
        )}
      </div>
      {/* posts */}
      <div>
        <div className="flex h-[10rem] w-full items-center justify-between space-x-8 bg-white px-8 pt-8">
          {!category ? (
            <div className="flex items-center space-x-4">
              <CategoryIcon layoutId="Posts" onClick={onSetCategory} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-800"
              >
                전체
              </motion.div>
            </div>
          ) : (
            <></>
          )}
          {category === "React" ? (
            <div className="flex items-center space-x-4">
              <CategoryIcon layoutId="React" onClick={onSetCategory} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-800"
              >
                React
              </motion.div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex space-x-4">
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
              <span>인기</span>
            </div>
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>최신</span>
            </div>
          </div>
        </div>
        <div className="m-12 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[
            1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 11, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1,
          ].map((post, index) => {
            return (
              <div
                key={index}
                className="aspect-square w-full max-w-md rounded-lg bg-orange-500 p-4"
              >
                {index}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
export const getServerSideProps = async ({ req }: any) => {
  const session: UserSession = await getSession({ req });
  console.log(session);
  if (!session)
    return {
      props: {
        user: null,
      },
    };
  const user = await client.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  return {
    props: {
      user,
    },
  };
};
export default Home;
