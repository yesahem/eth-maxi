import { NextResponse } from "next/server";
import { addToLeaderboard } from "@/lib/leaderboard";

export async function POST(req: Request) {
  try {
    const { handle, score, aiScore, quizScore, verdict } = await req.json();

    if (!handle || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`💾 Saving to leaderboard: @${handle} - Score: ${score}`);

    await addToLeaderboard({
      handle,
      score,
      aiScore: aiScore || 0,
      quizScore: quizScore || 0,
      verdict: verdict || ""
    });

    console.log(`✅ Successfully saved @${handle} to leaderboard`);

    return NextResponse.json({ success: true, message: "Score saved to leaderboard" });
  } catch (error) {
    console.error("❌ Error saving to leaderboard:", error);
    return NextResponse.json({ 
      error: "Failed to save score", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
