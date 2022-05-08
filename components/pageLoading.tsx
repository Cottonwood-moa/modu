import { darkModeAtom } from "@atom/atom";
import { cls } from "@libs/client/utils";
import { useRecoilValue } from "recoil";

/* eslint-disable @next/next/no-img-element */
export default function PageLoading() {
  const isDark = useRecoilValue(darkModeAtom);
  return (
    <div
      className={cls(
        `fixed z-20 flex h-[100vh] w-[100%] flex-col items-center justify-center font-bold text-gray-800`,
        isDark ? "bg-slate-900" : "bg-white"
      )}
    >
      <img src="/images/loading.gif" alt="" />
    </div>
  );
}
