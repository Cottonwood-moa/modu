/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { motion } from "framer-motion";
interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

interface Publisher {
  username: string;
  email: string;
}

interface Maintainer {
  username: string;
  email: string;
}

interface Author {
  name: string;
  email: string;
  username: string;
  url: string;
}

interface Package {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: Date;
  links: Links;
  publisher: Publisher;
  maintainers: Maintainer[];
  author: Author;
}

interface Detail {
  quality: number;
  popularity: number;
  maintenance: number;
}

interface Score {
  final: number;
  detail: Detail;
}

interface Object {
  package: Package;
  score: Score;
  searchScore: number;
}

interface NpmRankingResponse {
  objects: Object[];
  total: number;
  time: string;
}
interface IForm {
  text: string;
}
export default function NpmRanks() {
  const [text, setText] = useState("react");
  const { handleSubmit, register, reset } = useForm<IForm>();
  const { data } = useSWR<NpmRankingResponse>(
    `https://registry.npmjs.org/-/v1/search?text=${text}`
  );
  const onValid = ({ text }: IForm) => {
    reset();
    setText(text);
  };
  return (
    <motion.div initial={{ translateY: 500 }} animate={{ translateY: 0 }}>
      <div className="bg-transparent p-6 text-center font-[gugi] text-4xl font-bold text-gray-800  dark:text-white">
        키워드 랭킹
      </div>
      <form
        onSubmit={handleSubmit(onValid)}
        className="left-0 right-0 m-auto my-12 flex items-center justify-center   "
      >
        <div className="flex items-center">
          <label className="pointer-events-none absolute translate-y-[-2px] text-gray-800 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </label>
          <input
            {...register("text", { required: true })}
            type="text"
            className="appearance-none border-0 border-b-2 bg-transparent pl-14 text-gray-800 outline-none ring-0 focus:border-b-2 focus:border-[#2ecc71] focus:ring-0 dark:text-white"
            required
            autoComplete="off"
            placeholder="패키지 명"
          />
        </div>
      </form>
      {!data ? (
        <div className="flex justify-center py-40 text-2xl font-bold text-gray-800 dark:text-white">
          <img src="/images/loading.gif" alt="" />
        </div>
      ) : data?.objects?.length === 0 ? (
        <div className="py-40 text-center text-2xl font-bold text-gray-800 dark:text-white">
          검색어와 연관된 패키지가 없습니다.
        </div>
      ) : (
        <div>
          <div className=" divide-y-2 rounded-2xl border-2 border-white text-xl font-normal text-gray-800 dark:text-white">
            <div className="flex flex-col rounded-2xl bg-gray-900 p-4 text-center text-2xl font-bold text-white dark:rounded-t-2xl dark:rounded-b-none ">
              <span>keyword</span>
              <span className="text-6xl font-bold">{text}</span>
            </div>
            {data?.objects?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 p-4"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl font-bold text-[#2ecc71]">
                      Rank.{index + 1}
                    </span>
                    <span className="text-4xl font-bold">
                      {item?.package?.name}
                    </span>
                    <span>{item?.package?.description}</span>
                  </div>
                  <div className="space-x-4">
                    <Link href={`${item?.package?.links?.repository}`}>
                      <a className="font-[gugi] text-blue-400 transition hover:text-red-400">
                        GitHub
                      </a>
                    </Link>
                    <Link href={`${item?.package?.links?.npm}`}>
                      <a className="font-[gugi] text-blue-400 transition hover:text-red-400">
                        NPM
                      </a>
                    </Link>
                    <Link href={`${item?.package?.links?.homepage}`}>
                      <a className="font-[gugi] text-blue-400 transition hover:text-red-400">
                        HomePage
                      </a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
