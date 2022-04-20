import React from "react";
import Button from "./button";
import TextArea from "./textarea";

export default function PostComment() {
  return (
    <div className="mt-6 space-y-6">
      <div className="text-2xl font-bold">0 개의 댓글이 있습니다.</div>
      <form className="relative ">
        <TextArea></TextArea>
        <div className=" mt-4 flex justify-end">
          <Button text="댓글등록" />
        </div>
      </form>
      <div className="divide-y-[2px]">
        {[1, 2, 3, 4, 5].map((comment, index) => {
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col space-x-6 p-6">
                {/* comment profile */}
                <div className="flex space-x-6">
                  <div className="h-16 w-16 rounded-full bg-slate-700" />
                  <div>
                    <div className="text-lg font-bold text-gray-700 xl:text-xl ">
                      Cottonwood
                    </div>
                    <div className="text-base font-semibold text-slate-700 xl:text-lg">
                      2022-04-19
                    </div>
                  </div>
                </div>
                {/* detail  */}
                <div className="m-6 text-base  font-semibold xl:text-lg">
                  동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라
                  만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세.
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
