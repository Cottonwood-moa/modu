import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data } = useSession();
  const router = useRouter();
  const onLogin = () => {
    if (!data?.user) {
      router.push("/login");
    } else {
      signOut();
    }
  };
  const onTitleClick = () => {
    router.push("/");
  };
  return (
    <div>
      <div className="w-full h-24 px-6 bg-white text-lg font-bold flex justify-between items-center">
        <div
          onClick={onTitleClick}
          className="font-bold text-4xl cursor-pointer font-[Gugi]"
        >
          모두의 HOOK
        </div>
        <div className="flex items-center font-bold text-xl space-x-6 text-gray-900">
          <div className="flex items-center text-gray-800 cursor-pointer transition hover:text-blue-400">
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
            <span>새 글 쓰기</span>
          </div>
          <div
            className="flex items-center text-gray-800 cursor-pointer transition hover:text-blue-400"
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
            {!data?.user ? <div>로그인</div> : <div>로그아웃</div>}
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] right-0 left-0 m-auto">{children}</div>
    </div>
  );
}
