"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const GlowingEffect = ({
  glow = true,
  spread = 40,
  proximity = 64,
  disabled = false,
  inactiveZone = 0.01,
  className
}) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 z-0 pointer-events-none transition-opacity duration-300",
        glow ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        background: `radial-gradient(${spread}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.15), transparent 80%)`,
      }}
    />
  );
};
