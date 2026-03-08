"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, rgba(210, 100, 85, 0) 100%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, rgba(210, 100, 85, 0) 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, rgba(210, 100, 85, 0) 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallPartWidth = 400,
  smallPartHeight = 350,
  className
}) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <div
        className="absolute top-0 left-0 w-screen h-screen z-10 pointer-events-none"
        style={{
          background: `
            ${gradientFirst},
            ${gradientSecond},
            ${gradientThird}
          `,
        }}
      />
      <div 
        style={{
          transform: `translateY(${translateY}px) rotate(-45deg)`,
          background: "conic-gradient(from 90deg at 50% 50%, #000000 0%, #000000 50%, #ffffff 50%, #ffffff 100%)",
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 blur-[120px] opacity-20 pointer-events-none"
      />
    </div>
  );
};
