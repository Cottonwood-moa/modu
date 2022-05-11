/* eslint-disable @next/next/no-img-element */
import Layout from "@components/Layout";
import PostCard from "@components/PostCard";
import type { NextPage } from "next";
import { PostWithInclude } from "pages";
import useSWR from "swr";
import Image from "next/image";
import Head from "next/head";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
interface FavsList {
  post: PostWithInclude;
}
interface FavsListResponse {
  ok: boolean;
  favsList: FavsList[];
}
const Favs: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<FavsListResponse>(`/api/user/favsList`);
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>modu | 좋아요 목록</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://modu.vercel.app" />
      </Head>
      <Layout>
        {user ? (
          <>
            {data?.favsList?.length === 0 ? (
              <div className="flex min-h-[80vh] translate-y-20 flex-col items-center justify-center">
                <img
                  src="https://media2.giphy.com/media/i9sDpfoJstrx8s2IKO/200.webp?cid=ecf05e47g6xpxsjexe9f7787gpn6u0jrkpkupx4sz03qhjc3&rid=200.webp&ct=s"
                  draggable="false"
                  alt=""
                />
                <span className="text-4xl font-bold text-gray-800 dark:text-white ">
                  좋아요 목록이 없습니다.
                </span>
              </div>
            ) : (
              <>
                {!data ? (
                  <div className="flex min-h-[80vh] items-center justify-center">
                    <img src="/images/loading.gif" alt="loading" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 p-12  xl:grid-cols-3 2xl:grid-cols-4">
                    {data?.favsList?.map((post, index) => {
                      return <PostCard post={post?.post} key={index} />;
                    })}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.8, damping: 10 }}
            className="flex min-h-[80vh] translate-y-20 flex-col items-center justify-center"
          >
            <img
              src="https://media2.giphy.com/media/i9sDpfoJstrx8s2IKO/200.webp?cid=ecf05e47g6xpxsjexe9f7787gpn6u0jrkpkupx4sz03qhjc3&rid=200.webp&ct=s"
              draggable="false"
              alt=""
            />
            <span className="text-4xl font-bold text-gray-800 dark:text-white ">
              로그인이 필요합니다.
            </span>
          </motion.div>
        )}
      </Layout>
    </>
  );
};

export default Favs;
