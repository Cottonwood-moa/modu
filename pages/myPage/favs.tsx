/* eslint-disable @next/next/no-img-element */
import Layout from "@components/Layout";
import PostCard from "@components/PostCard";
import type { NextPage } from "next";
import { PostWithInclude } from "pages";
import useSWR from "swr";
import Image from "next/image";
import Head from "next/head";
interface FavsList {
  post: PostWithInclude;
}
interface FavsListResponse {
  ok: boolean;
  favsList: FavsList[];
}
const Favs: NextPage = () => {
  const { data } = useSWR<FavsListResponse>(`/api/user/favsList`);
  return (
    <>
      <Head>
        <title>modu | 좋아요 목록</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://starbucks.co.kr" />
      </Head>
      <Layout>
        {data?.favsList?.length === 0 ? (
          <div className="flex h-[80vh] translate-y-20 flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-white ">
              좋아요 목록이 없습니다.
            </span>
            <Image
              width={1000}
              height={600}
              src="/images/main3.svg"
              draggable="false"
              alt=""
            />
          </div>
        ) : (
          <>
            {!data ? (
              <div className="flex h-[80vh] items-center justify-center">
                <img src="/images/loading.gif" alt="loading" />
              </div>
            ) : (
              <div className="m-12 grid grid-cols-2 gap-6  xl:grid-cols-3 2xl:grid-cols-4">
                {data?.favsList?.map((post, index) => {
                  return <PostCard post={post?.post} key={index} />;
                })}
              </div>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default Favs;
