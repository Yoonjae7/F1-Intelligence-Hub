import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, dashboardData } = await request.json();

    // Get Groq API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    // Build context about the dashboard data
    let dataContext = '';
    if (dashboardData) {
      const { session, drivers, weather, isLive, raceSummary } = dashboardData;
      
      dataContext = `
CURRENT DASHBOARD DATA:
${isLive ? '🔴 LIVE SESSION' : '📊 HISTORICAL DATA'}

Race: ${session?.year || 2024} ${session?.location || ''} ${session?.name || 'Grand Prix'}
Circuit: ${session?.circuit || 'Unknown'}
Date: ${session?.date || 'Unknown'}
Laps: ${session?.laps || 58}

RACE RESULTS (Current Standings):
${drivers?.slice(0, 8).map((d: any) => 
  `P${d.position}: ${d.name} (${d.team}) - ${d.gap}${d.fastestLap ? ` | Fastest: ${d.fastestLap}` : ''}`
).join('\n') || 'No driver data available'}

WEATHER CONDITIONS:
- Air Temperature: ${weather?.airTemp || 'N/A'}°C
- Track Temperature: ${weather?.trackTemp || 'N/A'}°C  
- Humidity: ${weather?.humidity || 'N/A'}%
- Wind Speed: ${weather?.windSpeed || 'N/A'} km/h
- Conditions: ${weather?.rainfall ? 'Wet' : 'Dry'}

${raceSummary ? `
RACE SUMMARY:
- Winner: ${raceSummary.winner} (${raceSummary.winningTeam})
- Fastest Lap: ${raceSummary.fastestLap?.driver} - ${raceSummary.fastestLap?.time} (Lap ${raceSummary.fastestLap?.lap})
- Pole Position: ${raceSummary.polePosition}
- Drivers Champion: ${raceSummary.driversChampion}
- Constructors Champion: ${raceSummary.constructorsChampion}

KEY EVENTS:
${raceSummary.keyEvents?.map((e: string) => `• ${e}`).join('\n') || 'None'}
` : ''}

IMPORTANT: Use ONLY the data above when answering questions about positions, lap times, gaps, weather, or race results. Do NOT make up any data. If asked about something not in the data, say you don't have that specific information.
`;
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an F1 race analyst AI assistant for the F1 Intelligence Hub, created by Yoonae Lee. 

When greeting users for the first time or when they say hello, introduce yourself warmly and mention that you're analyzing the ${dashboardData?.session?.year || 2024} ${dashboardData?.session?.location || ''} Grand Prix data.

${dataContext}

You provide accurate, data-driven analysis about Formula 1 races. ALWAYS refer to the actual dashboard data provided above - never make up statistics or results.

You can reference charts by mentioning:
- "lap times chart" (chartRef: "laptimes") - shows lap-by-lap performance
- "standings table" (chartRef: "standings") - shows race positions
- "gap chart" (chartRef: "gap") - shows time gaps between drivers
- "tyre strategy" (chartRef: "tyre") - shows compound usage
- "circuit visualization" (chartRef: "circuit") - shows track positions

Keep responses concise, accurate, and based ONLY on the provided data. Use bullet points for clarity.`
          },
          ...messages
        ],
        temperature: 0.5, // Lower temperature for more accurate/consistent responses
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Detect chart references in the response
    let chartRef = undefined;
    if (aiMessage.toLowerCase().includes('lap times chart') || aiMessage.toLowerCase().includes('lap time')) {
      chartRef = 'laptimes';
    } else if (aiMessage.toLowerCase().includes('standings')) {
      chartRef = 'standings';
    } else if (aiMessage.toLowerCase().includes('gap chart') || aiMessage.toLowerCase().includes('gap to leader')) {
      chartRef = 'gap';
    } else if (aiMessage.toLowerCase().includes('tyre strategy') || aiMessage.toLowerCase().includes('tyre compound')) {
      chartRef = 'tyre';
    } else if (aiMessage.toLowerCase().includes('circuit') || aiMessage.toLowerCase().includes('track')) {
      chartRef = 'circuit';
    }

    return NextResponse.json({
      message: aiMessage,
      chartRef,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
