/* eslint-disable @next/next/no-img-element */
export default function PageLoading() {
  return (
    <div className="bg-dark fixed z-20 flex h-[100vh] w-[1600px] flex-col items-center justify-center font-bold text-gray-800 ">
      <img src="/images/loading.gif" alt="" />
    </div>
  );
}
