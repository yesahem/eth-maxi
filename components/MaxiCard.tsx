"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import { Download, Twitter, RefreshCcw, Brain, GraduationCap } from "lucide-react";
import confetti from "canvas-confetti";

interface MaxiCardProps {
  name: string;
  score: number;
  onReset: () => void;
  aiVerdict?: string;
  quizScore?: number;
  aiScore?: number;
}

export const MaxiCard = ({ name, score, onReset, aiVerdict, quizScore, aiScore }: MaxiCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getLevel = (s: number) => {
    if (s <= 30) return { title: "ETHMumbai Curious 👀", color: "from-blue-500 to-cyan-400" };
    if (s <= 55) return { title: "ETHMumbai Supporter 🧡", color: "from-orange-500 to-yellow-400" };
    if (s <= 80) return { title: "ETHMumbai Maxi 🔥", color: "from-red-500 to-orange-400" };
    return { title: "ETHMumbai Ultra Maxi ❤️‍🔥", color: "from-accent to-accent-secondary" };
  };

  const level = getLevel(score);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 1, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `maxi-card-${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const shareOnTwitter = () => {
    const text = `I just got analyzed by the ETHMumbai AI Maxi Scanner! 🤖📊\n\nHandle: @${name}\nMaxi Score: ${score}%\nRank: ${level.title}\n\nCheck your rank: ${window.location.origin}\n\n#ETHMumbai #Ethereum #AIMaxi`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (score >= 60) {
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#ff0044", "#ff4400", "#ffffff"] });
    }, 500);
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-center mb-10"
      >
        <div
          ref={cardRef}
          className="aspect-square w-full max-w-[420px] rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Card Decorations */}
          <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${level.color}`} />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/20 blur-[100px]" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-1">Authenticated</p>
                <h3 className="text-xl font-black italic tracking-tighter text-white uppercase underline decoration-accent decoration-2 underline-offset-4">ETHMumbai</h3>
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-1">
                  <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">v1.0 AI-Scan</span>
                </div>
                <div className="text-[8px] font-mono text-white/20">{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="my-auto">
              <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Profile:</span>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight break-all mt-1">
                @{name}
              </h1>
              
              <div className="mt-4 flex gap-3">
                <div className="glass px-3 py-2 rounded-xl flex items-center gap-2 border-white/5">
                    <Brain className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] font-bold text-white/70">AI: {aiScore}%</span>
                </div>
                <div className="glass px-3 py-2 rounded-xl flex items-center gap-2 border-white/5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold text-white/70">Quiz: {quizScore}%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Maxi Score</p>
                  <p className="text-7xl font-black text-white tabular-nums tracking-tighter -ml-1">
                    {score}<span className="text-2xl opacity-40">%</span>
                  </p>
                </div>
                <div className="text-right pb-2">
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Status</p>
                  <p className={`text-xl font-black italic uppercase bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                    {level.title.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Intelligence Report */}
      {aiVerdict && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md mb-10 glass rounded-3xl p-6 border-white/10"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-accent/20">
                    <Brain className="w-4 h-4 text-accent" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">AI Analysis Report</h4>
            </div>
            <p className="text-white/60 text-sm leading-relaxed italic md:px-2">
                "{aiVerdict}"
            </p>
        </motion.div>
      )}

      {/* Actions */}
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
          Share result
        </button>
        <button
          onClick={onReset}
          className="md:col-span-2 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
          Run New Scan
        </button>
      </div>
    </div>
  );
};
