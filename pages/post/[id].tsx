/* eslint-disable react/no-children-prop */
// SWR + SSR
import Layout from "@components/Layout";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import client from "@libs/server/client";
import { Post, Tag, User } from "@prisma/client";
import jsonSerialize from "@libs/server/jsonSerialize";
import PostComment from "@components/PostComment";
// import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PageLoading from "@components/pageLoading";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import Swal from "sweetalert2";
import ParsingCreatedAt from "@libs/client/parsingCreatedAt";
import { orderAtom, pageAtom } from "@atom/atom";
import { useRecoilState } from "recoil";
import ImageDelivery from "@libs/client/imageDelivery";
import OutsideClickHandler from "react-outside-click-handler";
import replaceMultiple from "@libs/client/replaceAllMultiple";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
export interface PostWithUser extends Post {
  user: User;
}
interface IsLikedResponse {
  ok: boolean;
  liked: boolean;
}
interface ITags {
  tag: Tag;
}
interface staticProps {
  id: number;
  userId: string;
  title: string;
  content: string;
  name: string;
  avatar: string;
  createdAt: string;
  tags: ITags[];
}
interface CountResponse {
  ok: boolean;
  count: {
    favs: number;
    comments: number;
  };
}

interface Fav {
  user: User;
}

interface FavsList {
  favs: Fav[];
}

