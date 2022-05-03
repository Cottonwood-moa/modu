import { darkModeAtom } from "@atom/atom";
import Layout from "@components/Layout";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWR from "swr";
import randomColor from "randomcolor";
import numberWithCommas from "@libs/client/numberWithComma";
import Swal from "sweetalert2";
import { motion, useAnimation } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";
import Head from "next/head";
import Image from "next/image";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
interface Download {
  downloads: number;
  day: string;
}
interface NpmLastMonthResponse {
  start: string;
  end: string;
  package: string;
  downloads: Download[];
  error?: string;
}
interface IForm {
  search: string;
}
interface SeriesItem {
  name: string;
  data: number[];
}
const Trend: NextPage = () => {
  const BASE_URL = "https://api.npmjs.org";
  const isDarkMode = useRecoilValue(darkModeAtom);
  const controls = useAnimation();
  const { register, handleSubmit, reset } = useForm<IForm>();
  const [text, setText] = useState("react");
  const [info, setInfo] = useState(false);
  const [download, setDownload] = useState<number[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const { data } = useSWR<NpmLastMonthResponse>(
    !text ? null : `${BASE_URL}/downloads/range/last-month/${text}`
  );
  const onValid = ({ search }: IForm) => {
    if (series?.length === 5) {
      Swal.fire({
        icon: "info",
        title: "차트는 최대 5개 입니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    const lowerText = search.toLowerCase();
    reset();
    setText(lowerText);
  };
  const onReset = () => {
    controls.start("resetClick");
    setSeries([]);
    reset();
    setText("");
  };
  useEffect(() => {
    if (data?.error) {
      Swal.fire({
        icon: "error",
        title: "패키지가 없습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }, [data]);
  useEffect(() => {
    if (data?.error) return;
    if (data) {
      setDownload(() => {
        const download = data?.downloads?.map((item) => {
          return item?.downloads;
        });
        return download as number[];
      });
      setDate(() => {
        const date = data?.downloads?.map((item) => {
          return item?.day;
        });
        return date as string[];
      });
    }
  }, [data]);
  useEffect(() => {
    if (data?.error) return;
    if (download?.length > 1) {
      setColor((prev) => {
        const addColor = [...prev, randomColor()];
        return addColor;
      });
      setSeries((prev) => {
        const newChart = [...prev, { name: `${text}`, data: download }];
        const checked = newChart.filter(
          (a, i) => newChart.findIndex((s) => a.name === s.name) === i
        );
        return checked as never[];
      });
    }
  }, [download]);

  return (
    <>
      <Head>
        <title>모두의 HOOK | npm 트렌드</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="모두의 HOOK" />
        <meta
          property="og:title"
          content="모두의 HOOK npm 트렌드 페이지 입니다."
        />
        <meta
          property="og:description"
          content="npm에 등록된 패키지의 다운로드 횟수를 차트로 확인할 수 있습니다."
        />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://starbucks.co.kr" />
      </Head>
      <Layout>
        {info ? (
          <OutsideClickHandler onOutsideClick={() => setInfo(false)}>
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className=" fixed top-56 left-0 z-10 space-y-2 rounded-lg bg-slate-700 p-6 text-xl font-bold text-white shadow-lg xl:left-28"
            >
              <Image
                width={960}
                height={480}
                className="h-[30rem] w-[60rem] rounded-lg"
                src="/images/chart.png"
                alt="chartImage"
              />
              <p>npm 패키지 다운로드 횟수를 차트로 확인해보세요!</p>
              <p>차트 그래프는 최대 5개, 시간 범위는 1개월 입니다. </p>
            </motion.div>
          </OutsideClickHandler>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setInfo(true)}
            whileHover={{ scale: 1.2 }}
            className="fixed left-0
              top-56 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white dark:bg-transparent dark:text-white xl:left-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentcolor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        )}

        <div className="flex h-[32px] items-center justify-center space-x-4 pt-12 text-2xl font-bold text-gray-800 dark:text-white">
          <motion.button
            animate={controls}
            variants={{
              resetClick: {
                rotate: [0, 180, 0],
                transition: {
                  duration: 0.4,
                },
              },
            }}
            className=" cursor-pointer text-2xl font-bold text-gray-800 dark:text-white"
            onClick={onReset}
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </motion.button>
          {series?.length !== 0 ? (
            series?.map((item, index) => {
              return <span key={index}># {item?.name}</span>;
            })
          ) : (
            <span>패키지명을 검색해보세요!</span>
          )}
        </div>
        <div className="h-[60vh] p-8">
          <div className="flex items-center space-x-4">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex items-center"
            >
              <input
                placeholder="패키지 명"
                className=" box-border rounded-lg border-2 focus:border-2 focus:border-[#74b9ff] focus:ring-0"
                {...register("search", {
                  required: true,
                })}
                type="text"
                required
              />
              <button className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
                검색
              </button>
            </form>
          </div>
          <ApexChart
            type="line"
            height={"100%"}
            series={series}
            options={{
              theme: {
                mode: isDarkMode ? "dark" : "light",
              },
              chart: {
                height: 500,
                width: 500,
                toolbar: {
                  show: true,
                },
                background: "transparent",
              },
              stroke: {
                curve: "smooth",
                width: 5,
              },
              xaxis: {
                type: "datetime",
                labels: {
                  show: true,
                },
                categories: date ?? [],
              },
              yaxis: {
                show: false,
              },
              // fill: {
              //   type: "gradient",
              //   gradient: {
              //     gradientToColors: ["#0fbcf9"],
              //     stops: [0, 100],
              //   },
              // },
              colors: color,
              tooltip: {
                y: {
                  formatter: (value) => numberWithCommas(value),
                },
              },
            }}
          />
        </div>
      </Layout>
    </>
  );
};

export default Trend;
