"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Background } from "@/components/Background";
import { Quiz } from "@/components/Quiz";
import { MaxiCard } from "@/components/MaxiCard";
import { Zap, Heart } from "lucide-react";

type AppState = "intro" | "quiz" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("intro");
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    if (!name.trim()) return;
    setState("quiz");
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setState("result");
  };

  const reset = () => {
    setState("intro");
    setScore(0);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative">
      <Background />
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/20 mb-6"
          >
            <Zap className="w-4 h-4 text-accent fill-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">EthMumbai 2024 Edition</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase italic">
            Maxi <span className="text-accent">Checker</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Are you a true Ethereum enthusiast? Take the quiz and flex your Maxi score.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {state === "intro" && (
            <motion.div
              key="intro"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="glass rounded-3xl p-8 md:p-12 w-full max-w-md border-white/10"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">
                    Your Hacker Name / Handle
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. vitalik.eth"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-accent transition-all placeholder:text-white/20"
                    onKeyDown={(e) => e.key === "Enter" && startQuiz()}
                  />
                </div>
                
                <button
                  onClick={startQuiz}
                  disabled={!name.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    name.trim()
                      ? "maxi-gradient text-white shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  Start The Quiz
                </button>
                
                <p className="text-center text-white/30 text-xs font-medium italic">
                  7 questions • Takes less than 60s
                </p>
              </div>
            </motion.div>
          )}

          {state === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <Quiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {state === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <MaxiCard name={name} score={score} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>for ETHMumbai</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
