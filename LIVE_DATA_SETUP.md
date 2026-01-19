# Live F1 Data Integration 🏁

Your F1 Intelligence Hub now supports **100% FREE live F1 data** using the OpenF1 API!

## Features

✅ **Completely Free** - No API keys, no costs, no limits  
✅ **Real-time Updates** - Data refreshes every 10 seconds during live sessions  
✅ **Automatic Fallback** - Shows demo data when no live session is running  
✅ **Zero Configuration** - Works out of the box, no setup needed  

## How It Works

### OpenF1 API
The app uses the [OpenF1 API](https://openf1.org/) which provides:
- Live timing data during F1 race weekends
- Driver positions and lap times
- Telemetry and car data
- Weather information
- Race control messages
- Historical session data

### Data Flow

```
OpenF1 API → Backend Service → React Hook → Components → Live Dashboard
```

1. **Backend Service** (`lib/f1-data-service.ts`) - Fetches data from OpenF1 API
2. **API Route** (`app/api/f1-data/route.ts`) - Serves processed data to frontend
3. **React Hook** (`hooks/use-f1-data.ts`) - Manages data fetching and auto-refresh
4. **Components** - Display live data with automatic updates

### Live Detection

The app automatically detects:
- ✅ **LIVE** - When an F1 session is currently running
- 🔵 **Demo Mode** - When no live session is available (shows realistic demo data)
- ⏳ **Connecting** - While loading data

## What Data Is Live

When a live F1 session is running, you'll see:

| Component | Live Data |
|-----------|-----------|
| **Header** | Session name, location, live indicator |
| **Stat Cards** | Weather conditions (temp, wind, humidity) |
| **Standings Table** | Real-time positions, gaps, intervals |
| **Lap Times Chart** | Actual lap times for all drivers |
| **Gap Chart** | Gap to leader over time |
| **Circuit Visualization** | Driver positions on track |
| **AI Chat** | Can reference actual session data |

## Data Refresh

- **Auto-refresh**: Every 10 seconds during live sessions
- **Manual refresh**: Page reload
- **Caching**: 5-second cache to reduce API calls
- **Efficient**: Only fetches what's needed

## Free Forever?

**YES!** OpenF1 API is:
- Community-driven open-source project
- No authentication required
- No rate limits for reasonable use
- No hidden costs

## When Are Sessions Live?

F1 sessions are typically:
- **Practice**: Friday mornings/afternoons
- **Qualifying**: Saturday afternoon
- **Sprint** (some races): Saturday
- **Race**: Sunday afternoon

Check the [F1 Calendar](https://www.formula1.com/en/racing/2024.html) for exact times.

## Testing Live Data

### During a Live Session
1. Start your dev server: `pnpm dev`
2. Visit http://localhost:3001
3. Header shows 🔴 **LIVE** indicator
4. Data updates automatically

### Without a Live Session
1. App shows 🔵 **Demo Mode**
2. Displays realistic demo data
3. Everything works the same way
4. Great for development and demos

## Advanced Usage

### Customize Refresh Interval

Edit `app/page.tsx`:

```typescript
const { data, isLive } = useF1Data({ 
  refreshInterval: 5000  // 5 seconds (faster)
});
```

### Fetch Specific Data

```typescript
import { useF1DataType } from '@/hooks/use-f1-data';

// Only fetch positions
const { data } = useF1DataType('positions');
```

### Manual Data Fetch

```typescript
const { data, refetch } = useF1Data();

// Force refresh
refetch();
```

## API Endpoints

Your backend exposes:

```
GET /api/f1-data?type=all       - All data (default)
GET /api/f1-data?type=positions - Driver positions only
GET /api/f1-data?type=laps      - Lap times only
GET /api/f1-data?type=intervals - Gaps/intervals only
```

## Data Structure

```typescript
{
  live: boolean,
  session: {
    name: string,         // "Race", "Qualifying", etc.
    location: string,     // "Monaco", "Silverstone", etc.
    country: string,
    circuit: string,
    date: string,
    type: string
  },
  drivers: [{
    number: number,
    code: string,         // "VER", "HAM", etc.
    name: string,
    team: string,
    color: string,
    position: number,
    gap: string,
    intervalToNext: number
  }],
  lapTimes: [{
    lap: number,
    VER: number,          // Lap time in seconds
    HAM: number,
    // ... other drivers
  }],
  weather: {
    airTemp: number,
    trackTemp: number,
    humidity: number,
    pressure: number,
    rainfall: boolean,
    windSpeed: number,
    windDirection: number
  }
}
```

## Troubleshooting

### No Live Data During Race Weekend

1. Check if session has started (check F1 calendar)
2. OpenF1 API might have slight delays (wait 1-2 minutes)
3. Check browser console for errors
4. App will show demo data as fallback

### Slow Data Updates

- Normal: Data refreshes every 10 seconds
- Reduce refresh interval in code if needed
- OpenF1 API updates every few seconds during live sessions

### API Errors

The app gracefully handles:
- ✅ Network errors → Shows demo data
- ✅ No session data → Shows demo data
- ✅ Invalid responses → Falls back safely

## Costs

| Item | Cost |
|------|------|
| OpenF1 API | $0.00 |
| Hosting (Vercel Free) | $0.00 |
| Total | **$0.00** |

Your dashboard runs **completely free** with no hidden costs!

## Future Enhancements

Potential additions:
- Historical race analysis
- Session comparison
- Driver performance tracking
- Pit stop predictions
- Race strategy analysis
- Push notifications for live sessions

## Resources

- 📚 [OpenF1 Documentation](https://openf1.org/)
- 🏎️ [F1 Calendar](https://www.formula1.com/en/racing/2024.html)
- 🚀 [Next.js Docs](https://nextjs.org/docs)

---

**Enjoy your live F1 data!** 🏁
