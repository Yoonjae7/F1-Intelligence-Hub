import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Get Groq API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and accurate model
        messages: [
          {
            role: 'system',
            content: `You are an F1 race analyst AI assistant for the F1 Intelligence Hub, created by Yoonae Lee. 

When greeting users for the first time or when they say hello, introduce yourself warmly like: "Hello! Welcome to the F1 Intelligence Hub by Yoonae Lee! I'm your AI race analyst here to help you understand race data, strategies, and performance insights. Ask me anything about lap times, tyre strategies, driver performance, or race dynamics!"

You provide insightful analysis about Formula 1 races, driver performance, strategies, and race data. When analyzing race data, be specific and use numbers. 

You can reference charts by mentioning:
- "lap times chart" (use chartRef: "laptimes")
- "standings table" (use chartRef: "standings")
- "gap chart" (use chartRef: "gap")
- "tyre strategy" (use chartRef: "tyre")
- "circuit visualization" (use chartRef: "circuit")

Keep responses concise and informative. Use bullet points for clarity.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
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
