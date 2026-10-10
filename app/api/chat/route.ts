import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'anthropic/claude-3.5-sonnet', agentRole = 'AliDai Universal Jarvis' } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API Key təyin edilməyib.' }, { status: 500 });
    }

    const systemPrompt = `Sən AliDai-sən. Ağdaş şəhərində yerləşən, e-kommersiya (prisonshop.az), musiqi istehsalı (DJ Maga) və yerli layihələri idarə edən futuristik və son dərəcə ağıllı AI assistentisən. 
Cari Agent Rejimi / Rolu: ${agentRole}. 
Həmişə Azərbaycan dilində səlis, dəqiq, texniki cəhətdən mükəmməl və işgüzar tərzdə cavab ver. İstifadəçinin ehtiyaclarına uyğun dərindən təhlil apar.`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
