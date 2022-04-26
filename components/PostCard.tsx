import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { PostWithInclude } from "pages";
import useSWR from "swr";
interface CountResponse {
  ok: boolean;
  count: {
    favs: number;
    comments: number;
  };
}
interface IProps {
  post: PostWithInclude;
}
export default function PostCard({ post }: IProps) {
  const router = useRouter();
  const { data: countData } = useSWR<CountResponse>(
    `/api/post/count?postId=${post?.id}`
  );
  const toPostDetail = (id: number) => {
    router.push(`/post/${id}`);
  };
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
      }}
      className="aspect-square w-full min-w-[300px] max-w-md cursor-pointer space-y-2 rounded-md bg-white p-4 shadow-lg"
      onClick={() => toPostDetail(post.id)}
    >
      <div className="relative h-[80%] w-full">
        <Image
          className="rounded-md"
          src={`https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${post.thumnail}/thumbnail`}
          layout={"fill"}
          alt=""
        />
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold text-gray-800">
        {post.title}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-gray-600">
        {post.content}
      </div>
      <div className="relative flex w-full items-center text-gray-800">
        <div className="flex items-center space-x-2">
          <Image
            src={post?.user?.image ? post?.user?.image : "/images/react.png"}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full bg-slate-600"
            alt=""
          />
          <div>{post.user.name}</div>
        </div>
        <div className="absolute right-0 flex items-center justify-end space-x-2">
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#d63031"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{countData?.count?.favs}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4B5563"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <span>{countData?.count?.comments}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4B5563"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
