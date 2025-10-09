"use client";

import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const recentTrades = [
  { name: "MaxGaming", time: "2 minutes" },
  { name: "LucasRBLX", time: "5 minutes" },
  { name: "SkyBlox_Pro", time: "8 minutes" },
  { name: "NoahTrade", time: "12 minutes" },
  { name: "EmmaXP", time: "15 minutes" },
];

export function LiveActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentTrades.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentTrade = recentTrades[currentIndex];

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 bg-gradient-to-r from-gray-900 to-gray-800 border border-green-500/50 rounded-lg p-4 shadow-2xl max-w-[280px] transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            <span className="text-green-400">{currentTrade.name}</span> vient de
            trader
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Il y a {currentTrade.time}
          </p>
        </div>
      </div>
    </div>
  );
}
