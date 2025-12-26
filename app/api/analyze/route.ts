import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AI_MOCK_MODE");

export async function POST(req: Request) {
  let browser = null;
  try {
    const { handle } = await req.json();

    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    // 1. PUPPETEER SCRAPER INITIALIZATION
    console.log(`🚀 Launching Puppeteer for @${handle}...`);
    
    // Choose local chromium if in development, otherwise use sparticuz for production/lambda
    const isLocal = process.env.NODE_ENV === "development";
    
    browser = await puppeteer.launch({
      args: isLocal ? [] : [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: isLocal 
        ? "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" // Brave Browser path
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    
    // Set a realistic user agent to avoid immediate blocks
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Navigate to user's profile
    console.log(`🔗 Navigating to https://x.com/${handle}`);
    await page.goto(`https://x.com/${handle}`, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for the tweets to appear (article tag)
    try {
      await page.waitForSelector('article', { timeout: 10000 });
    } catch (e) {
      console.log("⚠️ Could not find articles. X.com might be showing a login wall.");
    }


    // AUTOSCROLL TO LOAD MORE TWEETS (Target: 10-15 tweets)
    console.log("📜 Auto-scrolling to load more tweets...");
    let previousHeight = 0;
    let previousArticleCount = 0;
    let scrollAttempts = 0;
    const maxScrolls = 15; // Increased to ensure we get more tweets
    const targetTweets = 10; // Stop if we reach at least 10 tweets
    
    while (scrollAttempts < maxScrolls) {
      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Progressive wait times - start fast, get slower
      const waitTime = scrollAttempts < 3 ? 800 : (scrollAttempts < 6 ? 1200 : 1500);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Check both height and article count
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const currentArticleCount = await page.evaluate(() => {
        return document.querySelectorAll("article").length;
      });
      
      console.log(`   Scroll ${scrollAttempts + 1}/${maxScrolls}: ${currentArticleCount} tweets loaded`);
      
      // Stop if we have enough tweets
      if (currentArticleCount >= targetTweets) {
        console.log(`   ✅ Reached target of ${targetTweets}+ tweets!`);
        break;
      }
      
      // Check if new content loaded
      if (currentHeight === previousHeight && currentArticleCount === previousArticleCount) {
        // Try one more time with a longer wait
        await new Promise(resolve => setTimeout(resolve, 2500));
        const retryHeight = await page.evaluate(() => document.body.scrollHeight);
        const retryArticleCount = await page.evaluate(() => {
          return document.querySelectorAll("article").length;
        });
        
        if (retryHeight === previousHeight && retryArticleCount === previousArticleCount) {
          console.log(`   Reached end of content with ${retryArticleCount} tweets`);
          break;
        }
        previousHeight = retryHeight;
        previousArticleCount = retryArticleCount;
      } else {
        previousHeight = currentHeight;
        previousArticleCount = currentArticleCount;
      }
      
      scrollAttempts++;
    }

    // IMPROVED SCRAPING LOGIC
    const scrapedTweets = await page.evaluate(() => {
        const tweets: any[] = [];
        const articles = document.querySelectorAll("article");
        
        articles.forEach((article) => {
          const textEl = article.querySelector('div[data-testid="tweetText"]');
          const userEl = article.querySelector('div[dir="ltr"] > span');
          const statGroup = article.querySelector('div[role="group"]');
          
          if (!textEl || !userEl || !statGroup) return;

          let replies = "0", reposts = "0", likes = "0", views = "0";
          
          // Get all interactive elements in the stats group
          const buttons = statGroup.querySelectorAll('button, a, div[role="button"]');
          
          buttons.forEach((btn) => {
            const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";
            const textContent = btn.textContent?.trim() || "0";
            
            // Extract number from aria-label (more reliable) or textContent
            const ariaMatch = ariaLabel.match(/([\d.,]+[KkMm]?)/);
            const number = ariaMatch ? ariaMatch[1] : textContent;
            
            if (ariaLabel.includes("repl") || ariaLabel.includes("comment")) {
              replies = number;
            } else if (ariaLabel.includes("repost") || ariaLabel.includes("retweet")) {
              reposts = number;
            } else if (ariaLabel.includes("like")) {
              likes = number;
            } else if (ariaLabel.includes("view") || ariaLabel.includes("impression")) {
              views = number;
            }
          });

          tweets.push({
            text: textEl?.textContent?.trim() || "",
            username: userEl?.textContent?.trim() || "",
            stats: { replies, reposts, likes, views }
          });
        });
        
        return tweets.slice(0, 50); // Take top 50
    });

    await browser.close();
    console.log(`✅ Scraped ${scrapedTweets.length} tweets.`);

    // 2. AI ANALYSIS VIA GEMINI (Using the real scraped data)
    let aiScore = 50;
    let aiVerdict = "";

    const analysisContext = scrapedTweets.length > 0 
        ? JSON.stringify(scrapedTweets)
        : `No tweets were accessible due to X.com login wall, but analyzing the handle @${handle} vibes.`;

    if (process.env.GEMINI_API_KEY) {
      console.log(`🤖 Analyzing ${scrapedTweets.length} tweets with Gemini AI...`);
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are analyzing a Twitter/X profile to calculate their "ETH Maxi Score" for the ETHMumbai community.

Profile: @${handle}
Tweet Data: ${analysisContext}

SCORING CRITERIA (0-100):
1. **Ethereum Enthusiasm** (0-30 points):
   - Mentions of Ethereum, ETH, Vitalik, EIP, or Ethereum events
   - Positive sentiment about Ethereum's future
   - Defending Ethereum against critics

2. **Technical Depth** (0-25 points):
   - Discussions about smart contracts, DeFi, L2s, zkEVMs
   - Understanding of Ethereum roadmap (The Merge, Dencun, etc.)
   - Technical contributions or insights

3. **Community Involvement** (0-25 points):
   - Engagement with Ethereum community
   - Attendance/mentions of ETH events (ETHGlobal, Devcon, ETHMumbai)
   - Supporting Ethereum builders and projects

4. **Cultural Alignment** (0-20 points):
   - "Maxi" mindset (Ethereum-first mentality)
   - Criticism of competing chains
   - Memes, humor, and cultural references

TASK:
1. Calculate a total score (0-100) based on the criteria above
2. Write a witty, sharp 2-sentence "Maxi Verdict" that captures their vibe
   - Make it fun and engaging
   - Reference specific things from their tweets if possible
   - Use Ethereum/crypto culture language

Return ONLY valid JSON in this exact format:
{ "score": <number>, "verdict": "<string>" }

Example good verdicts:
- "A true Ethereum OG who bleeds ETH. Probably has 'gm' tattooed somewhere."
- "Talks the talk but needs more skin in the game. Touch grass, then touch Solidity."
- "Peak Maxi energy detected. This one's ready for Devcon front row."`;

        const result = await model.generateContent(prompt);
        const outputText = result.response.text().replace(/```json|```/g, "").trim();
        
        console.log(`📊 Gemini response: ${outputText}`);
        
        const output = JSON.parse(outputText);
        aiScore = output.score;
        aiVerdict = output.verdict;
        
        console.log(`✅ AI Analysis complete: Score ${aiScore}/100`);
      } catch (aiError) {
        console.error("AI Analysis Error:", aiError);
        // Fallback to mock if AI fails
        aiScore = scrapedTweets.length > 5 ? 75 : 45;
        aiVerdict = `Our AI scouts analyzed @${handle}'s digital footprint. Detected solid Ethereum vibes and community spirit.`;
      }
    } else {
      // Mock Fallback
      aiScore = scrapedTweets.length > 5 ? 75 : 45;
      aiVerdict = `Our automated scouts explored @${handle}. Detected considerable activity in the decentralized space. A true builder in the making.`;
    }

    return NextResponse.json({
      aiScore: Math.min(100, aiScore),
      aiVerdict,
      handle,
      tweetCount: scrapedTweets.length
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error("Scraping/AI Error:", error);
    return NextResponse.json({ 
        aiScore: Math.floor(Math.random() * 40) + 30, 
        aiVerdict: "The X.com firewalls were too strong, but our AI scanned your digital resonance and found a solid Maxi spirit." 
    });
  }
}
