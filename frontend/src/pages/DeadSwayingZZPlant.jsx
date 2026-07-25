import React from "react";
import { motion } from "framer-motion";

const DeadSwayingZZPlant = () => {
  const deadLeaves = [
    {
      id: 1,
      x: 110,
      y: 130,
      rot: -25,
      scale: 1.1,
      color: "#785E2F",
      duration: 4.2,
      delay: 0.1,
    },
    {
      id: 2,
      x: 120,
      y: 150,
      rot: -135,
      scale: 1.2,
      color: "#634A1C",
      duration: 5.1,
      delay: 0.5,
    },
    {
      id: 3,
      x: 130,
      y: 175,
      rot: -20,
      scale: 1.2,
      color: "#8C6D31",
      duration: 3.9,
      delay: 1.2,
    },
    {
      id: 4,
      x: 140,
      y: 200,
      rot: -130,
      scale: 1.2,
      color: "#5A4620",
      duration: 4.7,
      delay: 0.8,
    },
    {
      id: 5,
      x: 150,
      y: 230,
      rot: -15,
      scale: 1.1,
      color: "#807028",
      duration: 5.5,
      delay: 2.0,
    },
    {
      id: 6,
      x: 160,
      y: 260,
      rot: -135,
      scale: 1.1,
      color: "#6E5524",
      duration: 4.0,
      delay: 1.5,
    },
    {
      id: 7,
      x: 165,
      y: 80,
      rot: -55,
      scale: 1.1,
      color: "#8C6D31",
      duration: 4.8,
      delay: 0.3,
    },
    {
      id: 8,
      x: 170,
      y: 105,
      rot: -145,
      scale: 1.3,
      color: "#5A4620",
      duration: 5.2,
      delay: 1.7,
    },
    {
      id: 9,
      x: 175,
      y: 135,
      rot: -45,
      scale: 1.3,
      color: "#785E2F",
      duration: 3.7,
      delay: 0.9,
    },
    {
      id: 10,
      x: 180,
      y: 165,
      rot: -140,
      scale: 1.3,
      color: "#9E8338",
      duration: 4.5,
      delay: 2.2,
    },
    {
      id: 11,
      x: 185,
      y: 195,
      rot: -35,
      scale: 1.3,
      color: "#634A1C",
      duration: 5.0,
      delay: 0.4,
    },
    {
      id: 12,
      x: 190,
      y: 230,
      rot: -135,
      scale: 1.2,
      color: "#785E2F",
      duration: 4.3,
      delay: 1.1,
    },
    {
      id: 13,
      x: 240,
      y: 70,
      rot: -125,
      scale: 1.1,
      color: "#6E5524",
      duration: 4.9,
      delay: 0.7,
    },
    {
      id: 14,
      x: 235,
      y: 95,
      rot: -5,
      scale: 1.3,
      color: "#807028",
      duration: 3.6,
      delay: 1.9,
    },
    {
      id: 15,
      x: 228,
      y: 125,
      rot: -105,
      scale: 1.3,
      color: "#5A4620",
      duration: 5.3,
      delay: 0.2,
    },
    {
      id: 16,
      x: 222,
      y: 155,
      rot: -15,
      scale: 1.3,
      color: "#8C6D31",
      duration: 4.1,
      delay: 1.4,
    },
    {
      id: 17,
      x: 215,
      y: 190,
      rot: -115,
      scale: 1.3,
      color: "#785E2F",
      duration: 4.6,
      delay: 2.5,
    },
    {
      id: 18,
      x: 210,
      y: 225,
      rot: -25,
      scale: 1.2,
      color: "#634A1C",
      duration: 3.8,
      delay: 0.6,
    },
    {
      id: 19,
      x: 300,
      y: 130,
      rot: -155,
      scale: 1.1,
      color: "#5A4620",
      duration: 5.4,
      delay: 1.3,
    },
    {
      id: 20,
      x: 285,
      y: 150,
      rot: -15,
      scale: 1.2,
      color: "#807028",
      duration: 4.4,
      delay: 0.9,
    },
    {
      id: 21,
      x: 270,
      y: 175,
      rot: -160,
      scale: 1.2,
      color: "#6E5524",
      duration: 4.9,
      delay: 2.1,
    },
    {
      id: 22,
      x: 255,
      y: 200,
      rot: -20,
      scale: 1.2,
      color: "#8C6D31",
      duration: 3.5,
      delay: 0.4,
    },
    {
      id: 23,
      x: 240,
      y: 230,
      rot: -165,
      scale: 1.1,
      color: "#785E2F",
      duration: 5.0,
      delay: 1.6,
    },
    {
      id: 24,
      x: 225,
      y: 260,
      rot: -25,
      scale: 1.1,
      color: "#9E8338",
      duration: 4.2,
      delay: 0.8,
    },
    {
      id: 25,
      x: 165,
      y: 285,
      rot: -20,
      scale: 1.0,
      color: "#634A1C",
      duration: 4.7,
      delay: 1.0,
    },
    {
      id: 26,
      x: 215,
      y: 275,
      rot: -155,
      scale: 1.0,
      color: "#5A4620",
      duration: 3.9,
      delay: 2.3,
    },
    {
      id: 27,
      x: 130,
      y: 220,
      rot: -35,
      scale: 0.9,
      color: "#807028",
      duration: 5.1,
      delay: 0.5,
    },
    {
      id: 28,
      x: 270,
      y: 200,
      rot: -145,
      scale: 0.9,
      color: "#785E2F",
      duration: 4.6,
      delay: 1.8,
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
            <linearGradient id="deadStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5D5323" />
              <stop offset="100%" stopColor="#3B2E14" />
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
            stroke="url(#deadStemGrad)"
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

          {deadLeaves.map((leaf) => (
            <motion.g
              key={leaf.id}
              style={{
                originX: `${leaf.x}px`,
                originY: `${leaf.y}px`,
              }}
              animate={{
                rotate: [0, -6, 4, -3, 5, 0],
                x: [0, -2, 1, -1, 2, 0],
                y: [0, 1, -1, 1, 0, 0],
              }}
              transition={{
                duration: leaf.duration,
                repeat: Infinity,
                delay: leaf.delay,
                ease: "easeInOut",
              }}
            >
              <use
                href="#zz-leaf"
                x={leaf.x}
                y={leaf.y}
                fill={leaf.color}
                transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(${leaf.scale})`}
              />
            </motion.g>
          ))}

          <ellipse cx="200" cy="340" rx="70" ry="12" fill="#2D1A10" />

          <path
            d="M 130 340 L 270 340 L 252 430 L 148 430 Z"
            fill="url(#potGrad)"
          />
          <path d="M 124 324 L 276 324 L 270 340 L 130 340 Z" fill="#B84A28" />
          <ellipse cx="200" cy="324" rx="76" ry="6" fill="#C85A38" />
        </svg>
      </div>
    </div>
  );
};

export default DeadSwayingZZPlant;
