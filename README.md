# ETH Maxi Checker ❤️‍🔥

> **Are you a true Ethereum Maxi?** Find out with AI-powered analysis of your Twitter activity!

Built for **ETHMumbai 2025** - A fun, interactive way to measure your Ethereum enthusiasm and compete on the leaderboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Twitter Scraping**: Automatically scrapes your recent tweets using Puppeteer
- **Gemini AI**: Analyzes your tweets for Ethereum enthusiasm, technical depth, and community involvement
- **Smart Scoring**: Combines AI analysis with quiz results for a comprehensive Maxi Score (0-100)

### 📊 Interactive Quiz
- 10 questions about Ethereum culture and technical knowledge
- Real-time scoring with witty feedback
- Contributes to your final Maxi Score

### 🏆 Global Leaderboard
- PostgreSQL database with Prisma ORM
- Real-time rankings of top Ethereum Maxis
- Unique handles with automatic score updates
- Rank badges (🏆 Gold, 🥈 Silver, 🥉 Bronze)

### 🎨 Beautiful UI
- Dark mode with glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design (mobile & desktop)
- Downloadable Maxi Card with your score

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Vercel Postgres, Supabase, or local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/eth-maxi.git
   cd eth-maxi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   ```

   Add your credentials to `.env`:
   ```env
   # Gemini AI (required)
   GEMINI_API_KEY=your_gemini_api_key

   # Database (required)
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma Client
   bunx prisma generate

   # Run migrations
   bunx prisma migrate dev --name init
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Puppeteer** - Web scraping
- **@sparticuz/chromium-min** - Headless Chrome for serverless
- **Gemini AI** - Tweet analysis
- **Prisma** - Database ORM
- **PostgreSQL** - Database

---

## 📁 Project Structure

```
eth-maxi/
├── app/
│   ├── api/
│   │   ├── analyze/          # Twitter scraping & AI analysis
│   │   └── leaderboard/      # Leaderboard endpoints
│   ├── page.tsx              # Main app page
│   └── layout.tsx            # Root layout
├── components/
│   ├── Background.tsx        # Animated background
│   ├── Quiz.tsx              # Quiz component
│   ├── MaxiCard.tsx          # Score card component
│   └── Leaderboard.tsx       # Leaderboard sidebar
├── lib/
│   ├── prisma.ts             # Prisma client
│   └── leaderboard.ts        # Leaderboard functions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

---

## 🎯 How It Works

### 1. User Input
User enters their Twitter/X handle

### 2. AI Analysis (Background)
- Launches headless browser (Brave/Chrome)
- Navigates to user's Twitter profile
- Auto-scrolls to load 6-18 tweets
- Extracts tweet text and engagement stats
- Sends to Gemini AI for analysis

### 3. Quiz
User answers 10 Ethereum-related questions while AI analyzes in background

### 4. Scoring
```
AI Score (0-100):
  - Ethereum Enthusiasm (30 pts)
  - Technical Depth (25 pts)
  - Community Involvement (25 pts)
  - Cultural Alignment (20 pts)

Quiz Score (0-100):
  - 10 questions × 10 points each

Final Score = (AI Score + Quiz Score) / 2
```

### 5. Results
- Generates personalized Maxi Card
- Saves to leaderboard
- Shows global ranking

---

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)
```bash
# 1. Create database at vercel.com/storage
# 2. Copy DATABASE_URL
# 3. Add to .env
# 4. Run migrations
bunx prisma migrate dev --name init
```

### Option 2: Supabase
```bash
# 1. Create project at supabase.com
# 2. Get connection string from Settings → Database
# 3. Add to .env
# 4. Run migrations
bunx prisma migrate dev --name init
```

### Option 3: Local PostgreSQL
```bash
# Install Postgres
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb eth_maxi

# Add to .env
DATABASE_URL="postgresql://localhost:5432/eth_maxi"

# Run migrations
bunx prisma migrate dev --name init
```

---

## 🔑 API Keys

### Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

---

## 📊 API Endpoints

### POST `/api/analyze`
Analyzes a Twitter profile and returns Maxi score

**Request:**
```json
{
  "handle": "vitalikbuterin"
}
```

**Response:**
```json
{
  "aiScore": 88,
  "aiVerdict": "From debunking merge FUD to calculating...",
  "handle": "vitalikbuterin",
  "tweetCount": 6
}
```

### GET `/api/leaderboard?limit=10`
Gets top N scores from leaderboard

**Response:**
```json
{
  "leaderboard": [
    {
      "handle": "vitalikbuterin",
      "score": 88,
      "aiScore": 90,
      "quizScore": 86,
      "verdict": "...",
      "createdAt": "2025-01-27T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/leaderboard/save`
Saves a score to the leaderboard

**Request:**
```json
{
  "handle": "vitalikbuterin",
  "score": 88,
  "aiScore": 90,
  "quizScore": 86,
  "verdict": "..."
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables:
     - `GEMINI_API_KEY`
     - `DATABASE_URL`

3. **Deploy!**

The app will automatically:
- Install dependencies
- Generate Prisma Client
- Build the Next.js app
- Deploy to production

---

## 🧪 Development

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
bunx prisma studio      # Open database GUI
bunx prisma generate    # Generate Prisma Client
bunx prisma migrate dev # Create migration
bunx prisma db push     # Push schema (dev only)

# Linting
npm run lint            # Run ESLint
```

---

## 🎨 Customization

### Update Quiz Questions
Edit `components/Quiz.tsx` - modify the `questions` array

### Adjust AI Scoring Criteria
Edit `app/api/analyze/route.ts` - modify the Gemini prompt

### Change Leaderboard Size
Edit `components/Leaderboard.tsx` - change `limit` parameter

### Modify Scraping Behavior
Edit `app/api/analyze/route.ts` - adjust scroll attempts and delays

---

## 🐛 Troubleshooting

### Scraping Issues
- **Login Wall**: X.com may show login walls for unauthenticated users (limits to 6-18 tweets)
- **Rate Limiting**: Too many requests may trigger rate limits
- **Browser Path**: Update Chrome/Brave path in `route.ts` if needed

### Database Issues
- **Connection Error**: Verify `DATABASE_URL` is correct
- **Migration Failed**: Run `bunx prisma migrate reset` (WARNING: deletes data)
- **Type Errors**: Run `bunx prisma generate` to regenerate client

### AI Analysis Issues
- **Invalid API Key**: Check `GEMINI_API_KEY` in `.env`
- **Model Not Found**: Ensure using `gemini-2.5-flash` model
- **Timeout**: Increase timeout in `route.ts`

---

## 📄 License

MIT License - feel free to use this project for your own events!

---

## 🙏 Acknowledgments

- Built for **ETHMumbai 2025**
- Powered by **Gemini AI**
- Inspired by the Ethereum community

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Tag [@shishucodes](https://twitter.com/shishucodes) on Twitter

---

**Made with ❤️‍🔥 for the Ethereum community**
