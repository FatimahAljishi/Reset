import { motion } from "framer-motion";

export default function AnimatedClock() {
  return (
    <svg
      width="75"
      height="75"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <circle cx="110" cy="110" r="94" fill="black" opacity="0.05" />

      {/* Face */}
      <circle
        cx="110"
        cy="110"
        r="90"
        fill="#F7F4EA"
        stroke="#DDD7CA"
        strokeWidth="2"
      />

      {/* Tick Marks */}
      <g stroke="#465e2c" strokeWidth="2" strokeLinecap="round">
        <line x1="110" y1="28" x2="110" y2="40" />
        <line x1="110" y1="180" x2="110" y2="192" />
        <line x1="28" y1="110" x2="40" y2="110" />
        <line x1="180" y1="110" x2="192" y2="110" />
      </g>

      {/* Hour Hand */}
      <motion.g
        animate={{ rotate: [-40, -10] }}
        transition={{
          duration: 240,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          transformOrigin: "110px 110px",
          transformBox: "view-box",
        }}
      >
        <line
          x1="110"
          y1="110"
          x2="110"
          y2="78"
          stroke="#465e2c"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Minute Hand */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          transformOrigin: "110px 110px",
          transformBox: "view-box",
        }}
      >
        <line
          x1="110"
          y1="110"
          x2="110"
          y2="55"
          stroke="#465e2c"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Center */}
      <circle cx="110" cy="110" r="5" fill="#465e2c" />
    </svg>
  );
}
