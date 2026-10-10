export async function askClaude(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('API Key tapılmadı.');
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
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { 
          role: 'system', 
          content: systemPrompt || 'Sən AliDai assistentisən. Azərbaycan dilində dəqiq cavab ver.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  return await response.json();
}
