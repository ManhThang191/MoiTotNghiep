"use client";

import { Heart,GraduationCap ,Flower2,
  Sparkles, } from "lucide-react";




  const colors = [
  "text-yellow-500",
  "text-pink-400",
  "text-rose-400",
  "text-red-400",
  "text-orange-400",
  "text-purple-400",
];
const hearts = [
  {
    id: 1,
    left: "10%",
    top: "80%",
    size: 22,
    duration: 8,
    delay: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 2,
    left: "35%",
    top: "20%",
    size: 18,
    duration: 10,
    delay: 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 3,
    left: "50%",
    top: "80%",
    size: 30,
    duration: 17,
    delay: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 4,
    left: "65%",
    top: "40%",
    size: 16,
    duration: 15,
    delay: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
];

const hats = [
  {
    id: 1,
    left: "8%",
    top: "15%",
    size: 42,
    duration: 28,
    delay: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 2,
    left: "82%",
    top: "22%",
    size: 34,
    duration: 22,
    delay: 3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 3,
    left: "15%",
    top: "70%",
    size: 38,
    duration: 30,
    delay: 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
];

const flowers = [
  {
    id: 1,
    left: "12%",
    top: "25%",
    size: 24,
    duration: 18,
    delay: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 2,
    left: "78%",
    top: "55%",
    size: 20,
    duration: 15,
    delay: 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 3,
    left: "48%",
    top: "12%",
    size: 28,
    duration: 20,
    delay: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    id: 4,
    left: "90%",
    top: "85%",
    size: 22,
    duration: 17,
    delay: 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
];



export default function FloatingHearts() {
  return (
    <div className="pointer-events-none  fixed inset-0 z-[9999] overflow-hidden">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          fill="#ef4444"
          
          strokeWidth={1}
          className={`absolute animate-heart ${heart.color}`}
          style={{
            left: heart.left,
            top: heart.top,
            width: heart.size,
            height: heart.size,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        />
      ))}

      {hats.map((hat) => (
  <GraduationCap
    key={hat.id}
    className={`absolute animate-hat ${hat.color}`}
    style={{
      left: hat.left,
      top: hat.top,
      width: hat.size,
      height: hat.size,
      animationDuration: `${hat.duration}s`,
      animationDelay: `${hat.delay}s`,
    }}
  />
  
    ))}

    {flowers.map((flower) => (
  <Flower2
    key={flower.id}
    className={`absolute animate-flower ${flower.color}`}
    style={{
      left: flower.left,
      top: flower.top,
      width: flower.size,
      height: flower.size,
      animationDuration: `${flower.duration}s`,
      animationDelay: `${flower.delay}s`,
    }}
  />
))}


    </div>
  );
}