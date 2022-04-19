import { motion } from "framer-motion";
import Image from "next/image";
interface ICategoryIcon {
  layoutId: string;
  isLarge?: boolean;
  text?: string;
  [key: string]: any;
}

export default function CategoryIcon({
  layoutId,
  onClick,
  isLarge,
  text,
}: ICategoryIcon) {
  if (isLarge) {
    return (
      <motion.div
        layoutId={layoutId}
        className="hidden cursor-pointer lg:block"
        onClick={() => onClick(layoutId === "Posts" ? null : layoutId)}
      >
        <Image
          width={360}
          height={360}
          src={`/images/${layoutId}.png`}
          alt=""
        />
        <div className="text-center text-gray-900 text-6xl font-extrabold">
          {layoutId}
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        layoutId={layoutId}
        className="cursor-pointer"
        onClick={() => onClick(layoutId === "Posts" ? null : layoutId)}
      >
        <Image width={80} height={80} src={`/images/${layoutId}.png`} alt="" />
        <div className="text-center text-gray-900 text-lg font-bold">
          {text}
        </div>
      </motion.div>
    );
  }
}
