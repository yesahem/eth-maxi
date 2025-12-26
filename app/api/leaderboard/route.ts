import { NextResponse } from "next/server";
import { getTopScores } from "@/lib/leaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log(`📊 Fetching top ${limit} scores from leaderboard...`);

    const topScores = await getTopScores(limit);

    console.log(`✅ Retrieved ${topScores.length} entries from leaderboard`);

    return NextResponse.json({ leaderboard: topScores });
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return NextResponse.json({ 
      error: "Failed to fetch leaderboard",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
