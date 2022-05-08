/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
// SWR + SSR
import Layout from "@components/Layout";
import dynamic from "next/dynamic";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import client from "@libs/server/client";
import { Post, Tag, User } from "@prisma/client";
import { motion } from "framer-motion";
import jsonSerialize from "@libs/server/jsonSerialize";
// import PostComment from "@components/PostComment";
// import ReactMarkdown from "react-markdown";
import PageLoading from "@components/pageLoading";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import useSWR, { useSWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import Swal from "sweetalert2";
import ParsingCreatedAt from "@libs/client/parsingCreatedAt";
import { orderAtom, pageAtom } from "@atom/atom";
import { useRecoilState } from "recoil";
import ImageDelivery from "@libs/client/imageDelivery";
import numberWithCommas from "@libs/client/numberWithComma";
import LazyHydrate from "react-lazy-hydration";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const PostComment = dynamic(() => import("@components/PostComment"), {
  ssr: false,
});
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
  views: number;
  tags: ITags[];
  thumbnail: string;
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
  views,
  thumbnail,
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
  // const { data: favsList, mutate: favsListMutate } = useSWR<FavsListResponse>(
  //   id ? `/api/post/favsList?postId=${id}` : null
  // );

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
        Swal.fire({
          title: "게시글을 삭제중입니다.",
          imageUrl:
            "https://media1.giphy.com/media/2SEf4i4wdOC0E0rXzc/giphy.gif?cid=ecf05e47snavxkpeg0qpazivghzmcw38ot6ddxtkzs1s6d5w&rid=giphy.gif&ct=s",
          showConfirmButton: false,
        });
        try {
          await fetch(`/api/post/delete?postId=${id}`);
          await fetch(`/api/post/revalidatePostDetail?postId=${id}`);
          await fetch(`/api/post/revalidate`);
          Swal.close();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  useEffect(() => {
    if (!id) return;
    // if (user?.id === userId) return;
    (async () => {
      await fetch(`/api/post/views?postId=${id}`);
    })();
  }, [id]);

  if (!router.isFallback && !title) {
    return (
      <Layout>
        <PageLoading />
      </Layout>
    );
  }

  if (router.isFallback) {
    return (
      <Layout>
        <PageLoading />
      </Layout>
    );
  }
  return (
    <>
      <Head>
        <title>modu | {title}</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={tags?.map((tag) => tag?.tag?.name).toString()}
        />
        <meta
          property="og:image"
          content={`https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${thumbnail}/thumbnail`}
        />
        <meta property="og:url" content={`https://modu.vercel.app/${id}`} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="modu" />
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:description"
          content={tags?.map((tag) => tag?.tag?.name).toString()}
        />
        <meta
          property="twitter:image"
          content={`https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${thumbnail}/thumbnail`}
        />
        <meta
          property="twitter:url"
          content={`https://modu.vercel.app/${id}`}
        />
      </Head>
      <Layout>
        <motion.div
          initial={{ translateY: 2000, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          className="right-0 left-0 m-auto mt-32 w-[60%] min-w-[800px] bg-white p-12 text-gray-800 dark:bg-slate-900 dark:text-white "
        >
          {/* post header */}
          <LazyHydrate whenVisible>
            <div className="space-y-12">
              <div className="flex  w-full items-center justify-between">
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
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-gray-800 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentcolor"
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
                    <span className="text-xl font-bold">
                      {numberWithCommas(views)}
                    </span>
                  </div>

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
                <div
                  className="flex cursor-pointer items-center space-x-2"
                  onClick={() => router.push(`/myPage/${userId}`)}
                >
                  {avatar.includes("https") ? (
                    <img
                      src={avatar}
                      className="h-12 w-12 rounded-full bg-slate-600"
                      alt=""
                    />
                  ) : (
                    <img
                      src={ImageDelivery(avatar, "avatar")}
                      className="h-12 w-12 rounded-full bg-slate-600"
                      alt=""
                    />
                  )}
                  <span className="text-lg font-semibold xl:text-2xl ">
                    {name}
                  </span>
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
          </LazyHydrate>
          {/* post content */}
          {content && (
            <LazyHydrate whenVisible>
              <div className="post-content pb-12">
                <ReactMarkdown
                  className="react-markdown"
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  children={content?.replace(/\n/g, "\n\n")}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <>
                          <div className="flex h-12 w-full items-center space-x-2 rounded-t-[4px] bg-gray-600 px-4">
                            <div className="h-4 w-4 rounded-full bg-red-400"></div>
                            <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
                            <div className="h-4 w-4 rounded-full bg-green-400"></div>
                          </div>
                          <SyntaxHighlighter
                            children={String(children).replace(/\n\n/g, "\n")}
                            style={a11yDark}
                            language={match[1]}
                            PreTag="main"
                            {...props}
                          />
                        </>
                      ) : (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n\n/g, "\n")}
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
                        <>
                          <div className="code" {...props}>
                            {children}
                          </div>
                        </>
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
            </LazyHydrate>
          )}

          <PostComment
            id={id}
            userId={userId}
            count={count ? count?.count?.comments : 0}
            countMutate={countMutate}
          />
          {/* 추천 글 */}
        </motion.div>
      </Layout>
    </>
  );
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
      },
    });
    if (!post)
      return {
        props: null,
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
        views: post?.views,
        thumbnail: post?.thumnail,
        createdAt: jsonSerialize(post?.createdAt),
      },
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
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
export default PostDetail;
