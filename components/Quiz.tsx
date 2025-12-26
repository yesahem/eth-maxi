"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Brain, Terminal } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    question: "What programming language is most commonly used for Ethereum smart contracts?",
    options: ["Rust", "Solidity", "Go", "Python"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which client-side wallet is most commonly used to interact with Ethereum dApps?",
    options: ["Trust Wallet", "MetaMask", "Ledger Live", "Coinbase App"],
    correct: 1,
  },
  {
    id: 3,
    question: "Which hackathon helped popularize 1inch through early DeFi innovation?",
    options: ["ETHParis", "ETHGlobal New York", "ETHBerlin", "ETHLondon"],
    correct: 1,
  },
  {
    id: 4,
    question: "ETHGlobal hackathons are best known for what?",
    options: [
      "Long-term accelerators",
      "Rapid global hackathons",
      "Only Layer 2 projects",
      "Trading competitions",
    ],
    correct: 1,
  },
  {
    id: 5,
    question: "Which of these companies is known to actively sponsor and recruit at ETH hackathons?",
    options: ["Netflix", "1inch", "Uber", "Spotify"],
    correct: 1,
  },
  {
    id: 6,
    question: "What usually happens to strong hackathon projects after ETH events?",
    options: [
      "They disappear",
      "They pivot into startups",
      "They become memecoins",
      "They stay as demos forever",
    ],
    correct: 1,
  },
  {
    id: 7,
    question: "ETHMumbai is part of which global hackathon ecosystem?",
    options: ["HackMIT", "ETHGlobal-style events", "Google DevFest", "Y Combinator"],
    correct: 1,
  },
  {
    id: 8,
    question: "Which DeFi category did many early ETH hackathon projects focus on?",
    options: ["NFT Gaming", "DEX Aggregation", "Social Media", "AI Chatbots"],
    correct: 1,
  },
  {
    id: 9,
    question: "Why do protocols like Polygon and Arbitrum attend ETH hackathons?",
    options: [
      "Marketing only",
      "To onboard real builders",
      "To sell tokens",
      "For legal compliance",
    ],
    correct: 1,
  },
  {
    id: 10,
    question: "Which ETH event is globally known for back-to-back hackathons across continents?",
    options: ["ETHDenver", "ETHIndia", "ETHGlobal", "Devcon"],
    correct: 2,
  },
  {
    id: 11,
    question: "What is Devcon primarily focused on?",
    options: [
      "Trading workshops",
      "Ethereum core research & ecosystem",
      "Startup demo days",
      "Only hackathons",
    ],
    correct: 1,
  },
  {
    id: 12,
    question: "What separates ETH hackathons from traditional startup events?",
    options: [
      "No judges",
      "Code-first, ideas second",
      "Only pitch decks",
      "No real users",
    ],
    correct: 1,
  },
];


interface QuizProps {
  onComplete: (score: number) => void;
}

export const Quiz = ({ onComplete }: QuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const correctCount = newAnswers.reduce((acc, current, index) => {
        return current === QUESTIONS[index].correct ? acc + 1 : acc;
      }, 0);
      const score = Math.round((correctCount / QUESTIONS.length) * 100);
      onComplete(score);
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Progress & AI Status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Quiz Mastery</span>
        <div className="flex items-center gap-1.5 glass px-2 py-0.5 rounded-full border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-bold text-accent uppercase tracking-tighter">AI Scraper Active</span>
        </div>
      </div>
      
      <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full maxi-gradient shadow-[0_0_10px_rgba(255,0,85,0.5)]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="glass rounded-3xl p-6 md:p-10 border-white/5 relative overflow-hidden"
        >
          {/* Decorative background brain */}
          <Brain className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 rotate-12" />

          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-2 mb-2">
                 <Terminal className="w-3.5 h-3.5 text-accent" />
                 <span className="text-accent text-[10px] font-black tracking-widest uppercase">
                    Checkpoint {currentStep + 1}/7
                </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight italic">
              {QUESTIONS[currentStep].question}
            </h2>
          </div>

          <div className="space-y-2 relative z-10">
            {QUESTIONS[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                  selectedOption === index
                    ? "bg-accent/10 border-accent text-accent translate-x-1"
                    : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <span className="text-base font-bold uppercase tracking-tight">{option}</span>
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    selectedOption === index
                      ? "bg-accent border-accent"
                      : "border-white/20 group-hover:border-white/40"
                  }`}
                >
                  {selectedOption === index && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full mt-10 py-4 rounded-2xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null
                ? "maxi-gradient text-white shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-white/10 cursor-not-allowed"
            }`}
          >
            {currentStep === QUESTIONS.length - 1 ? "Submit to AI" : "Next Protocol"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
