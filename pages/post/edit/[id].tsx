// SWR + SSR
import Layout from "@components/Layout";
import type { GetServerSideProps, NextPage } from "next";
import { motion } from "framer-motion";
import client from "@libs/server/client";
import React, { useEffect, useState } from "react";
import Button from "@components/button";
import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import Head from "next/head";
import WysiwygEditor from "@components/WysiwygEditor";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { Post, Tag } from "@prisma/client";
import Swal from "sweetalert2";
import OutsideClickHandler from "react-outside-click-handler";
import TagForm from "@components/tagForm";
import ImageDelivery from "@libs/client/imageDelivery";
import useUser from "@libs/client/useUser";

interface PostForm {
  title: string;
  thumbnail: string;
}
interface PostCreateResponse {
  ok: boolean;
  post: Post;
}
interface ITags {
  tag: Tag;
}
interface EditProps {
  id: number;
  prevTitle: string;
  prevContent: string;
  prevThumbnail: string;
  prevTags: ITags[];
  userId: string;
}
const Write: NextPage<EditProps> = ({
  id,
  prevTitle,
  prevContent,
  prevThumbnail,
  prevTags,
  userId,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [info, setInfo] = useState(false);
  const [uploadThumb, setUploadThumb] = useState(false);
  const [content, setContent] = useState(prevContent);
  const prevTagsArray = prevTags.map((postTag) => {
    return postTag?.tag?.name;
  });
  const [tags, setTags] = useState<string[]>(prevTagsArray);
  const { register, handleSubmit, watch } = useForm<PostForm>({
    defaultValues: {
      title: prevTitle,
    },
  });
  const [postSubmit, { data, loading }] = useMutation<PostCreateResponse>(
    `/api/post?postId=${id}`,
    "POST"
  );
  const revalidateHandler = async () => {
    const data = await (
      await fetch(`/api/post/revalidate?postId=${id}`)
    ).json();
    if (data.ok) router.replace(`/post/${id}`).then(() => router.reload());
  };
  const onValid = ({ title, thumbnail }: PostForm) => {
    if (loading) return;
    if (tags.length < 1) {
      Swal.fire({
        icon: "error",
        title: "최소 하나의 태그를 작성해주세요.",
        confirmButtonColor: "#475569",
        denyButtonColor: "#475569",
        cancelButtonColor: "#475569",
      });
      return;
    }
    Swal.fire({
      title: "게시글을 등록하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (thumbnail && thumbnail.length > 0) {
            Swal.fire({
              title: "게시글을 발행중입니다.",
              imageUrl:
                "https://media2.giphy.com/media/Qst7IVhmrF045J2cBF/200w.webp?cid=ecf05e47uqm92thxj8d7j6e0etujb1wyszk7s67uom3pon4j&rid=200w.webp&ct=s",
              showConfirmButton: false,
            });
            const { uploadURL } = await (await fetch(`/api/files`)).json();
            const form = new FormData();
            form.append("file", thumbnail[0]);
            const {
              result: { id },
            } = await (
              await fetch(uploadURL, {
                method: "POST",
                body: form,
              })
            ).json();
            await postSubmit({
              title,
              content,
              thumbnailId: id,
              tags: tags,
            })
              .then(() => revalidateHandler())
              .finally(() => Swal.close());
          } else {
            Swal.fire({
              title: "게시글을 발행중입니다.",
              imageUrl:
                "https://media2.giphy.com/media/Qst7IVhmrF045J2cBF/200w.webp?cid=ecf05e47uqm92thxj8d7j6e0etujb1wyszk7s67uom3pon4j&rid=200w.webp&ct=s",
              showConfirmButton: false,
            });
            await postSubmit({
              title,
              content,
              thumbnailId: prevThumbnail,
              tags: tags,
            })
              .then(() => revalidateHandler())
              .finally(() => Swal.close());
          }
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "게시글 등록에 실패했습니다.",
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
    if (userId !== user?.id) router.replace("/404");
  }, [router, user, userId]);
  const thumbnailImage = watch("thumbnail");
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState("");
  useEffect(() => {
    if (thumbnailImage && thumbnailImage.length > 0)
      // @ts-ignore
      setThumbnailImagePreview(URL.createObjectURL(thumbnailImage[0]));
  }, [thumbnailImage, setThumbnailImagePreview]);
  return (
    <>
      <Head>
        <title>modu | 게시글 수정</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:title" content="modu" />
        <meta property="og:description" content="게시글 수정" />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://modu.vercel.app" />
      </Head>
      <Layout>
        <div className="right-0 left-0 m-auto mt-32 w-[90%] min-w-[1000px] bg-white p-12 text-gray-800 dark:bg-slate-900 dark:text-white ">
          {/* post header */}
          <form onSubmit={handleSubmit(onValid)}>
            <div className="space-y-12">
              <div className="w-full ">
                <svg
                  onClick={() => router.back()}
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
                {...register("title", {
                  required: true,
                  minLength: 2,
                  maxLength: 50,
                })}
                onKeyPress={(
                  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                placeholder="제목을 입력해주세요"
                minLength={2}
                maxLength={50}
                required
                className="w-full appearance-none border-b-2 p-2 text-4xl font-bold focus:outline-none dark:bg-slate-900"
              ></input>
              {/* tag */}

              <TagForm setTags={setTags} tags={tags} />
            </div>
            <div className="text-editor">
              <WysiwygEditor
                onChange={(value) => setContent(value)}
                initialValue={content}
              />
            </div>
            {info ? (
              <OutsideClickHandler onOutsideClick={() => setInfo(false)}>
                <motion.div
                  initial={{ x: -400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="   fixed top-56 left-0 z-10 space-y-2 rounded-lg bg-slate-700 p-6 text-xl font-bold text-white shadow-lg xl:left-28"
                >
                  <p>1. 코드 블럭을 넣을 땐</p>
                  <p className="my-4">
                    ```js
                    <br />
                    some code <br />
                    ```
                  </p>
                  <p>이렇게 작성해주세요!</p>
                  <p>
                    지원하는 언어 확인 &rarr;&ensp;
                    <a
                      href="https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD"
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-300"
                    >
                      링크
                    </a>
                  </p>
                  <p>2. 썸네일 이미지는 옆 이미지 아이콘을 클릭해주세요.</p>
                  <p>3. 여러 줄을 띄울 땐 &lt;br /&gt; 태그를 사용해주세요.</p>
                  <p>
                    4. B(bold) 옵션은 배경 색이 있는
                    <span className="rounded-sm bg-[#ff7675] px-1 text-white">
                      text
                    </span>
                    로 전환됩니다.
                  </p>
                </motion.div>
              </OutsideClickHandler>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setInfo(true)}
                whileHover={{ scale: 1.2 }}
                className=" fixed left-0
              top-56 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white dark:bg-transparent dark:text-white  xl:left-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentcolor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
            )}
            {uploadThumb ? (
              <OutsideClickHandler onOutsideClick={() => setUploadThumb(false)}>
                {thumbnailImagePreview ? (
                  <label>
                    <motion.img
                      initial={{ x: -400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="fixed top-72 left-0 flex h-[300px] w-[350px] cursor-pointer rounded-lg bg-slate-700 shadow-xl xl:left-12"
                      src={thumbnailImagePreview}
                    ></motion.img>
                    <input
                      {...register("thumbnail")}
                      className="hidden"
                      type="file"
                      accept="image/*"
                    />
                  </label>
                ) : (
                  <label>
                    <motion.img
                      initial={{ x: -400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className=" fixed top-72 left-0 flex h-[300px] w-[350px] cursor-pointer rounded-lg bg-slate-700 shadow-xl xl:left-12"
                      src={ImageDelivery(prevThumbnail)}
                    ></motion.img>
                    <input
                      {...register("thumbnail")}
                      className="hidden"
                      type="file"
                      accept="image/*"
                    />
                  </label>
                )}
              </OutsideClickHandler>
            ) : (
              <motion.div
                onClick={() => setUploadThumb(true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className=" fixed left-0 top-72 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-700 bg-transparent text-white dark:bg-transparent dark:text-white xl:left-12"
              >
                <svg
                  className="h-8 w-8"
                  stroke="currentcolor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
            <div className="flex justify-end space-x-2 p-4">
              <Button text={"글 등록"} large css="bg-slate-900"></Button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const {
    params: { id },
    query: { userId },
  } = ctx;
  if (!userId) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
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
  if (post?.userId !== userId) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
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
      prevTitle: post?.title,
      prevContent: post?.content,
      prevTags: post?.postTags,
      prevThumbnail: post?.thumnail,
      userId,
    },
  };
};
export default Write;
