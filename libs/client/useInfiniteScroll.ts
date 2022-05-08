import { pageAtom } from "@atom/atom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
interface IProps {
  pages: number;
}
export function useInfiniteScroll({ pages }: IProps) {
  const [currentPage, setCurrentPage] = useRecoilState(pageAtom);
  function handleScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      if (pages === currentPage) return;
      setCurrentPage((p) => p + 1);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return currentPage;
}
