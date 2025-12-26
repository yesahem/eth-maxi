"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Background } from "@/components/Background";
import { Quiz } from "@/components/Quiz";
import { MaxiCard } from "@/components/MaxiCard";
import { Leaderboard } from "@/components/Leaderboard";
import { Zap, Heart, Search, Loader2 } from "lucide-react";

type AppState = "intro" | "scanning" | "quiz" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("intro");
  const [handle, setHandle] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [aiData, setAiData] = useState<{ score: number; verdict: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Background Scraper/AI Trigger
  const triggerAiAnalysis = async (twitterHandle: string) => {
    console.log("🚀 Starting AI Analysis for @" + twitterHandle);
    setIsAiLoading(true);
    try {
      console.log("📡 Sending request to /api/analyze...");
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: twitterHandle }),
      });
      const data = await response.json();
      
      console.log("✅ AI Analysis Response Received:");
      console.log("━".repeat(60));
      console.log("📊 Maxi Score:", data.aiScore + "/100");
      console.log("💬 Verdict:", data.aiVerdict);
      console.log("📝 Tweets Analyzed:", data.tweetCount);
      console.log("👤 Handle:", "@" + data.handle);
      console.log("━".repeat(60));
      
      setAiData({ score: data.aiScore, verdict: data.aiVerdict });
      console.log("✨ AI data saved to state");
    } catch (err) {
      console.error("❌ AI Analysis failed:", err);
      // Fallback if AI fails
      setAiData({ score: 50, verdict: "Analysis connection lost, but your aura remains strong." });
      console.log("⚠️ Using fallback score: 50/100");
    } finally {
      setIsAiLoading(false);
      console.log("🏁 AI Analysis complete");
    }
  };

  const startFlow = () => {
    if (!handle.trim()) return;
    const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;
    setHandle(cleanHandle);
    
    // Start AI analysis in background
    triggerAiAnalysis(cleanHandle);
    
    // Switch to transition state then quiz
    setState("scanning");
    setTimeout(() => {
        setState("quiz");
    }, 2500);
  };


  const handleQuizComplete = (score: number) => {
    console.log("🎯 Quiz completed! Score:", score + "/100");
    setQuizScore(score);
    setState("result");
    
    // Log final score calculation
    if (aiData) {
      const combined = Math.round((score + aiData.score) / 2);
      console.log("🧮 Final Score Calculation:");
      console.log("   Quiz Score:", score + "/100");
      console.log("   AI Score:", aiData.score + "/100");
      console.log("   Final Score:", combined + "/100 (average)");
    }
  };

  // Save to leaderboard
  const saveToLeaderboard = async () => {
    if (!handle || !aiData) {
      console.log("⚠️ Cannot save: missing handle or aiData");
      return;
    }
    
    const finalScore = Math.round((quizScore + aiData.score) / 2);
    
    try {
      console.log("💾 Saving to leaderboard...");
      console.log("   Handle:", handle);
      console.log("   Final Score:", finalScore);
      console.log("   AI Score:", aiData.score);
      console.log("   Quiz Score:", quizScore);
      
      const response = await fetch("/api/leaderboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          score: finalScore,
          aiScore: aiData.score,
          quizScore,
          verdict: aiData.verdict
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Saved to leaderboard!", data);
      } else {
        console.error("❌ Failed to save:", data);
      }
    } catch (error) {
      console.error("❌ Failed to save to leaderboard:", error);
    }
  };

  // Auto-save when result is shown
  useEffect(() => {
    if (state === "result" && aiData && quizScore > 0) {
      saveToLeaderboard();
    }
  }, [state, aiData, quizScore]);

  const reset = () => {
    console.log("🔄 Resetting app...");
    setState("intro");
    setQuizScore(0);
    setAiData(null);
    setHandle("");
  };

  // Final Combined Score Calculation
  const finalScore = aiData 
    ? Math.round((quizScore + aiData.score) / 2) 
    : quizScore;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <Background />
      
      <div className="z-10 w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/20 mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">AI Power Scanner</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-2 text-white uppercase italic">
            Maxi <span className="text-accent">Scanner</span>
          </h1>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 flex flex-col items-center w-full">
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
                    Enter X / Twitter Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 text-lg font-bold">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="vitalik"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-lg focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                      onKeyDown={(e) => e.key === "Enter" && startFlow()}
                    />
                  </div>
                </div>
                
                <button
                  onClick={startFlow}
                  disabled={!handle.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    handle.trim()
                      ? "maxi-gradient text-white shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  Start Scan & Quiz
                </button>
                
                <p className="text-center text-white/30 text-xs font-medium px-4">
                  We'll analyze your recent tweets via AI while you finish the quiz.
                </p>
              </div>
            </motion.div>
          )}

          {state === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-24 h-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-accent/20 border-t-accent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 text-accent animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 italic">Scanning @{handle}...</h3>
                <p className="text-white/40 text-sm font-mono tracking-tight animate-pulse">
                  FETCHING_LATEST_TWEETS... PARSING_SENTIMENT...
                </p>
              </div>
            </motion.div>
          )}

          {state === "quiz" && (
            <motion.div
                key="quiz"
                className="w-full relative"
            >
                {/* Background Status Indicator */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono whitespace-nowrap">
                    {isAiLoading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin text-accent" />
                            <span className="text-white/40">AI Deep Scanning Tweets in background...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-green-500/80 uppercase font-black">AI Analysis Ready! Just finish the quiz.</span>
                        </>
                    )}
                </div>
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
                {/* If AI is still loading, show a small wait state */}
                {isAiLoading ? (
                    <div className="flex flex-col items-center gap-8 py-20">
                         <div className="relative w-20 h-20">
                            <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-white/5 border-t-accent rounded-full"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Finalizing AI Result</h2>
                            <p className="text-white/40">Our AI is analyzing your tweets...</p>
                        </div>
                    </div>
                ) : (
                    <MaxiCard 
                        name={handle} 
                        score={finalScore} 
                        onReset={reset}
                        aiVerdict={aiData?.verdict}
                        quizScore={quizScore}
                        aiScore={aiData?.score || 0}
                    />
                )}
            </motion.div>
          )}
        </AnimatePresence>
          </div>

          {/* Leaderboard - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center gap-2 opacity-30">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>Made with ❤️ for </span>
            <span className="text-accent">ETHMumbai 2025</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
