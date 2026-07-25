import { motion } from "framer-motion";
import { useRef } from "react";

export default function SnapSection({ children, className, threshold = 0.3 }) {
  const ref = useRef(null);
  const hasSnapped = useRef(false);

  const handleEnter = () => {
    if (hasSnapped.current) return;

    hasSnapped.current = true;

    const navbarHeight = 91.36;

    const y =
      ref.current.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setTimeout(() => {
      hasSnapped.current = false;
    }, 800);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      viewport={{ amount: threshold }}
      onViewportEnter={handleEnter}
    >
      {children}
    </motion.div>
  );
}
