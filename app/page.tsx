'use client';

import { useState } from 'react';

export default function AliDaiDashboard() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('anthropic/claude-3.5-sonnet');
  const [agentRole, setAgentRole] = useState('AliDai Universal Jarvis');
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Salam Məhəmməd! Mən AliDai-yəm. Claude 3.5 Sonnet dəstəyi və Ağdaş layihələrini idarə etmək üçün hazıram. Əmrini gözləyirəm.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, model, agentRole }),
      });
      const data = await res.json();
      
      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Xəta: ' + (data.error || 'Cavab alınmadı.') }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Şəbəkə xətası: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-100 font-sans">
      {/* Top Header & Controls */}
      <header className="flex flex-col px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-extrabold text-sm tracking-widest text-purple-400">ALIDAI // AGDASH</h1>
          </div>
          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
            Claude 3.5 Active
          </span>
        </div>

        {/* Selectors for Mobile */}
        <div className="grid grid-cols-2 gap-2">
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-[11px] text-purple-300 rounded-lg p-1.5 outline-none focus:border-purple-500"
          >
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="openai/gpt-4o">GPT-4o (OpenAI)</option>
            <option value="deepseek/deepseek-chat">DeepSeek V3</option>
            <option value="google/gemini-pro-1.5">Gemini Pro</option>
          </select>

          <select 
            value={agentRole} 
            onChange={(e) => setAgentRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 rounded-lg p-1.5 outline-none focus:border-indigo-500"
          >
            <option value="AliDai Universal Jarvis">Jarvis (Universal)</option>
            <option value="Expert Fullstack & Laravel Developer">Fullstack / Laravel Eksperti</option>
            <option value="E-commerce & PrisonShop Manager">E-kommersiya (PrisonShop)</option>
            <option value="Ethno-Electronic Music Producer">Musiqi Prodüseri (DJ Maga)</option>
          </select>
        </div>
      </header>

      {/* Chat Messages Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-purple-400 text-xs p-3 bg-slate-900/50 rounded-2xl w-fit animate-pulse">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
            <span>AliDai düşünür (Claude 3.5)...</span>
          </div>
        )}
      </div>

      {/* Bottom Fixed Input Bar */}
      <footer className="p-3 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 focus-within:border-purple-500 transition">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ağıllı əmr yazın..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            GÖNDƏR
          </button>
        </div>
      </footer>
    </div>
  );
}
