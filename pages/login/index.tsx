import type { NextPage } from "next";
import { AppProvider } from "next-auth/providers";
import { getProviders, signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { darkModeAtom } from "@atom/atom";
import { cls } from "@libs/client/utils";
import Head from "next/head";
export const SignIn: NextPage<{ providers: AppProvider; previous: any }> = ({
  providers,
  previous,
}) => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeAtom);
  return (
    <>
      <Head>
        <title>modu | 로그인</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:title" content={`modu 로그인`} />
        <meta property="og:description" content={`modu 로그인 페이지`} />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://modu.vercel.app" />
      </Head>
      <div className={isDarkMode ? "dark" : ""}>
        <div
          className={`flex h-[100vh] w-full items-center justify-center space-x-6 dark:bg-slate-900`}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.4 }}
              className="text-6xl font-bold text-gray-800 dark:text-white"
            >
              환영합니다!
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-2xl font-bold text-gray-800 dark:text-white"
            >
              구글이나 깃허브로 간편하게 로그인하세요!
            </motion.div>
          </div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <motion.div
                initial={{ scale: 0, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10 }}
                whileHover={{
                  rotate: [0, 32, 0],
                  transition: { type: "spring", damping: 20 },
                }}
                className="flex cursor-pointer flex-col items-center justify-center"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: previous,
                  })
                }
              >
                <Image
                  width={120}
                  height={120}
                  src={`/images/${provider.name.toLowerCase()}.png`}
                  alt=""
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: {
      providers,
      previous: context.req.headers.referer
        ? context.req.headers.referer
        : null,
    },
  };
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/
export default SignIn;
