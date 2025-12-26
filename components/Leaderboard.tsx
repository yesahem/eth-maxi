"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";

interface LeaderboardEntry {
  handle: string;
  score: number;
  aiScore: number;
  quizScore: number;
  verdict: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard?limit=10");
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-white/40 font-bold">#{index + 1}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 border-white/10">
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-white/60">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="glass rounded-3xl p-8 border-white/10">
        <h2 className="text-2xl font-black text-white mb-4 uppercase italic flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          Leaderboard
        </h2>
        <p className="text-white/40 text-center py-8">
          No scores yet. Be the first to claim your spot! 🚀
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-8 border-white/10"
    >
      <h2 className="text-2xl font-black text-white mb-6 uppercase italic flex items-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        Top Maxis
      </h2>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.handle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
              index < 3
                ? "bg-white/10 border border-white/20"
                : "bg-white/5 border border-white/5"
            } hover:bg-white/15`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-10">
              {getRankIcon(index)}
            </div>

            {/* Handle */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white truncate">@{entry.handle}</div>
              <div className="text-xs text-white/40 truncate">{entry.verdict.substring(0, 60)}...</div>
            </div>

            {/* Scores */}
            <div className="text-right">
              <div className={`text-2xl font-black ${getScoreColor(entry.score)}`}>
                {entry.score}
              </div>
              <div className="text-[10px] text-white/30 font-mono">
                AI:{entry.aiScore} Q:{entry.quizScore}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={fetchLeaderboard}
        className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm font-bold transition-all"
      >
        Refresh
      </button>
    </motion.div>
  );
}
