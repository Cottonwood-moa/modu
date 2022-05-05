import { darkModeAtom } from "@atom/atom";
import Layout from "@components/Layout";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import randomColor from "randomcolor";
import numberWithCommas from "@libs/client/numberWithComma";
import Swal from "sweetalert2";
import { motion, useAnimation } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";
import Head from "next/head";
import Image from "next/image";
import NpmRanks from "@components/npmRanks";
import { cls } from "@libs/client/utils";
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
  const [marker, setMarker] = useState(false);
  const [stroke, setStroke] = useState<"stepline" | "smooth">("smooth");
  const [download, setDownload] = useState<number[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [kind, setKind] = useState<"chart" | "ranking">("chart");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download]);

  return (
    <>
      <Head>
        <title>modu | npm 트렌드</title>
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:site_name" content="modu" key="ogsitename" />
        <meta
          property="og:title"
          content="modu npm 트렌드 페이지 입니다."
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="npm에 등록된 패키지의 다운로드 횟수를 차트로 확인할 수 있습니다."
          key="ogdesc"
        />
        <meta property="og:image" content="/images/modu.png" key="ogimage" />
        <meta
          property="og:url"
          content="https://modu.vercel.app/trend"
          key="ogurl"
        />
      </Head>
      <Layout>
        {info ? (
          <OutsideClickHandler onOutsideClick={() => setInfo(false)}>
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className=" fixed top-56 left-0 z-10 space-y-2 rounded-lg bg-slate-700 p-6 text-xl font-bold text-white shadow-lg xl:left-28"
            >
              {kind === "chart" && (
                <>
                  <Image
                    width={960}
                    height={480}
                    className="h-[30rem] w-[60rem] rounded-lg"
                    src="/images/chart.png"
                    alt="chartImage"
                  />
                  <p>npm 패키지 다운로드 횟수를 차트로 확인해보세요!</p>
                  <p>차트 그래프는 최대 5개, 시간 범위는 1개월 입니다. </p>
                  <p>
                    우측 상단의 쓰레기 통 아이콘을 누르면 차트가 초기화 됩니다.
                  </p>
                </>
              )}
              {kind === "ranking" && (
                <>
                  <p>
                    키워드와 연관된 패키지 중 랭킹이 높은 순위대로 표시됩니다.
                  </p>
                  <p>
                    랭킹은 퀄리티, 유명도, 유지시간을 종합해서 NPM에서 산출한
                    순위입니다.
                  </p>
                </>
              )}
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
        <div className="space-x-4 font-[gugi] text-2xl font-bold text-gray-800 dark:text-white">
          <span
            className={cls(
              "cursor-pointer transition hover:text-[#2ecc71]",
              kind === "chart" ? "text-[#2ecc71]" : ""
            )}
            onClick={() => setKind("chart")}
          >
            차트 비교
          </span>
          <span
            className={cls(
              "cursor-pointer transition hover:text-[#2ecc71]",
              kind === "ranking" ? "text-[#2ecc71]" : ""
            )}
            onClick={() => setKind("ranking")}
          >
            키워드 랭킹
          </span>
        </div>
        {kind === "chart" && (
          <div className="min-h-[70vh] p-8">
            <div className="relative flex items-center space-x-2 pb-12 text-gray-800 dark:text-white">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex items-center"
              >
                <label className="pointer-events-none absolute translate-y-[-2px] text-[#2ecc71]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </label>
                <input
                  placeholder="패키지 명"
                  className="appearance-none border-0 border-b-2 border-[#2ecc71] bg-transparent pl-14 outline-none ring-0 focus:border-[#2ecc71]  focus:ring-0"
                  {...register("search", {
                    required: true,
                  })}
                  type="text"
                  required
                  autoComplete="off"
                />
                <button className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
                  검색
                </button>
              </form>
              <div
                className={cls(
                  `text-xl font-bold `,
                  marker
                    ? "text-[#2ecc71] dark:text-[#2ecc71]"
                    : "text-gray-800 dark:text-white"
                )}
              >
                <span
                  onClick={() => setMarker((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <motion.svg
                    whileHover={{ scale: 1.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </motion.svg>
                </span>
              </div>
              <div
                className={cls(
                  `text-xl font-bold `,
                  stroke === "stepline"
                    ? "text-[#2ecc71] dark:text-[#2ecc71]"
                    : "text-gray-800 dark:text-white"
                )}
              >
                <span
                  onClick={() =>
                    setStroke((prev) => {
                      if (prev === "smooth") {
                        return "stepline";
                      } else {
                        return "smooth";
                      }
                    })
                  }
                  className="cursor-pointer"
                >
                  <motion.svg
                    whileHover={{ scale: 1.2 }}
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
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </motion.svg>
                </span>
              </div>
              <div className="absolute right-0 flex items-center space-x-2 text-2xl font-bold text-gray-800 dark:text-white">
                {series?.length !== 0 ? (
                  series?.map((item, index) => {
                    return (
                      <span className="text-[#2ecc71]" key={index}>
                        #{item?.name}
                      </span>
                    );
                  })
                ) : (
                  <span>패키지명을 검색해보세요!</span>
                )}
                <motion.button
                  animate={controls}
                  whileHover={{ scale: 1.2 }}
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
              </div>
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
                  curve: stroke,
                  width: 5,
                },
                markers: {
                  size: marker ? 5 : 0,
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
        )}
        {kind === "ranking" && (
          <div className="p-8">
            <NpmRanks />
          </div>
        )}
      </Layout>
    </>
  );
};

export default Trend;
