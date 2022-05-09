/* eslint-disable @next/next/no-img-element */
// Post detail

import Layout from "@components/Layout";
import { Link, Post, User } from "@prisma/client";
import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import ImageDelivery from "@libs/client/imageDelivery";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import ProfileSkeleton from "@components/profileSkeleton";
import Swal from "sweetalert2";
import { cls } from "@libs/client/utils";
import { signOut } from "next-auth/react";
import numberWithCommas from "@libs/client/numberWithComma";
import Head from "next/head";
import client from "@libs/server/client";
interface TagOnlyName {
  tag: {
    name: string;
  };
}
interface PostWithTag extends Post {
  postTags: TagOnlyName[];
  _count: {
    favs: number;
    comments: number;
  };
}
interface UserWithLinks extends User {
  links: Link[];
}

interface Profile {
  totalFavs: number;
  totalPosts: number;
  posts: PostWithTag[];
  pages: number;
}
interface IForm {
  avatar?: string;
  name?: string;
  intro?: string;
  url?: string;
  linkName?: string;
}
interface AvatarResponse {
  ok: boolean;
}
interface ProfileResponse extends Profile {
  ok: boolean;
}
interface DeleteUserResponse {
  ok: boolean;
}
interface IProps {
  user: UserWithLinks;
}
const Profile: NextPage<IProps> = ({ user }) => {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const { data, mutate } = useSWR<ProfileResponse>(
    router?.query?.id
      ? `/api/user/profile?id=${router?.query?.id}&page=${page}`
      : null
  );
  const { register, watch, setValue } = useForm<IForm>();
  const [avatarMutation, { data: avatarResponse }] =
    useMutation<AvatarResponse>(`/api/user/avatar`, "POST");
  const [nameMutation, { data: nameResponse, loading: nameLoading }] =
    useMutation<{ ok: boolean }>(`/api/user/updateName`, "POST");
  const [introMutation, { data: introResponse }] = useMutation<{ ok: boolean }>(
    `/api/user/updateIntro`,
    "POST"
  );
  const [linkMutation, { data: linkResponse }] = useMutation<{ ok: boolean }>(
    `/api/user/link`,
    "POST"
  );
  const [deleteUserMutation, { data: deleteUserResponse }] =
    useMutation<DeleteUserResponse>(`/api/user/session`, "DELETE");
  const [loadingState, setLoadingState] = useState(false);
  const avatar = watch("avatar");
  const watchName = watch("name");
  const watchIntro = watch("intro");
  const watchLinkName = watch("linkName");
  const watchUrl = watch("url");

  const onAvatarValid = async ({ avatar }: IForm) => {
    if (loggedUser?.id !== user?.id) return;
    setLoadingState(true);
    const { uploadURL } = await (await fetch(`/api/files`)).json();
    const form = new FormData();
    // @ts-ignore
    form.append("file", avatar[0]);
    const {
      result: { id },
    } = await (
      await fetch(uploadURL, {
        method: "POST",
        body: form,
      })
    ).json();
    avatarMutation({
      avatarId: id,
      loggedUserId: loggedUser?.id,
      userId: user?.id,
    });
    setLoadingState(false);
  };
  const onNameValid = async ({ name }: IForm) => {
    if (nameLoading) return;
    if (!name) {
      Swal.fire({
        icon: "error",
        title: "이름이 작성되지 않았습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (name && name?.length < 2) {
      Swal.fire({
        icon: "error",
        title: "이름은 두 글자 이상입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (name && name?.length > 10) {
      Swal.fire({
        icon: "error",
        title: "이름은 열 글자 이하입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (name === user?.name) {
      Swal.fire({
        icon: "error",
        title: "변경사항이 없습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    nameMutation({
      name,
      userId: user?.id,
      loggedUserId: loggedUser?.id,
    });
    Swal.fire({
      icon: "success",
      title: "이름이 변경되었습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
    return;
  };
  const onIntroValid = async ({ intro }: IForm) => {
    if (!intro) {
      Swal.fire({
        icon: "error",
        title: "소개가 작성되지 않았습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (intro && intro?.length < 2) {
      Swal.fire({
        icon: "error",
        title: "소개는 두 글자 이상 입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (intro && intro?.length > 100) {
      Swal.fire({
        icon: "error",
        title: "소개는 50 글자 이하 입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (intro === user?.introduce) {
      Swal.fire({
        icon: "error",
        title: "변경사항이 없습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    introMutation({
      intro,
      userId: user?.id,
      loggedUserId: loggedUser?.id,
    });
    Swal.fire({
      icon: "success",
      title: "소개가 변경되었습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
    return;
  };
  const onLinkValid = async ({ linkName, url }: IForm) => {
    if (user?.links?.length === 3) {
      Swal.fire({
        icon: "error",
        title: "링크 수는 최대 3개입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (!linkName) {
      Swal.fire({
        icon: "error",
        title: "링크 이름을 작성해주세요",
        text: "ex) GitHub, Notion, Blog ...",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (!url) {
      Swal.fire({
        icon: "error",
        title: "URL을 작성해주세요",
        text: "ex) https://github.com/Cottonwood-moa",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    linkMutation({ name: linkName, url, userId: router?.query?.id });
    Swal.fire({
      icon: "success",
      title: "링크가 추가되었습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
    setValue("linkName", "");
    setValue("url", "");
  };
  const onLinkDelete = (linkId: number) => {
    fetch(`/api/user/link?linkId=${linkId}`).then(() => mutate());
    Swal.fire({
      icon: "success",
      title: "링크가 삭제되었습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  const deleteUser = () => {
    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      text: "회원님과 관련된 모든 데이터가 삭제됩니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation({ id: router?.query?.id });
        router.replace("/").then(() => signOut());
      } else {
        return;
      }
    });
  };
  useEffect(() => {
    if (avatar && avatar.length > 0) onAvatarValid({ avatar });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);
  useEffect(() => {
    if (avatarResponse && avatarResponse?.ok) mutate();
  }, [avatarResponse, mutate]);
  useEffect(() => {
    if (nameResponse && nameResponse?.ok) mutate();
  }, [nameResponse, mutate]);
  useEffect(() => {
    if (introResponse && introResponse?.ok) mutate();
  }, [introResponse, mutate]);
  useEffect(() => {
    if (linkResponse && linkResponse?.ok) mutate();
  }, [linkResponse, mutate]);
  return (
    <>
      <Head>
        <title>modu | {user?.name ? user?.name : "로딩중"} 프로필</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta
          property="og:title"
          content={`${user?.name as string}의 프로필`}
        />
        <meta property="og:description" content={`${user?.introduce}`} />
        <meta property="og:image" content="/images/modu.png" />
        <meta
          property="og:url"
          content={`https://modu.vercel.app/myPage/${user?.id}`}
        />
      </Head>
      <Layout>
        <div className=" flex  min-h-[100vh] w-full flex-col items-center space-y-12 dark:text-white">
          {/* {loadingState ? <PageLoading /> : null} */}
          {/* 프로필 사진 */}
          {editMode ? (
            <div className="mt-12 flex w-[50rem] items-center justify-between text-4xl font-bold text-gray-800 dark:text-white">
              <motion.div
                layoutId="userInfo"
                className="flex items-center dark:text-white"
              >
                <span>프로필 수정</span>
              </motion.div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cls(
                  `h-8 w-8 cursor-pointer dark:text-white`,
                  editMode ? "text-[#2ecc71] dark:text-[#2ecc71]" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentcolor"
                strokeWidth="2"
                onClick={() => setEditMode((prev) => !prev)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          ) : (
            <div className="mt-12 flex w-[50rem] items-center justify-between text-4xl font-bold text-gray-800 dark:text-white">
              <motion.div layoutId="userInfo" className="flex items-center">
                <span>프로필</span>
              </motion.div>
              {user?.id === loggedUser?.id ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cls(
                    `h-8 w-8 cursor-pointer`,
                    editMode ? "text-[#2ecc71]" : ""
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentcolor"
                  strokeWidth="2"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
                <></>
              )}
            </div>
          )}
          {editMode ? (
            <div className="flex w-[50rem] flex-col items-center  space-y-12 ">
              <motion.div
                layoutId="userImage"
                className="relative  selection:bg-transparent"
              >
                {loadingState ? (
                  <div className="absolute left-0 right-0 z-10 m-auto flex h-full items-center justify-center bg-transparent">
                    <img src="/images/loading.gif" alt="imageloading" />
                  </div>
                ) : null}

                {user?.image?.includes("https") ? (
                  <img
                    src={user?.image}
                    className="h-32 w-32 rounded-full bg-slate-200"
                    alt=""
                  />
                ) : (
                  <img
                    src={
                      user?.image
                        ? ImageDelivery(user?.image, "avatar")
                        : "/images/modu.png"
                    }
                    className="h-32 w-32  rounded-full bg-slate-200"
                    alt=""
                  />
                )}
                <label>
                  <AnimatePresence>
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{
                        scale: 0,
                        transition: {
                          duration: 0.1,
                        },
                      }}
                      style={{ translateX: 100, translateY: -130 }}
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute h-10 w-10  cursor-pointer rounded-full bg-gray-800 p-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </motion.svg>
                  </AnimatePresence>
                  {/* user?.id === loggedUser?.id  */}
                  <input
                    {...register("avatar")}
                    className="hidden"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, translateY: -200 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 0.1 }}
                className=" flex flex-col space-y-2"
              >
                <input
                  type="text"
                  autoComplete="off"
                  {...register("name")}
                  maxLength={10}
                  className="appearance-none border-0 border-b-2 border-gray-400 bg-transparent  text-2xl font-bold text-gray-800 focus:border-b-2  focus:border-[#2ecc71] focus:outline-none focus:ring-0 dark:text-white"
                  defaultValue={user?.name ? user?.name : ""}
                />

                <div className="flex justify-between p-1 text-xl font-medium text-gray-800 dark:text-white">
                  <span className="text-base font-medium text-gray-400 dark:text-white">
                    <span className="text-[#2ecc71]">*</span> modu에서 사용할
                    이름입니다.
                  </span>
                  <span
                    onClick={() => onNameValid({ name: watchName })}
                    className="cursor-pointer font-bold text-[#2ecc71]"
                  >
                    확인
                  </span>
                </div>
                <input
                  type="text"
                  {...register("intro")}
                  autoComplete="off"
                  maxLength={100}
                  className="appearance-none border-0 border-b-2 border-gray-400 bg-transparent text-lg font-bold text-gray-800 focus:border-b-2 focus:border-[#2ecc71] focus:outline-none focus:ring-0 dark:text-white"
                  defaultValue={user?.introduce ? user?.introduce : ""}
                />
                <div className="flex justify-between p-1 text-right text-xl font-medium text-gray-800 dark:text-white">
                  <span className="text-base font-medium text-gray-400 dark:text-white">
                    <span className="text-[#2ecc71]">*</span> 프로필에 표시될
                    간단 소개글 입니다.
                  </span>
                  <span
                    onClick={() => onIntroValid({ intro: watchIntro })}
                    className="cursor-pointer font-bold text-[#2ecc71]"
                  >
                    확인
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="space-x-6">
                    <input
                      {...register("linkName")}
                      type="text"
                      autoComplete="off"
                      maxLength={10}
                      placeholder="이름"
                      className="w-32 appearance-none border-0 border-b-2 border-gray-400 bg-transparent text-lg font-bold text-gray-800 focus:border-b-2 focus:border-[#2ecc71] focus:outline-none focus:ring-0 dark:text-white"
                    />
                    <span>:</span>
                    <input
                      {...register("url")}
                      type="text"
                      autoComplete="off"
                      placeholder="URL"
                      className="w-64 appearance-none border-0 border-b-2 border-gray-400 bg-transparent text-lg font-bold text-gray-800 focus:border-b-2 focus:border-[#2ecc71] focus:outline-none focus:ring-0 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-between p-1 text-xl font-medium text-gray-400 dark:text-white">
                    <div className="flex flex-col">
                      <span className="flex text-base font-medium">
                        <span className="text-[#2ecc71]">*</span>
                        <span> 프로필에 삽입 될 링크입니다.</span>
                      </span>
                      <span className="flex text-base font-medium">
                        <span className="text-[#2ecc71]">*</span>
                        <span> 링크는 최대 3개 까지 추가할 수 있습니다.</span>
                      </span>
                    </div>

                    <span
                      onClick={() =>
                        onLinkValid({
                          linkName: watchLinkName,
                          url: watchUrl,
                        })
                      }
                      className="cursor-pointer font-bold text-[#2ecc71]"
                    >
                      추가
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  {user?.links?.map((link) => {
                    return (
                      <div key={link?.id} className="flex flex-col p-1">
                        <div className="flex justify-between text-base font-medium text-gray-800 dark:text-white">
                          <span className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                            {link?.name}
                          </span>
                          <span className="w-64 overflow-hidden text-ellipsis whitespace-nowrap ">
                            {link?.url}
                          </span>
                          <span
                            className="cursor-pointer text-base font-bold text-[#2ecc71]"
                            onClick={() => onLinkDelete(link?.id)}
                          >
                            삭제
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
              <div
                onClick={deleteUser}
                className="cursor-pointer text-2xl font-bold text-red-600"
              >
                회원탈퇴
              </div>
            </div>
          ) : (
            <div className="flex w-[50rem] items-center  space-x-12 ">
              <motion.div
                layoutId="userImage"
                className="selection:bg-transparent"
              >
                {user?.image?.includes("https") ? (
                  <img
                    src={user?.image}
                    className="h-32 w-32  rounded-full bg-slate-200"
                    alt=""
                  />
                ) : (
                  <img
                    src={
                      user?.image
                        ? ImageDelivery(user?.image, "avatar")
                        : "/images/modu.png"
                    }
                    className="h-32 w-32 rounded-full bg-slate-200"
                    alt=""
                  />
                )}
              </motion.div>
              <div className="w-[80%] space-y-2 ">
                <div className="flex items-center justify-between  text-2xl font-bold text-gray-800 dark:text-white">
                  <span>{user?.name}</span>
                  <div className="flex space-x-2">
                    {user?.links?.map((link) => {
                      return (
                        <div key={link?.id}>
                          <span
                            className="cursor-pointer text-lg text-[#2ecc71]"
                            onClick={() => router.push(`${link?.url}`)}
                          >
                            {link?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex space-x-4 text-lg font-medium">
                  <div>포스트 {data?.totalPosts}개</div>
                  <div>좋아요 {data?.totalFavs}개</div>
                </div>

                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {user?.introduce}
                </div>
              </div>
            </div>
          )}
          {/* 게시글 */}
          {!data ? (
            <ProfileSkeleton />
          ) : editMode ? (
            <></>
          ) : data?.posts?.length === 0 ? (
            <div className="pt-20  text-2xl font-bold text-gray-800 dark:text-white">
              게시글이 없습니다.
            </div>
          ) : (
            <div className="grid min-w-[850px] grid-cols-3 gap-2">
              {data?.posts.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    onClick={() => router.push(`/post/${item?.id}`)}
                    className="group relative  flex h-[17rem] w-[17rem] cursor-pointer flex-col items-center justify-center rounded-md p-4 shadow-md filter transition hover:bg-black hover:bg-opacity-75"
                  >
                    <img
                      src={ImageDelivery(item?.thumnail)}
                      className="absolute h-full w-full rounded-md bg-slate-600 transition group-hover:opacity-5"
                      alt=""
                    />
                    <div className=" hidden w-full items-center justify-center space-x-2  text-xl font-bold text-white transition group-hover:flex">
                      {item?.title}
                    </div>
                    <div className=" hidden w-full items-center justify-center space-x-2 whitespace-nowrap text-xl text-white  transition group-hover:flex">
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>{item?._count?.favs}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        <div>{item?._count?.comments}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>{numberWithCommas(item?.views)}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {editMode || data?.posts?.length === 0 ? (
            <></>
          ) : (
            <>
              <div className="flex w-96 items-center justify-between  p-6 text-2xl font-bold">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    // @ts-ignore
                    setPage((prev) => {
                      if (prev === 1) {
                        return data?.pages;
                      }
                      return prev - 1;
                    })
                  }
                >
                  이전
                </div>
                <div>
                  {page} of {data?.pages}
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setPage((prev) => {
                      if (prev === data?.pages) {
                        return 1;
                      }
                      return prev + 1;
                    })
                  }
                >
                  다음
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const {
    params: { id },
  } = ctx;

  const user = await client.user.findFirst({
    where: {
      id: id.toString(),
    },
    select: {
      id: true,
      name: true,
      image: true,
      introduce: true,
      links: true,
    },
  });
  return {
    props: {
      user,
    },
  };
};
