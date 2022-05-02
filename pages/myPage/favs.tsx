import { searchAtom } from "@atom/atom";
import Layout from "@components/Layout";
import PostCard from "@components/PostCard";
import SkeletonCard from "@components/skeletonCard";
import type { NextPage } from "next";
import { PostWithInclude } from "pages";
import useSWR from "swr";

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
    <Layout>
      {data?.favsList?.length === 0 ? (
        <div className=" p-[20rem] text-center text-4xl font-bold dark:text-white">
          좋아요 목록이 없습니다.
        </div>
      ) : (
        <div className="m-12 grid grid-cols-2 gap-6  xl:grid-cols-3 2xl:grid-cols-4">
          {!data
            ? Array.from({ length: 8 }, (v, i) => i).map((index) => {
                return <SkeletonCard key={index} />;
              })
            : data?.favsList?.map((post, index) => {
                return <PostCard post={post?.post} key={index} />;
              })}
        </div>
      )}
    </Layout>
  );
};

export default Favs;
