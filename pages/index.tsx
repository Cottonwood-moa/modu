import type { NextPage } from "next";
import Layout from "../components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import tw from "tailwind-styled-components";
const HelloWorld = tw.div`
bg-gray-700 w-full h-[100vh] flex justify-center items-center font-bold text-white text-6xl
`;

const Home: NextPage = () => {
  return (
    <Layout title="타이틀">
      <HelloWorld>
        <span>Hello world!</span>
        <motion.div
          className="w-40 h-40 bg-red-600"
          initial={{ scale: 0 }}
          animate={{ rotate: 180, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        ></motion.div>
      </HelloWorld>
    </Layout>
  );
};

export default Home;
