import useUser from "@libs/client/useUser";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import OutsideClickHandler from "react-outside-click-handler";
import useSWR from "swr";
import { Notification } from "@prisma/client";
import ParsingCreatedAt from "@libs/client/parsingCreatedAt";
import ParsingAgo from "@libs/client/parsingAgo";
import ImageDelivery from "@libs/client/imageDelivery";
interface LayoutProps {
  children: React.ReactNode;
}
interface NotificationResponse {
  ok: boolean;
  notification?: Notification[];
  kind: "comment" | "like";
  message?: string;
}
export default function Layout({ children }: LayoutProps) {
  const { user, mutate } = useUser();
  const { data } = useSWR<NotificationResponse>(
    user ? `/api/notification?userId=${user?.id}` : null
  );
  const [info, setInfo] = useState(false);
  const [alert, setAlert] = useState(false);
  const router = useRouter();
  const alertOpen = async () => {
    setAlert((prev) => !prev);
    mutate(
      (prev) => prev && { ...prev, user: { ...prev.user, alert: 0 } },
      false
    );
    await fetch(`/api/user/session?alert=true`);
    mutate();
  };
  const onInfo = () => {
    setInfo((prev) => !prev);
  };
  const onLogin = () => {
    router.push("/login");
  };
  const onSignOut = () => {
    signOut();
  };
  const onTitleClick = () => {
    router.push("/");
  };
  return (
    <div>
      <div className="z-10 flex h-24 w-full  items-center justify-between bg-white px-6 text-lg font-bold">
        <div
          onClick={onTitleClick}
          className="cursor-pointer font-[Gugi] text-4xl font-bold"
        >
          모두의 HOOK
        </div>

        <div className="flex items-center space-x-6 text-xl font-bold text-gray-900">
          <div className="flex cursor-pointer items-center text-gray-800 transition hover:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
            <span onClick={() => router.push("/write")}>새 글 쓰기</span>
          </div>
          <OutsideClickHandler onOutsideClick={() => setAlert(false)}>
            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: -100,
                    opacity: 0,
                    transition: { type: "tween" },
                  }}
                  className="absolute top-20 right-20 z-20 flex max-h-[36rem] w-96 flex-col space-y-6 overflow-y-scroll bg-white p-6 text-base font-medium shadow-lg"
                >
                  {data?.notification && data?.notification?.length > 0 ? (
                    data?.notification.map((noti) => {
                      const createdAt = ParsingAgo(noti?.createdAt);
                      return (
                        <div
                          onClick={() => router.push(`/post/${noti?.postId}`)}
                          key={noti?.id}
                          className="cursor-pointer text-base font-normal text-gray-800"
                        >
                          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {noti?.kind === "comment" && `💬 ${noti?.message}`}
                            {noti?.kind === "reply" && `🔧 ${noti?.message}`}
                          </p>
                          <p className="text-sm font-light text-gray-400">
                            {createdAt}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div>알림이 없습니다.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {user && user?.alert > 0 ? (
              <motion.div
                onClick={alertOpen}
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{
                  type: "spring",
                  duration: 1,
                  repeat: Infinity,
                }}
                className="flex cursor-pointer items-center text-red-500 transition "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#d63031"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span>알림</span>
              </motion.div>
            ) : (
              <motion.div
                onClick={alertOpen}
                className="flex cursor-pointer items-center text-gray-800 transition hover:text-red-400"
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span>알림</span>
              </motion.div>
            )}
          </OutsideClickHandler>

          <div className="flex cursor-pointer items-center text-gray-800 transition ">
            {!user ? (
              <div
                className="flex items-center hover:text-red-400"
                onClick={onLogin}
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                로그인
              </div>
            ) : (
              <OutsideClickHandler onOutsideClick={() => setInfo(false)}>
                <div
                  className="relative z-10 flex items-center"
                  onClick={onInfo}
                >
                  <div className="flex items-center hover:text-red-400">
                    {user?.image?.includes("https") ? (
                      <Image
                        src={user?.image}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-slate-600"
                        alt=""
                      />
                    ) : (
                      <Image
                        src={
                          user?.image
                            ? ImageDelivery(user?.image)
                            : "/images/modu.png"
                        }
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-slate-600"
                        alt=""
                      />
                    )}

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
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                  <AnimatePresence>
                    {info && (
                      <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{
                          y: -100,
                          opacity: 0,
                          transition: { type: "tween" },
                        }}
                        className="absolute top-20  right-0 flex w-52 flex-col space-y-6 bg-white p-6 shadow-lg"
                      >
                        <Link href="post/1">
                          <a className="text-gray-800 hover:text-red-400">
                            내가 쓴 글
                          </a>
                        </Link>
                        <Link href="">
                          <a className="text-gray-800 hover:text-red-400">
                            좋아요
                          </a>
                        </Link>
                        <Link href="">
                          <a className="text-gray-800 hover:text-red-400">
                            내가 쓴 댓글
                          </a>
                        </Link>
                        <Link href={`/myPage/${user?.id}`}>
                          <a className="text-gray-800 hover:text-red-400">
                            프로필
                          </a>
                        </Link>
                        <div
                          className="text-gray-800 hover:text-red-400"
                          onClick={onSignOut}
                        >
                          로그아웃
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </OutsideClickHandler>
            )}
          </div>
        </div>
      </div>
      <div className="right-0 left-0 m-auto max-w-[1600px]">{children}</div>
    </div>
  );
}
