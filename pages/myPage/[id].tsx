// Post detail

import Layout from "@components/Layout";
import { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
interface Props {
  user: User;
  totalFavs: number;
  totalPosts: number;
}
const Profile: NextPage<Props> = ({ user, totalFavs, totalPosts }) => {
  console.log(user);
  console.log(totalFavs);
  console.log(totalPosts);
  return (
    <Layout>
      <div className=" flex h-[100vh] w-full flex-col items-center space-y-12 bg-blue-400">
        {/* 프로필 사진 */}
        <div className="mt-12 flex w-[50rem] items-center justify-between text-4xl font-bold text-gray-800">
          <div>프로필</div>
          <div className="text-lg font-normal text-gray-600">
            <span>수정</span>
            <span> / </span>
            <span>탈퇴</span>
          </div>
        </div>
        <div className="flex w-[50rem] items-center space-x-12">
          <div className="h-32 w-32 rounded-full bg-gray-400"></div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-800">Cottonwood</div>
            <div className="flex space-x-4 text-lg font-medium">
              <div>작성한 게시글: 10개</div>
              <div>하트 수: 186개</div>
              <div>조회수: 1566005회</div>
            </div>
            <div>
              느린 것(慢)을 두려워하지 말고(不怕), 멈춰 있는 것(站)을
              두려워하라(只怕).
            </div>
          </div>
        </div>
        {/* 게시글 */}
        <div className="w-[50rem] text-4xl font-bold text-gray-800">게시글</div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
            return (
              <div key={index} className="w-[50rem] rounded-md bg-red-400 p-4">
                <div>
                  <div className="flex justify-between">
                    <div className="text-xl font-bold text-gray-800">
                      [React] 종속성 고차함수의 점진적 참조 값과 증분 재생성
                    </div>
                    <div className="flex">
                      <div>@ 10</div>
                      <div>@ 24</div>
                      <div>@ 30</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    부제목입니당 ㅎㅎㅎㅎㅎㅎㅎ
                  </div>
                  <div className="flex space-x-2">
                    <div className="rounded-lg bg-pink-500 px-2 py-1">tag</div>
                    <div className="rounded-lg bg-pink-500 px-2 py-1">tag</div>
                    <div className="rounded-lg bg-pink-500 px-2 py-1">tag</div>
                    <div className="rounded-lg bg-pink-500 px-2 py-1">tag</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 회원탈퇴 */}

        {/* 제출 버튼 */}
      </div>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const {
    query: { id },
  } = ctx;
  const user = await client?.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  const totalFavs = await client?.fav.count({
    where: {
      userId: id,
    },
  });
  const totalPosts = await client?.post.count({
    where: {
      userId: id,
    },
  });
  console.log("totalFavs", totalFavs);
  console.log("totalPosts", totalPosts);
  return {
    props: { user, totalFavs, totalPosts },
  };
};
export default Profile;
