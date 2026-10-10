'use client';

import { useState } from 'react';

export default function AliDaiDashboard() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('openai/gpt-4o');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (data.choices && data.choices[0]) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse(data.error || 'Xəta baş verdi.');
      }
    } catch (err: any) {
      setResponse('Şəbəkə xətası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-md flex justify-between items-center py-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-bold text-lg tracking-wider text-purple-400">ALIDAI // VA</h1>
        </div>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="bg-slate-900 border border-purple-900/50 text-xs text-purple-300 rounded-lg px-2 py-1 outline-none focus:border-purple-500 transition"
        >
          <option value="openai/gpt-4o">GPT-4o (OpenAI)</option>
          <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          <option value="deepseek/deepseek-chat">DeepSeek V3</option>
          <option value="google/gemini-pro-1.5">Gemini Pro</option>
        </select>
      </header>

      {/* Center Orb & Avatar Display */}
      <div className="flex flex-col items-center my-auto space-y-6">
        <div className={`relative flex items-center justify-center w-40 h-40 rounded-full transition-all duration-700 ${
          loading 
            ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 animate-spin blur-sm shadow-[0_0_50px_rgba(168,85,247,0.8)]' 
            : 'bg-gradient-to-tr from-indigo-900 via-purple-800 to-slate-900 shadow-[0_0_30px_rgba(147,51,234,0.3)] border border-purple-500/20'
        }`}>
          <div className="w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center border border-purple-500/30">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {loading ? '...' : 'ALI'}
            </span>
          </div>
        </div>
        
        {/* Dynamic Response Box */}
        {response && (
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 text-sm leading-relaxed text-slate-200 max-h-60 overflow-y-auto shadow-xl">
            {response}
          </div>
        )}
      </div>

      {/* Bottom Command Bar */}
      <footer className="w-full max-w-md mb-2">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 focus-within:border-purple-500 transition">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="AliDai-yə əmr verin..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50"
          >
            {loading ? '...' : 'GÖNDƏR'}
          </button>
        </div>
      </footer>
    </main>
  );
}
