import Layout from "@components/Layout";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { orderAtom, OrderBy, pageAtom, searchAtom } from "@atom/atom";
import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import client from "@libs/server/client";
import { Post, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import PostCard from "@components/PostCard";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import jsonSerialize from "@libs/server/jsonSerialize";
import LazyHydrate from "react-lazy-hydration";
export interface PostWithInclude extends Post {
  user: User;
  postTags: {
    tag: {
      name: string;
    };
  }[];
}
export interface IProps {
  postsOrderedFavs: PostWithInclude[];
  postsOrderedLatest: PostWithInclude[];
  postsCount: number;
}
interface SearchForm {
  search: string;
}

const Home: NextPage<IProps> = ({
  postsOrderedFavs,
  postsOrderedLatest,
  postsCount,
}) => {
  const router = useRouter();
  const [orderBy, setOrderBy] = useRecoilState(orderAtom);
  const [searchChar, setSearchChar] = useRecoilState(searchAtom);
  const [currentPage, setCurrentPage] = useRecoilState(pageAtom);
  const [prevent, setPrevent] = useState(false);
  const { register, handleSubmit, reset } = useForm<SearchForm>();
  const onValid = ({ search }: SearchForm) => {
    setCurrentPage(1);
    setSearchChar(search);
  };
  const orderByHandle = (kind: OrderBy) => {
    setOrderBy(kind);
  };
  const searchReset = () => {
    setSearchChar("");
    reset();
  };

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      setCurrentPage((p) => p + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>modu | 모두의 HOOK</title>
        <meta
          property="description"
          content="모두의 HOOK 개발자 동료들에게 도움이 되는 여러분의 훅을 공유해보세요."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:title" content="modu" />
        <meta
          property="og:description"
          content="모두의 HOOK 개발자 동료들에게 도움이 되는 여러분의 훅을 공유해보세요."
        />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://modu.vercel.app" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="modu" />
        <meta property="twitter:title" content="modu" />
        <meta
          property="twitter:description"
          content="모두의 HOOK 개발자 동료들에게 도움이 되는 여러분의 훅을 공유해보세요."
        />
        <meta property="twitter:image" content="/images/modu.png" />
        <meta property="twitter:url" content="https://modu.vercel.app" />
        <meta
          name="google-site-verification"
          content="jP_LRgp2ourifn-dveaqSx3v-cBhd7cwuHbUlM6bsA4"
        />
        <meta
          name="naver-site-verification"
          content="f1cd025c016baf42759f26be4272879cff3e8d8c"
        />
      </Head>
      <Layout>
        {/* main */}

        <div className="flex h-[30rem] w-full items-center justify-start bg-white dark:bg-slate-900">
          <div className="z-[1] space-y-8 p-4">
            <div className="font-gugi text-6xl font-bold dark:text-white">
              모두의 HOOK
            </div>
            <div className="whitespace-nowrap text-2xl font-bold dark:text-white">
              개발자 동료들에게 도움이 되는 여러분의 훅을 공유해보세요.
            </div>
            <div className="flex items-center whitespace-nowrap text-2xl font-bold  dark:text-white ">
              <motion.div
                whileHover={{ translateX: 50 }}
                onClick={() => router.push("/trend")}
                className=" flex cursor-pointer items-center font-gugi hover:text-[#2ecc71] dark:hover:text-[#2ecc71]"
              >
                <span>- npm 트렌드 비교하기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2ecc71"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
          <motion.div
            animate={{ translateY: [50, 40, 50] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="hidden lg:block"
          >
            <Image
              width={1000}
              height={550}
              src="/images/main4.svg"
              draggable="false"
              alt=""
            />
          </motion.div>
        </div>
        {/* search */}

        {/* posts */}
        <LazyHydrate whenVisible>
          <div>
            <div className="flex h-[10rem] w-full items-center justify-between space-x-8 bg-white px-8 pt-8 dark:bg-slate-900">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex items-center space-x-4"
              >
                <label>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#2ecc71"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </motion.svg>
                </label>
                <input
                  {...register("search")}
                  type="text"
                  autoComplete="off"
                  defaultValue={searchChar}
                  className="w-[50%] appearance-none border-0 border-b-2 border-gray-400 bg-transparent text-2xl font-bold text-gray-800 focus:border-b-2 focus:border-[#2ecc71]  focus:outline-none focus:ring-0 dark:border-white dark:bg-slate-900 dark:text-white"
                />
                <button className="cursor-pointer whitespace-nowrap text-2xl font-bold text-gray-800 dark:text-white">
                  검색
                </button>
                <div
                  onClick={searchReset}
                  className="cursor-pointer whitespace-nowrap text-2xl font-bold text-gray-800 dark:text-white"
                >
                  초기화
                </div>
              </form>

              <div className="flex items-center space-x-4">
                <div
                  onClick={() => orderByHandle(OrderBy.favs)}
                  className={cls(
                    "flex cursor-pointer items-center text-2xl font-bold ",
                    orderBy === OrderBy.favs
                      ? "text-[#2ecc71]"
                      : "text-gray-800 dark:text-white"
                  )}
                >
                  {/* orderBy */}
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
                  <span className="whitespace-nowrap">인기</span>
                </div>
                <div
                  onClick={() => orderByHandle(OrderBy.latest)}
                  className={cls(
                    "flex cursor-pointer items-center text-2xl font-bold ",
                    orderBy === OrderBy.latest
                      ? "text-[#2ecc71]"
                      : "text-gray-800 dark:text-white"
                  )}
                >
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
                  <span className="whitespace-nowrap">최신</span>
                </div>
                {/* <div className="cursor-pointer whitespace-nowrap text-2xl font-bold text-gray-800 dark:text-white">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div> */}
              </div>
            </div>
            <div className="space-x-2 px-8 text-lg font-bold text-gray-600 dark:text-white">
              <span className="text-[#2ecc71]">✔</span>
              <span>제목과 태그를 기반으로 검색합니다.</span>
            </div>

            <div className="mx-12 mt-12 grid grid-cols-2 gap-6  pb-12 xl:grid-cols-3 2xl:grid-cols-4">
              {orderBy === OrderBy.favs
                ? postsOrderedFavs?.map((post, index) => {
                    const page = 12 * currentPage;
                    if (index >= page) return;
                    if (searchChar) {
                      if (
                        post?.title
                          ?.toLowerCase()
                          ?.includes(searchChar.toLowerCase())
                      ) {
                        return (
                          <LazyHydrate whenVisible key={index}>
                            <PostCard post={post} />
                          </LazyHydrate>
                        );
                      } else {
                        const tags = post?.postTags?.map((tag) => {
                          return tag?.tag?.name?.toLowerCase();
                        });
                        if (tags?.includes(searchChar.toLowerCase())) {
                          return (
                            <LazyHydrate whenVisible key={index}>
                              <PostCard post={post} />
                            </LazyHydrate>
                          );
                        }
                      }
                    } else {
                      return (
                        <LazyHydrate whenVisible key={index}>
                          <PostCard post={post} />
                        </LazyHydrate>
                      );
                    }
                  })
                : postsOrderedLatest?.map((post, index) => {
                    const page = 12 * currentPage;
                    if (index >= page) return;
                    if (searchChar) {
                      console.log("??????", post?.title?.toLowerCase());
                      if (
                        post?.title
                          ?.toLowerCase()
                          ?.includes(searchChar.toLowerCase())
                      ) {
                        return (
                          <LazyHydrate whenVisible key={index}>
                            <PostCard post={post} />
                          </LazyHydrate>
                        );
                      } else {
                        const tags = post?.postTags?.map((tag) => {
                          return tag?.tag?.name?.toLowerCase();
                        });
                        if (tags?.includes(searchChar.toLowerCase())) {
                          return (
                            <LazyHydrate whenVisible key={index}>
                              <PostCard post={post} />
                            </LazyHydrate>
                          );
                        }
                      }
                    } else {
                      return (
                        <LazyHydrate whenVisible key={index}>
                          <PostCard post={post} />
                        </LazyHydrate>
                      );
                    }
                  })}
            </div>
          </div>
        </LazyHydrate>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx: any) => {
  try {
    const postsOrderedFavs = await client.post.findMany({
      orderBy: [
        {
          favs: {
            _count: "desc",
          },
        },
      ],
      select: {
        id: true,
        thumnail: true,
        userId: true,
        views: true,
        title: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        postTags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const postsOrderedLatest = await client.post.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        thumnail: true,
        userId: true,
        views: true,
        title: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        postTags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const postsCount = await client.post.count();
    return {
      props: {
        postsOrderedFavs: jsonSerialize(postsOrderedFavs),
        postsOrderedLatest: jsonSerialize(postsOrderedLatest),
        postsCount,
      },
      revalidate: 60,
    };
  } catch {
    return {
      redirect: {
        props: null,
        permanent: false,
        destination: "/500",
      },
    };
  }
};
export default Home;
