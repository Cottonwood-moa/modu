import type { NextPage } from "next";
import Layout from "@components/Layout";
import tw from "tailwind-styled-components";
import ScrollAnimate from "@components/ScrollAnimate";
const HelloWorld = tw.div`
bg-gray-700 w-full  flex flex-col justify-center items-center font-bold text-white text-6xl
`;

const Home: NextPage = () => {
  return (
    <Layout title="타이틀">
      <HelloWorld>
        <div className="mb-[2000px]">Hello world!</div>
        <ScrollAnimate>
          <div className="w-40 h-40 bg-red-600"></div>
        </ScrollAnimate>
      </HelloWorld>
    </Layout>
  );
};

export default Home;
