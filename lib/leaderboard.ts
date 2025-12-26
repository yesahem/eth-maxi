// Database-based leaderboard using Prisma
import { prisma } from './prisma';

export interface LeaderboardEntry {
  handle: string;
  score: number;
  aiScore: number;
  quizScore: number;
  verdict: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add or update entry
export async function addToLeaderboard(entry: Omit<LeaderboardEntry, 'createdAt' | 'updatedAt'>): Promise<void> {
  await prisma.leaderboardEntry.upsert({
    where: { handle: entry.handle.toLowerCase() },
    update: {
      score: entry.score,
      aiScore: entry.aiScore,
      quizScore: entry.quizScore,
      verdict: entry.verdict,
    },
    create: {
      handle: entry.handle.toLowerCase(),
      score: entry.score,
      aiScore: entry.aiScore,
      quizScore: entry.quizScore,
      verdict: entry.verdict,
    },
  });
}

// Get top N entries
export async function getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: { score: 'desc' },
    take: limit,
  });

  return entries.map(entry => ({
    handle: entry.handle,
    score: entry.score,
    aiScore: entry.aiScore,
    quizScore: entry.quizScore,
    verdict: entry.verdict,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));
}

// Get leaderboard with pagination
export async function getLeaderboard(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  
  const [entries, total] = await Promise.all([
    prisma.leaderboardEntry.findMany({
      orderBy: { score: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.leaderboardEntry.count(),
  ]);

  return {
    entries: entries.map(entry => ({
      handle: entry.handle,
      score: entry.score,
      aiScore: entry.aiScore,
      quizScore: entry.quizScore,
      verdict: entry.verdict,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Get user rank
export async function getUserRank(handle: string): Promise<number | null> {
  const entry = await prisma.leaderboardEntry.findUnique({
    where: { handle: handle.toLowerCase() },
  });

  if (!entry) return null;

  const rank = await prisma.leaderboardEntry.count({
    where: { score: { gt: entry.score } },
  });

  return rank + 1;
}
