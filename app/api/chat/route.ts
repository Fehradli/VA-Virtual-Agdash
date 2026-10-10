import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { prompt, model = 'anthropic/claude-3.5-sonnet', agentName = 'Jarvis' } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API Key tapılmadı.' }, { status: 500 });
    }

    // Agent faylını .claude/agents/ qovluğundan oxumağa çalışırıq
    let agentSystemPrompt = `Sən AliDai-sən. Ağdaş şəhərində yerləşən, texnologiya, e-kommersiya və musiqi layihələrini idarə edən futuristik AI assistentisən. Həmişə Azərbaycan dilində cavab ver.`;
    
    try {
      const agentsDir = path.join(process.cwd(), '.claude', 'agents');
      const files = fs.readdirSync(agentsDir);
      // Uyğun agent faylını tapırıq
      const matchedFile = files.find(f => f.toLowerCase().includes(agentName.toLowerCase().replace(/\s+/g, '-')));
      if (matchedFile) {
        const filePath = path.join(agentsDir, matchedFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        agentSystemPrompt = `Sən aşağıdakı xüsusi agent rolundasan və bu təlimatlara tam əməl etməlisən:\n\n${fileContent}\n\nCavablarını həmişə səlis Azərbaycan dilində ver.`;
      }
    } catch (e) {
      // Fayl oxunmasa default system prompt qalır
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
          { role: 'system', content: agentSystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'AI xətası' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
