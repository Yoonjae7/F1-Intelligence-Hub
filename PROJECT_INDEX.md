# F1 Intelligence Hub - Project Index

## Project Overview
**F1 Intelligence Hub** is a Next.js 16 application that provides an AI-powered Formula 1 analytics dashboard. It displays real-time race data, visualizations, and includes an AI chat assistant for race strategy analysis.

## Tech Stack
- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.9 with custom F1 theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Project Structure

```
f1-intelligence-hub/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with F1 theme
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main dashboard page
│
├── components/
│   ├── f1/                       # F1-specific components
│   │   ├── ai-chat-panel.tsx     # AI chat interface
│   │   ├── circuit-visualization.tsx  # Live track visualization
│   │   ├── gap-chart.tsx         # Gap to leader chart
│   │   ├── header.tsx            # Top navigation header
│   │   ├── lap-times-chart.tsx   # Lap time evolution chart
│   │   ├── standings-table.tsx   # Live race standings
│   │   ├── stat-cards.tsx        # Quick stats cards
│   │   └── tyre-strategy.tsx     # Tyre compound strategy timeline
│   │
│   ├── ui/                       # shadcn/ui components (50+ components)
│   └── theme-provider.tsx        # Theme context provider
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/
│   └── utils.ts                  # Utility functions (cn helper)
│
├── public/                       # Static assets
│   ├── icon-*.png                # App icons
│   └── placeholder-*.{png,svg,jpg}
│
├── images/                       # Project images
│   └── logov1t.png              # Logo file
│
├── styles/
│   └── globals.css              # Additional global styles
│
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Core Components

### 1. Main Dashboard (`app/page.tsx`)
- Orchestrates all F1 components
- Manages chart highlighting state
- Responsive layout with main content + AI chat sidebar

### 2. F1 Components

#### `header.tsx`
- Displays logo and live session indicator
- Shows current race (Monaco GP) and real-time clock
- Updates time every second

#### `stat-cards.tsx`
- Quick stats: Fastest Lap, Top Speed, Track Temp, Wind Speed
- Grid layout with icons

#### `lap-times-chart.tsx`
- Line chart showing lap time evolution
- Toggleable drivers (VER, HAM, LEC, NOR)
- Uses Recharts LineChart component
- Supports highlighting from AI chat

#### `standings-table.tsx`
- Live race standings table
- Shows position, driver, team, gap, tyre compound
- Position change indicators (up/down arrows)
- Tyre compound color coding

#### `gap-chart.tsx`
- Area chart showing gap to leader over time
- Currently shows HAM vs VER interval
- Displays current gap value

#### `tyre-strategy.tsx`
- Horizontal timeline visualization
- Shows tyre compound usage per driver
- Color-coded by compound (soft/medium/hard)
- Current lap indicator

#### `circuit-visualization.tsx`
- Animated SVG track visualization
- Real-time driver positions on Monaco circuit
- Clickable drivers for telemetry panel
- Shows speed, position, and lap time
- Sector markers (S1, S2, S3)

#### `ai-chat-panel.tsx`
- Chat interface with AI assistant
- Pre-populated demo messages
- Can highlight charts via `chartRef`
- Simple keyword-based responses (demo mode)
- Auto-scrolling message list

## Styling & Theme

### Color System (`app/globals.css`)
- **Base**: Dark theme with warm accents
- **F1 Colors**:
  - `--f1-soft`: Red (soft tyres)
  - `--f1-medium`: Yellow (medium tyres)
  - `--f1-hard`: White (hard tyres)
  - `--f1-cyan`: Cyan accent
  - `--f1-green`: Green accent
- **Chart Colors**: 5 distinct chart color variables
- Uses OKLCH color space for better color consistency

### Design System
- shadcn/ui components with "new-york" style
- Custom F1-themed color palette
- Responsive design (mobile-first)
- Dark mode optimized

## Data & State Management

### Current Implementation
- **Static Data**: All components use hardcoded demo data
- **State**: React `useState` for local component state
- **No API**: No backend or data fetching currently

### Demo Data Includes
- Lap times for 4 drivers (12 laps)
- Race standings (8 drivers)
- Gap data (10 data points)
- Tyre strategies (4 drivers)
- Circuit positions (6 drivers with speeds)

## Key Features

1. **Real-time Visualization**
   - Animated circuit track
   - Live standings updates
   - Chart highlighting from AI chat

2. **Interactive Charts**
   - Toggleable driver data
   - Responsive design
   - Custom tooltips

3. **AI Chat Integration**
   - Chart reference system
   - Keyword-based responses
   - Auto-highlighting of referenced charts

4. **Responsive Layout**
   - Mobile-friendly
   - Sidebar collapses on mobile
   - Grid layouts adapt to screen size

## Configuration Files

### `next.config.mjs`
- TypeScript build errors ignored
- Images unoptimized

### `components.json`
- shadcn/ui configuration
- Path aliases: `@/components`, `@/lib`, `@/hooks`
- Style: "new-york"
- RSC enabled

### `tsconfig.json`
- Path alias: `@/*` → `./*`
- Strict mode enabled
- ES6 target
- Next.js plugin

## Dependencies Highlights

### UI & Styling
- `@radix-ui/*`: 30+ UI primitives
- `tailwindcss`: Utility-first CSS
- `lucide-react`: Icon library
- `class-variance-authority`: Component variants

### Charts & Data
- `recharts`: Charting library
- `date-fns`: Date utilities

### Forms & Validation
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `@hookform/resolvers`: Form validation

### Other
- `next-themes`: Theme management
- `sonner`: Toast notifications
- `@vercel/analytics`: Analytics

## Development Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Current Limitations

1. **No Real Data**: All data is static/demo
2. **No Backend**: No API integration
3. **Simple AI**: Chat uses keyword matching, not real AI
4. **No Authentication**: No user system
5. **No Data Persistence**: No database

## Future Enhancement Opportunities

1. Integrate F1 API (e.g., Ergast API, F1 official API)
2. Real-time WebSocket connections for live data
3. AI integration (OpenAI, Anthropic, etc.)
4. User authentication and preferences
5. Historical race data
6. More detailed telemetry
7. Multi-race support
8. Export/share functionality

## Notes

- Logo path: `/images/logov1t.png` (referenced in header)
- All components are client-side (`"use client"`)
- Uses Next.js App Router architecture
- TypeScript strict mode enabled
- Custom F1 color scheme throughout
