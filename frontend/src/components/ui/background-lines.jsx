"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}) => {
  return (
    <div className={cn("h-[50rem] relative w-full flex items-center justify-center overflow-hidden", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      >
        <path d="M0 0 L1440 900" stroke="rgba(255,255,255,0.03)" />
        <path d="M1440 0 L0 900" stroke="rgba(255,255,255,0.03)" />
        <motion.path
          d="M0 450 L1440 450"
          stroke="rgba(16,185,129,0.05)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="720" cy="450" r="300" stroke="rgba(3b,82,f6,0.03)" strokeDasharray="10 10" />
      </svg>
      {children}
    </div>
  );
};
