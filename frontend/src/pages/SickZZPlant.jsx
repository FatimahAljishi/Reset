import React from "react";
import { motion } from "framer-motion";

const SickZZPlant = () => {
  const fallingLeaves = [
    {
      id: 1,
      x: 130,
      y: 150,
      rot: -30,
      delay: 0,
      duration: 4.5,
      color: "#9E9D24",
    },
    {
      id: 2,
      x: 260,
      y: 170,
      rot: 45,
      delay: 1.2,
      duration: 5.0,
      color: "#8C9E38",
    },
    {
      id: 3,
      x: 180,
      y: 110,
      rot: 10,
      delay: 2.5,
      duration: 4.8,
      color: "#A59D3F",
    },
    {
      id: 4,
      x: 220,
      y: 220,
      rot: 60,
      delay: 3.1,
      duration: 4.2,
      color: "#B09F36",
    },
    {
      id: 5,
      x: 150,
      y: 240,
      rot: -45,
      delay: 0.7,
      duration: 5.2,
      color: "#8E8B28",
    },
    {
      id: 6,
      x: 280,
      y: 140,
      rot: 25,
      delay: 3.8,
      duration: 4.6,
      color: "#9B9E3B",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F2EB] p-8">
      <div className="w-full max-w-md">
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-xl"
        >
          <defs>
            <g id="zz-leaf">
              <path d="M 0,0 C 12,-10 28,-7 35,0 C 28,7 12,10 0,0 Z" />
            </g>
            <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D87050" />
              <stop offset="50%" stopColor="#C85A38" />
              <stop offset="100%" stopColor="#A84020" />
            </linearGradient>
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A5D23" />
              <stop offset="100%" stopColor="#2E3B14" />
            </linearGradient>
          </defs>

          <ellipse
            cx="200"
            cy="435"
            rx="85"
            ry="10"
            fill="rgba(0, 0, 0, 0.1)"
          />

          <g
            stroke="url(#stemGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M 185 340 Q 150 220 110 130" />
            <path d="M 195 340 Q 180 190 165 80" />
            <path d="M 205 340 Q 220 180 240 70" />
            <path d="M 215 340 Q 260 210 300 130" />
            <path d="M 175 340 Q 150 270 130 220" strokeWidth="4" />
            <path d="M 225 340 Q 250 260 270 200" strokeWidth="4" />
          </g>

          <g fill="#2E5A1C">
            <use
              href="#zz-leaf"
              x="110"
              y="130"
              transform="rotate(-40 110 130) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="120"
              y="150"
              transform="rotate(-150 120 150) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="130"
              y="175"
              transform="rotate(-35 130 175) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="140"
              y="200"
              transform="rotate(-145 140 200) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="150"
              y="230"
              transform="rotate(-30 150 230) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="160"
              y="260"
              transform="rotate(-150 160 260) scale(1.1)"
            />

            <use
              href="#zz-leaf"
              x="165"
              y="80"
              transform="rotate(-70 165 80) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="170"
              y="105"
              transform="rotate(-160 170 105) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="175"
              y="135"
              transform="rotate(-60 175 135) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="180"
              y="165"
              transform="rotate(-155 180 165) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="185"
              y="195"
              transform="rotate(-50 185 195) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="190"
              y="230"
              transform="rotate(-150 190 230) scale(1.2)"
            />

            <use
              href="#zz-leaf"
              x="240"
              y="70"
              transform="rotate(-110 240 70) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="235"
              y="95"
              transform="rotate(-20 235 95) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="228"
              y="125"
              transform="rotate(-120 228 125) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="222"
              y="155"
              transform="rotate(-30 222 155) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="215"
              y="190"
              transform="rotate(-130 215 190) scale(1.3)"
            />
            <use
              href="#zz-leaf"
              x="210"
              y="225"
              transform="rotate(-40 210 225) scale(1.2)"
            />

            <use
              href="#zz-leaf"
              x="300"
              y="130"
              transform="rotate(-140 300 130) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="285"
              y="150"
              transform="rotate(-30 285 150) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="270"
              y="175"
              transform="rotate(-145 270 175) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="255"
              y="200"
              transform="rotate(-35 255 200) scale(1.2)"
            />
            <use
              href="#zz-leaf"
              x="240"
              y="230"
              transform="rotate(-150 240 230) scale(1.1)"
            />
            <use
              href="#zz-leaf"
              x="225"
              y="260"
              transform="rotate(-40 225 260) scale(1.1)"
            />
          </g>

          <g fill="#8E9E38">
            <use
              href="#zz-leaf"
              x="165"
              y="285"
              transform="rotate(-35 165 285) scale(1.0)"
            />
            <use
              href="#zz-leaf"
              x="215"
              y="275"
              transform="rotate(-140 215 275) scale(1.0)"
            />
            <use
              href="#zz-leaf"
              x="130"
              y="220"
              transform="rotate(-50 130 220) scale(0.9)"
            />
            <use
              href="#zz-leaf"
              x="270"
              y="200"
              transform="rotate(-130 270 200) scale(0.9)"
            />
          </g>

          <ellipse cx="200" cy="340" rx="70" ry="12" fill="#2D1A10" />

          <path
            d="M 130 340 L 270 340 L 252 430 L 148 430 Z"
            fill="url(#potGrad)"
          />
          <path d="M 124 324 L 276 324 L 270 340 L 130 340 Z" fill="#B84A28" />
          <ellipse cx="200" cy="324" rx="76" ry="6" fill="#C85A38" />

          {fallingLeaves.map((leaf) => (
            <motion.g
              key={leaf.id}
              initial={{
                x: leaf.x,
                y: leaf.y,
                rotate: leaf.rot,
                opacity: 0,
              }}
              animate={{
                x: [
                  leaf.x,
                  leaf.x - 25,
                  leaf.x + 20,
                  leaf.x - 15,
                  leaf.x + 10,
                  leaf.x - 5,
                ],
                y: [
                  leaf.y,
                  leaf.y + 60,
                  leaf.y + 130,
                  leaf.y + 200,
                  leaf.y + 270,
                  435,
                ],
                rotate: [
                  leaf.rot,
                  leaf.rot - 40,
                  leaf.rot + 60,
                  leaf.rot - 20,
                  leaf.rot + 80,
                  leaf.rot + 10,
                ],
                opacity: [0, 1, 1, 0.9, 0.8, 0],
              }}
              transition={{
                duration: leaf.duration,
                repeat: Infinity,
                delay: leaf.delay,
                ease: "easeInOut",
              }}
            >
              <path
                d="M 0,0 C 12,-10 28,-7 35,0 C 28,7 12,10 0,0 Z"
                fill={leaf.color}
                transform="scale(1.1)"
              />
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SickZZPlant;
