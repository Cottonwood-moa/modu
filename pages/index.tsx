import type { NextPage } from "next";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout title="타이틀">
      <div className="bg-gray-700 w-full h-[100vh] flex justify-center items-center font-bold text-white text-6xl">
        Hello world!
      </div>
    </Layout>
  );
};

export default Home;
