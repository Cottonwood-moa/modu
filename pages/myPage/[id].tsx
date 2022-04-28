// Post detail

import Layout from "@components/Layout";
import { Post, Tag, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import client from "@libs/server/client";
import Image from "next/image";
import jsonSerialize from "@libs/server/jsonSerialize";
import ImageDelivery from "@libs/client/imageDelivery";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import PageLoading from "@components/pageLoading";
import ProfileSkeleton from "@components/profileSkeleton";
import Swal from "sweetalert2";
import { cls } from "@libs/client/utils";
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
interface Props {
  user: User;
  totalFavs: number;
  totalPosts: number;
  posts: PostWithTag[];
}
interface IForm {
  avatar?: string;
  name?: string;
  intro?: string;
}
interface AvatarResponse {
  ok: boolean;
}
interface ProfileResponse extends Props {
  ok: boolean;
}
const Profile: NextPage<Props> = () => {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const { data, mutate } = useSWR<ProfileResponse>(
    router?.query?.id ? `/api/user/profile?id=${router?.query?.id}` : null
  );
  const { register, watch } = useForm<IForm>();
  const [avatarMutation, { data: avatarResponse }] =
    useMutation<AvatarResponse>(`/api/user/avatar`, "POST");
  const [nameMutation, { data: nameResponse, loading: nameLoading }] =
    useMutation<{ ok: boolean }>(`/api/user/updateName`, "POST");
  const [introMutation, { data: introResponse }] = useMutation<{ ok: boolean }>(
    `/api/user/updateIntro`,
    "POST"
  );
  const [loadingState, setLoadingState] = useState(false);
  const avatar = watch("avatar");
  const watchName = watch("name");
  const watchIntro = watch("intro");

  const onAvatarValid = async ({ avatar }: IForm) => {
    if (loggedUser?.id !== data?.user?.id) return;
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
      userId: data?.user?.id,
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
    if (name === data?.user?.name) {
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
      userId: data?.user?.id,
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
    if (intro === data?.user?.introduce) {
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
      userId: data?.user?.id,
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
  useEffect(() => {
    if (avatar && avatar.length > 0) onAvatarValid({ avatar });
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
  return (
    <Layout>
      {!data ? (
        <ProfileSkeleton></ProfileSkeleton>
      ) : (
        <div className=" flex  w-full flex-col items-center space-y-12">
          {loadingState ? <PageLoading /> : null}

          {/* 프로필 사진 */}
          {editMode ? (
            <div className="mt-12 flex w-[50rem]  items-center justify-between text-4xl font-bold text-gray-800">
              <motion.div layoutId="userInfo" className="flex items-center">
                <span>프로필 수정</span>
              </motion.div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cls(
                  `h-8 w-8 cursor-pointer`,
                  editMode ? "text-red-400" : ""
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
            <div className="mt-12 flex w-[50rem] items-center justify-between text-4xl font-bold text-gray-800">
              <motion.div layoutId="userInfo" className="flex items-center">
                <span>프로필</span>
              </motion.div>
              {data?.user?.id === loggedUser?.id ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cls(
                    `h-8 w-8 cursor-pointer`,
                    editMode ? "text-red-400" : ""
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
                className="selection:bg-transparent"
              >
                {data?.user?.image?.includes("https") ? (
                  <Image
                    src={data?.user?.image}
                    width={128}
                    height={128}
                    className="h-32 w-32  rounded-full bg-slate-200"
                    alt=""
                  />
                ) : (
                  <Image
                    src={
                      data?.user?.image
                        ? ImageDelivery(data?.user?.image, "avatar")
                        : "/images/modu.png"
                    }
                    width={128}
                    height={128}
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
                  {/* data?.user?.id === loggedUser?.id  */}
                  <input
                    {...register("avatar")}
                    className="hidden"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </motion.div>
              <motion.div
                layoutId="userForm"
                className=" flex flex-col space-y-2"
              >
                <input
                  type="text"
                  autoComplete="off"
                  {...register("name")}
                  maxLength={10}
                  className="appearance-none border-0 border-b-2 border-gray-400 bg-transparent  text-2xl font-bold text-gray-800  focus:border-b-2 focus:border-blue-400 focus:outline-none focus:ring-0"
                  defaultValue={data?.user?.name ? data?.user?.name : ""}
                />

                <div className="flex justify-between p-1 text-xl font-medium text-gray-800">
                  <span className="text-base font-medium text-gray-400">
                    <span className="text-red-400">*</span> modu에서 사용할
                    이름입니다.
                  </span>
                  <span
                    onClick={() => onNameValid({ name: watchName })}
                    className="cursor-pointer"
                  >
                    확인
                  </span>
                </div>
                <input
                  type="text"
                  {...register("intro")}
                  autoComplete="off"
                  maxLength={100}
                  className="appearance-none border-0 border-b-2 border-gray-400 bg-transparent text-lg font-bold text-gray-800  focus:border-b-2 focus:border-blue-400 focus:outline-none focus:ring-0"
                  defaultValue={
                    data?.user?.introduce ? data?.user?.introduce : ""
                  }
                />
                <div className="flex justify-between p-1 text-right text-xl font-medium text-gray-800">
                  <span className="text-base font-medium text-gray-400">
                    <span className="text-red-400">*</span> 프로필에 표시될 간단
                    소개글 입니다.
                  </span>
                  <span
                    onClick={() => onNameValid({ name: watchName })}
                    className="cursor-pointer"
                  >
                    확인
                  </span>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex w-[50rem] items-center  space-x-12 ">
              <motion.div
                layoutId="userImage"
                className="selection:bg-transparent"
              >
                {data?.user?.image?.includes("https") ? (
                  <Image
                    src={data?.user?.image}
                    width={128}
                    height={128}
                    className="h-32 w-32  rounded-full bg-slate-200"
                    alt=""
                  />
                ) : (
                  <Image
                    src={
                      data?.user?.image
                        ? ImageDelivery(data?.user?.image, "avatar")
                        : "/images/modu.png"
                    }
                    width={128}
                    height={128}
                    className="h-32 w-32  rounded-full bg-slate-200"
                    alt=""
                  />
                )}
              </motion.div>
              <motion.div layoutId="userForm" className="space-y-2">
                <div className="text-2xl font-bold text-gray-800">
                  {data?.user?.name}
                </div>
                <div className="flex space-x-4 text-lg font-medium">
                  <div>포스트 {data?.totalPosts}개</div>
                  <div>좋아요 {data?.totalFavs}개</div>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {data?.user?.introduce}
                </div>
              </motion.div>
            </div>
          )}
          {/* 게시글 */}
          {editMode ? (
            <></>
          ) : (
            <div className="flex w-[50rem] items-center text-4xl font-bold text-gray-800">
              게시글
            </div>
          )}
          {editMode ? (
            <></>
          ) : data?.posts?.length === 0 ? (
            <div className="pt-20  text-2xl font-bold text-gray-800">
              게시글이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 ">
              {data?.posts.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    onClick={() => router.push(`/post/${item?.id}`)}
                    className="group relative flex h-[17rem] w-[17rem] cursor-pointer items-center justify-center rounded-md border-2 p-4 filter transition hover:bg-black hover:bg-opacity-50"
                  >
                    <Image
                      src={ImageDelivery(item?.thumnail)}
                      className="absolute z-[-1] h-full w-full bg-slate-600 "
                      layout="fill"
                      alt=""
                    />
                    <div className="hidden w-full items-center justify-center space-x-2 whitespace-nowrap text-xl text-white  transition group-hover:flex">
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
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
                          className="h-8 w-8"
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
                          className="h-8 w-8"
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
                        <div>{item?.views}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Profile;
