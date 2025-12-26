"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import { Download, Twitter, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface MaxiCardProps {
  name: string;
  score: number;
  onReset: () => void;
}

export const MaxiCard = ({ name, score, onReset }: MaxiCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getLevel = (s: number) => {
    if (s <= 30) return { title: "ETHMumbai Curious 👀", color: "from-blue-500 to-cyan-400" };
    if (s <= 60) return { title: "ETHMumbai Supporter 🧡", color: "from-orange-500 to-yellow-400" };
    if (s <= 85) return { title: "ETHMumbai Maxi 🔥", color: "from-red-500 to-orange-400" };
    return { title: "ETHMumbai Ultra Maxi ❤️‍🔥", color: "from-accent to-accent-secondary" };
  };

  const level = getLevel(score);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 1, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `ethmumbai-maxi-card-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
    }
  };

  const shareOnTwitter = () => {
    const text = `I just scored ${score}% on the ETHMumbai Maxi Checker! I'm an ${level.title}.\n\nCheck yours here: ${window.location.origin}\n\n#ETHMumbai #Ethereum #MaxiChecker`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Trigger confetti on load if high score
  if (score >= 60) {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0055", "#7000ff", "#ffffff"],
      });
    }, 500);
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center">
      {/* The Visual Card (Hidden or Displayed) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-center mb-10"
      >
        <div
          ref={cardRef}
          className={`aspect-square w-full max-w-[400px] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-black border border-white/10 shadow-2xl`}
        >
          {/* Background Decoration */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${level.color}`} />
          <div className="absolute top-[-10%] right-[-10%] w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-white/40 text-xs font-mono tracking-widest uppercase">Official Certificate</span>
                <h3 className="text-2xl font-black mt-1 uppercase italic tracking-tighter">ETHMumbai</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-[10px] font-bold text-white/80 uppercase">Maxi Checker 2024</span>
              </div>
            </div>

            <div className="mt-auto mb-auto py-10">
              <span className="text-white/60 text-sm font-medium">Verify level for:</span>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight break-words">
                @{name || "Hacker"}
              </h1>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Score</p>
                  <p className="text-6xl font-black text-white tabular-nums tracking-tighter">
                    {score}<span className="text-2xl opacity-50">%</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Rank</p>
                  <p className={`text-xl font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent leading-none`}>
                    {level.title.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-20">
            <p className="text-[8px] uppercase tracking-[0.5em] font-mono">
              Build with ❤️ by ETHMumbai Community
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={downloadCard}
          className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </button>
        <button
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#1DA1F2] text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Twitter className="w-5 h-5" />
          Share on X
        </button>
        <button
          onClick={onReset}
          className="md:col-span-2 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
};
