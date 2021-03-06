import { cls } from "@libs/client/utils";
interface ButtonProps {
  large?: boolean;
  text: string;
  css?: string;
  loading?: boolean;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  css,
  text,
  loading,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-auto whitespace-nowrap rounded-md border border-transparent bg-slate-500 px-4 text-xl font-bold text-white shadow-sm hover:bg-slate-600 focus:outline-none dark:border-2 ",
        large ? "py-3 text-base" : "py-2 text-sm ",
        css ? css : ""
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
