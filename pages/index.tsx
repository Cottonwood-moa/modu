// useSWR Infinite loading
// 최신순, 인기순
//
import Layout from "@components/Layout";
import type { NextApiRequest, NextPage } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryIcon from "@components/categoryIcon";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";
import { UserSession } from "./api/user/session";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { Post, User } from "@prisma/client";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import useUser from "@libs/client/useUser";
import SkeletonCard from "@components/skeletonCard";
interface PostWithInclude extends Post {
  user: User;
  _count: {
    favs: number;
    comments: number;
  };
}
interface PostsResponse {
  ok: boolean;
  pages: number;
  posts: PostWithInclude[];
}
const Home: NextPage = () => {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const onSetCategory = (category: string) => {
    setCategory(category);
  };
  const toPostDetail = (id: number) => {
    router.push(`/post/${id}`);
  };
  const getKey = (pageIndex: number, previousPageData: PostsResponse) => {
    if (pageIndex === 0 && !previousPageData) return `/api/post?page=1`;
    if (pageIndex + 1 > previousPageData.pages) return null;
    return `/api/post?page=${pageIndex + 1}`;
  };
  const { data, setSize, isValidating, mutate } =
    useSWRInfinite<PostsResponse>(getKey);
  const posts = data ? data.map((post) => post?.posts).flat() : [];
  const page = useInfiniteScroll();
  useEffect(() => {
    if (isValidating) return;
    setSize(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSize, page]);
  useEffect(() => {
    mutate();
  }, []);
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
        <div className="m-12 grid grid-cols-2 gap-6  xl:grid-cols-3 2xl:grid-cols-4">
          {!data && isValidating
            ? Array.from({ length: 8 }, (v, i) => i).map((index) => {
                return <SkeletonCard key={index} />;
              })
            : posts?.map((post, index) => {
                return (
                  <motion.div
                    key={index}
                    whileHover={{
                      scale: 1.1,
                    }}
                    className="aspect-square w-full min-w-[300px] max-w-md cursor-pointer space-y-2 rounded-md bg-white p-4 shadow-lg"
                    onClick={() => toPostDetail(post.id)}
                  >
                    <div className="relative h-[80%] w-full">
                      <Image
                        className="rounded-md"
                        src={`https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${post.thumnail}/thumbnail`}
                        layout={"fill"}
                        alt=""
                      />
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold text-gray-800">
                      {post.title}
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-gray-600">
                      {post.content}
                    </div>
                    <div className="relative flex w-full items-center text-gray-800">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            post?.user?.image
                              ? post?.user?.image
                              : "/images/react.png"
                          }
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full bg-slate-600"
                          alt=""
                        />
                        <div>{post.user.name}</div>
                      </div>
                      <div className="absolute right-0 flex items-center justify-end space-x-2">
                        <div className="flex items-center space-x-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#d63031"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {/* ++++++++++++++++++++++++++++++변경필요 */}
                          <span>{post._count.favs}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#4B5563"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                            />
                          </svg>
                          <span>{post._count.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#4B5563"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </Layout>
  );
};
export const getServerSideProps = async ({ req }: any) => {
  const session: UserSession = await getSession({ req });
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
