import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Swal from "sweetalert2";
interface Props {
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: string[];
}
export default function TagForm({ setTags, tags }: Props) {
  const [tag, setTag] = useState("");
  const makeTagHandle = () => {
    if (tag.length < 1) return;
    if (tags.length === 10) {
      Swal.fire({
        icon: "error",
        text: "태그는 최대 10개 까지 넣을 수 있습니다!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    setTags((prev) => {
      const newArray = [...prev, tag];
      const set = new Set(newArray);
      //@ts-ignore
      const uniqueTags = [...set];
      return uniqueTags;
    });
    setTag("");
    return;
  };
  const onTagEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      makeTagHandle();
    }
  };
  const onOutsideClick = () => {
    makeTagHandle();
  };
  const onDelete = (index: number) => {
    setTags((prev) => {
      const deletedArray = [...prev];
      deletedArray.splice(index, 1);
      return deletedArray;
    });
  };
  return (
    <div className="flex items-center space-x-2 pb-8">
      {tags.map((tag, index) => {
        return (
          <div
            key={index}
            className="flex w-auto items-center rounded-xl bg-slate-500 py-1 px-2 font-bold text-white dark:bg-slate-800 dark:text-white"
          >
            #{tag}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-5 w-5 cursor-pointer"
              onClick={() => onDelete(index)}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      })}
      <div className="item-center flex cursor-pointer items-center">
        {tags.length === 10 ? (
          <></>
        ) : (
          <div className="flex rounded-md shadow-sm">
            <div className="text-base font-normal text-gray-400 dark:bg-slate-800 dark:text-white">
              #
            </div>
            <OutsideClickHandler onOutsideClick={onOutsideClick}>
              <input
                placeholder="태그입력"
                value={tag}
                maxLength={20}
                spellCheck={false}
                onKeyDown={(e) => {
                  onTagEnter(e);
                }}
                onChange={(e) => setTag(e.currentTarget.value)}
                onKeyPress={(
                  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                className="w-20 appearance-none border-b-2 outline-none dark:bg-slate-800 dark:text-white "
              />
            </OutsideClickHandler>
          </div>
        )}
      </div>
    </div>
  );
}