interface FavsListResponse {
  ok: boolean;
  favsList: FavsList;
}
const PostDetail: NextPage<staticProps> = ({
  title,
  content,
  name,
  avatar,
  createdAt,
  id,
  userId,
  tags,
}) => {
  const router = useRouter();
  const [orderBy, setOrderBy] = useRecoilState(orderAtom);
  const [currentPage, setCurrentPage] = useRecoilState(pageAtom);
  const [favsListDetail, setFavsListDetail] = useState(false);
  const { mutate: speMutate } = useSWRConfig();
  const { user } = useUser();
  const { data, mutate } = useSWR<IsLikedResponse>(
    userId && id
      ? `/api/post/fav?userId=${user?.id}&postId=${id}&postUserId=${userId}`
      : null
  );

  const { data: favsList, mutate: favsListMutate } = useSWR<FavsListResponse>(
    id ? `/api/post/favsList?postId=${id}` : null
  );
  console.log("favsList", favsList);

  const { data: count, mutate: countMutate } = useSWR<CountResponse>(
    id ? `/api/post/count?postId=${id}` : null
  );
  const [like, { loading }] = useMutation(`/api/post/fav`, "POST");
  const likeClickHandle = () => {
    if (loading && !data) return;
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
      mutate((prev) => prev && { ...prev, liked: !prev.liked }, false);
      like({
        userId: user?.id,
        postId: id,
      });
    }
  };
  const postDeleteHandle = () => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          fetch(`/api/post/delete?postId=${id}`);
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "게시글을 삭제하지 못했습니다.",
            footer: `Error : ${err?.message}`,
            confirmButtonColor: "#475569",
            denyButtonColor: "#475569",
            cancelButtonColor: "#475569",
          });
        } finally {
          speMutate(`/api/post?page=${currentPage}&order=${orderBy}`);
          router.push("/");
        }
      }
    });
  };
  const goToEdit = () => {
    router.push(
      {
        pathname: `/post/edit/${id}`,
        query: {
          userId: user?.id,
        },
      },
      `/post/edit/${id}`
    );
  };
  useEffect(() => {
    if (!loading) {
      mutate();
      countMutate();
    }
  }, [loading]);
  useEffect(() => {
    if (!id) return;
    // if (user?.id === userId) return;
    (async () => {
      await fetch(`/api/post/views?postId=${id}`);
    })();
  }, [id]);

  if (router.isFallback) {
    return <PageLoading />;
  }
  return (
    <Layout>
      <div className="right-0 left-0 m-auto mt-32 w-[60%] min-w-[800px] bg-white p-12 text-gray-800 dark:bg-slate-800 dark:text-white ">
        {/* post header */}
        <div className="space-y-12">
          <div className="flex w-full items-center justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              onClick={() => router.back()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
            <div className="flex flex-col items-center space-x-1 space-y-4">
              {data?.liked ? (
                <div className="flex items-center">
                  <motion.div
                    layoutId="liked"
                    onClick={likeClickHandle}
                    animate={{ rotate: 360 }}
                    whileHover={{ scale: 1.2 }}
                    className={
                      "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400"
                    }
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </motion.div>
                  <div className="mx-2 text-3xl font-bold">
                    {count ? count?.count?.favs : 0}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <motion.div
                    layoutId="liked"
                    onClick={likeClickHandle}
                    animate={{ rotate: 0 }}
                    whileHover={{ scale: 1.2 }}
                    className={
                      "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400"
                    }
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </motion.div>
                  <div className="mx-2 text-3xl font-bold">
                    {count ? count?.count?.favs : 0}
                  </div>
                </div>
              )}
              {/* 좋아요 목록 보류 */}
              {/* <div className="flex items-center">
                <div
                  className="pr-1 text-2xl font-bold"
                  onClick={() => setFavsListDetail(true)}
                >
                  +
                </div>
                <OutsideClickHandler
                  onOutsideClick={() => setFavsListDetail(false)}
                >
                  <AnimatePresence>
                    {favsListDetail ? (
                      <motion.div
                        initial={{
                          opacity: 0,
                          translateY: -20,
                          translateX: -30,
                        }}
                        animate={{
                          opacity: 1,
                          translateY: 30,
                          translateX: -30,
                        }}
                        exit={{ opacity: 0, translateY: -20, translateX: -30 }}
                        className="absolute h-[24rem] w-[20rem] rounded-lg bg-red-400"
                      ></motion.div>
                    ) : null}
                  </AnimatePresence>
                </OutsideClickHandler>

                {favsList?.favsList?.favs?.map((fav, index) => {
                  return (
                    <div key={index}>
                      {fav?.user?.image?.includes("https") ? (
                        <Image
                          src={
                            fav?.user?.image
                              ? fav?.user?.image
                              : "/images/modu.png"
                          }
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full bg-slate-600"
                          alt=""
                        />
                      ) : (
                        <Image
                          src={
                            fav?.user?.image
                              ? ImageDelivery(fav?.user?.image)
                              : "/images/modu.png"
                          }
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full bg-slate-600"
                          alt=""
                        />
                      )}
                    </div>
                  );
                })}
              </div> */}
            </div>
          </div>
          {/* title */}
          <div className="w-full text-3xl font-bold xl:text-4xl 2xl:text-5xl">
            {title}
          </div>
          {userId === user?.id ? (
            <div className="flex items-center space-x-2 text-xl font-bold text-gray-400">
              <div className="cursor-pointer " onClick={goToEdit}>
                수정
              </div>
              <span>/</span>
              <div onClick={postDeleteHandle} className="cursor-pointer ">
                삭제
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* user & date */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              {console.log("avatar", avatar)}
              {avatar.includes("https") ? (
                <Image
                  src={avatar}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full bg-slate-600"
                  alt=""
                />
              ) : (
                <Image
                  src={ImageDelivery(avatar, "avatar")}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full bg-slate-600"
                  alt=""
                />
              )}
              <span className="text-lg font-semibold xl:text-2xl ">{name}</span>
            </div>
            <div className="text-lg font-semibold text-slate-500 dark:text-white xl:text-2xl">
              {ParsingCreatedAt(createdAt)}
            </div>
          </div>
          {/* tag */}
          <div className="space-x-2 border-b-2 pb-8">
            {tags?.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="m-1 inline-block w-auto rounded-xl bg-slate-500 py-1 px-2 font-bold text-white"
                >
                  # {tag?.tag?.name}
                </div>
              );
            })}
          </div>
        </div>
        {/* post content */}
        <div className="post-content py-12">
          <ReactMarkdown
            className="react-markdown"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            children={content?.replaceAll("\n", "\n\n")}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={replaceMultiple(`${String(children)}`, [
                      { "\n\n": "\n" },
                    ])}
                    style={a11yDark}
                    language={match[1]}
                    PreTag="main"
                    {...props}
                  />
                ) : (
                  <SyntaxHighlighter
                    children={String(children).replaceAll("\n\n", "\n")}
                    style={a11yDark}
                    language="textile"
                    PreTag="main"
                    {...props}
                  />
                );
              },
              main({ node, children, ...props }) {
                return (
                  // @ts-ignore
                  <div className="code" {...props}>
                    {children}
                  </div>
                );
              },
              // 인용문
              blockquote({ node, children, ...props }) {
                return (
                  // @ts-ignore
                  <div className="block-quote" {...props}>
                    {children}
                  </div>
                );
              },
            }}
          />
        </div>

        <PostComment
          id={id}
          userId={userId}
          count={count ? count?.count?.comments : 0}
          countMutate={countMutate}
        />
        {/* 추천 글 */}
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
  try {
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
        postTags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        // favs:{
        //   select:{
        //     user:{
        //       select:{
        //         id:true,
        //         image:true,
        //         name:true
        //       }
        //     }
        //   }
        // }
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
        id: post?.id,
        title: post?.title,
        content: post?.content,
        userId: post?.user?.id,
        name: post?.user?.name,
        avatar: post?.user?.image,
        tags: post?.postTags,
        createdAt: jsonSerialize(post?.createdAt),
      },
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/500",
      },
    };
  }
};
export default PostDetail;
