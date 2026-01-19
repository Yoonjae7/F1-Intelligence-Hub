# F1 Intelligence Hub 🏎️

**An AI-powered Formula 1 analytics dashboard** by **Yoonae Lee**

Explore real F1 race data with interactive visualizations and an intelligent AI analyst that understands exactly what you're looking at.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

## 🏁 Live Demo

**[View Live Dashboard →](https://f1-intelligence-hub.vercel.app)**

## ✨ Features

### 📊 Real Race Data
- **Historical Data**: Currently featuring the **2024 Abu Dhabi Grand Prix** (Season Finale)
- **Accurate Results**: Real race classification, lap times, and gaps
- **Live Data Ready**: Connects to OpenF1 API during live F1 sessions

### 🤖 Intelligent AI Analyst
- Powered by **Groq's Llama 3.3** (70B model)
- **Knows Your Dashboard**: AI receives actual race data with every message
- **Accurate Answers**: Ask about positions, gaps, strategies - gets it right
- **Chart References**: AI can point you to relevant visualizations

### 📈 Interactive Visualizations
| Component | Description |
|-----------|-------------|
| **Lap Times Chart** | Interactive line chart with driver toggles, 19 distinct colors |
| **Standings Table** | Race positions with gaps and tyre indicators |
| **Gap Chart** | Time gap evolution between drivers |
| **Tyre Strategy** | Visual timeline of compound usage |
| **Track Position** | Animated driver positions with sector tracking |
| **Weather Stats** | Air temp, track temp, humidity, wind |

### 🎨 Modern Design
- **F1-Themed Dark UI**: Professional, race-inspired aesthetic
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Beautiful Loading Screen**: 7-second branded intro with F1 starting lights animation
- **Mobile Chat**: Full-screen AI chat panel on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Free Groq API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Yoonjae7/F1-Intelligence-Hub.git
cd F1-Intelligence-Hub/f1-intelligence-hub

# Install dependencies
pnpm install

# Set up environment variables
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Get Your Free API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Create a new API key
4. Add it to `.env.local`

### Deploying to Vercel
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` in Settings → Environment Variables
4. Deploy!

## 📊 Current Data: 2024 Abu Dhabi GP

The dashboard displays real data from the 2024 Season Finale:

| Pos | Driver | Team | Gap |
|-----|--------|------|-----|
| 🥇 1 | Lando Norris | McLaren | LEADER |
| 🥈 2 | Carlos Sainz | Ferrari | +5.832s |
| 🥉 3 | Charles Leclerc | Ferrari | +31.928s |
| 4 | Lewis Hamilton | Mercedes | +36.483s |
| 5 | George Russell | Mercedes | +37.538s |
| 6 | Max Verstappen | Red Bull | +49.847s |

**Key Facts:**
- 🏆 Constructors Champion: McLaren
- 🏆 Drivers Champion: Max Verstappen (4th title)
- ⚡ Fastest Lap: Oscar Piastri - 1:26.234
- 📍 Circuit: Yas Marina, Abu Dhabi
- 🔄 Total Laps: 58

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix UI) |
| Charts | Recharts |
| AI | Groq API (Llama 3.3 70B) |
| Icons | Lucide React |
| Data | OpenF1 API + Historical Data |
| Deployment | Vercel |

## 📁 Project Structure

```
f1-intelligence-hub/
├── app/
│   ├── api/
│   │   ├── chat/           # AI chatbot with dashboard context
│   │   └── f1-data/        # OpenF1 API proxy
│   ├── globals.css         # Global styles + animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard
├── components/
│   ├── f1/
│   │   ├── ai-chat-panel.tsx
│   │   ├── circuit-visualization.tsx
│   │   ├── gap-chart.tsx
│   │   ├── header.tsx
│   │   ├── lap-times-chart.tsx
│   │   ├── loading-screen.tsx
│   │   ├── standings-table.tsx
│   │   ├── stat-cards.tsx
│   │   └── tyre-strategy.tsx
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-f1-data.ts      # F1 data fetching hook
├── lib/
│   ├── demo-data.ts        # 2024 Abu Dhabi GP data
│   ├── f1-data-service.ts  # OpenF1 API service
│   └── utils.ts            # Utilities
└── public/
    └── images/             # Logo and assets
```

## 🔮 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    F1 Intelligence Hub                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐     ┌──────────────┐     ┌────────────┐  │
│   │  OpenF1 API  │────▶│  /api/f1-data │────▶│ useF1Data  │  │
│   │  (Live Data) │     │   (Backend)   │     │   (Hook)   │  │
│   └──────────────┘     └──────────────┘     └─────┬──────┘  │
│                                                    │         │
│   ┌──────────────┐                                ▼         │
│   │  demo-data   │──────────────────────▶ Dashboard Data    │
│   │ (Historical) │                              │           │
│   └──────────────┘                              │           │
│                                                 ▼           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  All Visualizations                  │   │
│   │  (Charts, Tables, Track, Stats - all consistent)    │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    AI Chat Panel                     │   │
│   │    (Receives full dashboard data with each query)   │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│   ┌──────────────┐     ┌──────────────┐                     │
│   │  /api/chat   │────▶│   Groq API   │                     │
│   │ (w/ context) │     │ (Llama 3.3)  │                     │
│   └──────────────┘     └──────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security

- API keys stored in environment variables
- Server-side API calls only
- `.env.local` gitignored
- No sensitive data exposed to client

## 🚧 Future Roadmap

- [ ] Multiple historical races to browse
- [ ] Live timing during race weekends
- [ ] Driver/team comparison tools
- [ ] Qualifying session data
- [ ] Race prediction AI
- [ ] Export race reports

## 👤 Author

**Yoonae Lee**
- GitHub: [@Yoonjae7](https://github.com/Yoonjae7)

## 🙏 Acknowledgments

- **Groq** - Free, fast AI API
- **OpenF1** - Open source F1 data API
- **shadcn/ui** - Beautiful React components
- **Vercel** - Seamless deployment
- **Formula 1** - The greatest sport on Earth

## 📄 License

This project is open source under the MIT License.

---

**Built with ❤️ for F1 fans everywhere** 🏁
