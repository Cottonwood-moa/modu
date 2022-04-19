import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
interface Props {
  children: React.ReactNode;
}
export default function ScrollAnimate({ children }: Props) {
  // 필요에 따라 props에 kind를 넣어서 애니메이션을 하나씩 추가하자.
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    // ref가 화면에 들어오면
    if (inView) {
      // visible을 트리거한다.
      controls.start("visible");
    } else {
      controls.start("exit");
    }
  }, [controls, inView]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        transition={{ type: "spring", duration: 0.8 }}
        variants={{
          visible: { opacity: 1, y: -64, rotate: -180 },
          hidden: { opacity: 0, y: 0 },
          exit: { opacity: 0, y: 0, rotate: 0 },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
