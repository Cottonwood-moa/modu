import Layout from "@components/Layout";
import PageLoading from "@components/pageLoading";
import type { NextPage } from "next";

const Psudo: NextPage = () => {
  return (
    // <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-white font-[gugi] text-9xl font-bold">
    //   모두의 HOOK
    // </div>
    <Layout>
      <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-white dark:bg-slate-800">
        <PageLoading />
      </div>
    </Layout>
  );
};

export default Psudo;
