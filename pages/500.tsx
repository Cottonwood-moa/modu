import type { NextPage } from "next";

const Custom500: NextPage = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center text-4xl font-bold text-gray-800 dark:bg-slate-800 dark:text-white ">
      500 Internal Server Error
    </div>
  );
};

export default Custom500;
