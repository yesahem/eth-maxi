"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    question: "In which city is ETHMumbai typically held?",
    options: ["Mumbai", "London", "Paris", "New York"],
    correct: 0,
  },
  {
    id: 2,
    question: "Ethereum moved to Proof of Stake in an event called?",
    options: ["The Merge", "The Burn", "The Flip", "The Surge"],
    correct: 0,
  },
  {
    id: 3,
    question: "What is the primary coding language for Ethereum smart contracts?",
    options: ["Solidity", "Python", "Java", "Rust"],
    correct: 0,
  },
  {
    id: 4,
    question: "Which of these is NOT an Ethereum Layer 2?",
    options: ["Arbitrum", "Optimism", "Base", "Bitcoin"],
    correct: 3,
  },
  {
    id: 5,
    question: "What is the current logo shape of Ethereum?",
    options: ["Square", "Circle", "Octahedron", "Triangle"],
    correct: 2,
  },
  {
    id: 6,
    question: "ETHMumbai is a community-led hackathon in which country?",
    options: ["India", "USA", "China", "Brazil"],
    correct: 0,
  },
  {
    id: 7,
    question: "What do you call a full-blown Ethereum enthusiast?",
    options: ["Maxi", "Banker", "Noob", "Miner"],
    correct: 0,
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
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full maxi-gradient"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="glass rounded-3xl p-6 md:p-10"
        >
          <div className="mb-8">
            <span className="text-accent text-sm font-mono tracking-widest uppercase">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              {QUESTIONS[currentStep].question}
            </h2>
          </div>

          <div className="space-y-3">
            {QUESTIONS[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  selectedOption === index
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{option}</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    selectedOption === index
                      ? "bg-accent border-accent"
                      : "border-white/20 group-hover:border-white/40"
                  }`}
                >
                  {selectedOption === index && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full mt-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null
                ? "maxi-gradient text-white shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            {currentStep === QUESTIONS.length - 1 ? "Get Results" : "Next Question"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
