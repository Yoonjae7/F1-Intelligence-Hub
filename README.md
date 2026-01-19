# F1 Intelligence Hub 🏎️

**An AI-powered Formula 1 analytics dashboard** by **Yoonae Lee**

Real-time race intelligence with interactive visualizations and an AI chatbot analyst powered by Groq.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC)](https://tailwindcss.com/)

## ✨ Features

- 🤖 **AI Race Analyst** - Chat with an AI assistant powered by Groq's Llama 3.3
- 📊 **Interactive Charts** - Lap times, standings, gap analysis, and tyre strategies
- 🗺️ **Circuit Visualization** - Real-time animated driver positions on track
- ⚡ **Live Updates** - Real-time session data and statistics
- 🎨 **Modern UI** - Beautiful dark theme optimized for F1 data
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or pnpm
- Free Groq API key (get it at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yoonjae7/F1-Intelligence-Hub.git
   cd F1-Intelligence-Hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```
   
   Get your free API key from [https://console.groq.com](https://console.groq.com)

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

For detailed setup instructions, including how to configure the AI chatbot, see:
- [CHATBOT_SETUP.md](CHATBOT_SETUP.md) - AI chatbot configuration guide
- [PROJECT_INDEX.md](PROJECT_INDEX.md) - Complete project structure and documentation

## 🎯 Key Components

### Dashboard Features
- **Header** - Live session indicator with real-time clock
- **Stat Cards** - Quick access to fastest lap, top speed, track conditions
- **Lap Times Chart** - Interactive line chart with driver toggles
- **Standings Table** - Live race positions with tyre compounds
- **Gap Chart** - Gap to leader visualization
- **Tyre Strategy** - Timeline of compound usage per driver
- **Circuit Visualization** - Animated track with real-time telemetry
- **AI Chat Panel** - Intelligent race analysis assistant

### AI Chatbot
The AI assistant can:
- Analyze lap time trends and consistency
- Compare tyre strategies
- Explain gap evolution between drivers
- Provide pit stop analysis
- Reference specific charts in responses

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom F1 theme
- **UI Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **AI**: Groq API (Llama 3.3)
- **Icons**: Lucide React

## 🎨 Design System

- Custom F1-themed color palette
- OKLCH color space for consistency
- Dark mode optimized
- Responsive breakpoints
- Accessible components

## 📝 Project Structure

```
f1-intelligence-hub/
├── app/                    # Next.js App Router
│   ├── api/chat/          # AI chatbot API route
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/
│   ├── f1/                # F1-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities
├── public/                # Static assets
└── styles/                # Additional styles
```

## 🔒 Security

- `.env.local` is gitignored to protect API keys
- All API calls are server-side
- No sensitive data exposed to client

## 🚧 Future Enhancements

- Real F1 API integration (Ergast, OpenF1)
- WebSocket for live data streaming
- Historical race data analysis
- Multi-race comparison
- User authentication
- Custom dashboard layouts
- Export and share functionality

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Yoonae Lee**

- GitHub: [@Yoonjae7](https://github.com/Yoonjae7)

## 🙏 Acknowledgments

- Groq for providing free AI API access
- shadcn/ui for beautiful React components
- Vercel for Next.js and deployment platform
- F1 community for inspiration

---

**Enjoy analyzing F1 races!** 🏁
