import type { NextPage } from "next";
import Layout from "../components/Layout";
import tw from "tailwind-styled-components";
const HelloWorld = tw.div`
bg-gray-700 w-full h-[100vh] flex justify-center items-center font-bold text-white text-6xl
`;
const Home: NextPage = () => {
  return (
    <Layout title="타이틀">
      <HelloWorld>
        <span>Hello world!</span>
      </HelloWorld>
    </Layout>
  );
};

export default Home;
