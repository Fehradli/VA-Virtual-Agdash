import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'openai/gpt-4o' } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key təyin edilməyib.' }, { status: 500 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://va-virtual-agdash.vercel.app',
        'X-Title': 'AliDai VA',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'Sən AliDai-sən. Ağdaş şəhərində layihələri və e-kommersiyanı idarə edən futuristik Jarvis AI assistentisən.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
