"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Terminal = ({
  commands,
  outputs,
  typingSpeed = 50,
  delayBetweenCommands = 1000
}) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (currentLine >= commands.length) return;

    let charIndex = 0;
    const command = commands[currentLine];
    setDisplayedText("");
    setShowOutput(false);

    const interval = setInterval(() => {
      if (charIndex <= command.length) {
        setDisplayedText(command.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowOutput(idx => idx === currentLine);
          setTimeout(() => {
            setCurrentLine(prev => prev + 1);
          }, delayBetweenCommands);
        }, 500);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentLine, commands, typingSpeed, delayBetweenCommands]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm">
      <div className="bg-slate-800/50 px-4 py-2 border-b border-white/5 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest pl-4">AgriCore Neural Core v2.0-Alpha</span>
      </div>
      <div className="p-6 h-[400px] overflow-y-auto text-slate-300">
        {commands.slice(0, currentLine).map((cmd, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex">
              <span className="text-emerald-500 mr-2">$</span>
              <span>{cmd}</span>
            </div>
            {outputs[idx] && (
              <div className="mt-2 text-slate-500 italic">
                {outputs[idx].map((line, lIdx) => (
                  <div key={lIdx}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {currentLine < commands.length && (
          <div className="flex">
            <span className="text-emerald-500 mr-2">$</span>
            <span>{displayedText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-emerald-500 ml-1 self-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};
