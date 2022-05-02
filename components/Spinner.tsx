import { motion } from "framer-motion";
export default function Spinner() {
  return (
    <motion.div
      className="border-white-600 h-full w-full rounded-full border-4 border-t-4 border-t-blue-300 bg-transparent"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );
}
