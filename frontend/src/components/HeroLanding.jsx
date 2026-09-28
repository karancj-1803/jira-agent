import React, { useState } from 'react';
import { Cpu, Play, Pause, Zap, ArrowRight, ShieldCheck, CheckCircle2, Ticket } from 'lucide-react';

const HeroLanding = ({ onStartWorkflow }) => {
  const [ticketId, setTicketId] = useState('');
  const [hitlMode, setHitlMode] = useState('STEP_BY_STEP');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    onStartWorkflow(ticketId.trim(), hitlMode);
  };

  const handleQuickSelect = (id) => {
    setTicketId(id);
    onStartWorkflow(id, hitlMode);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Dynamic Background Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#0369a11a,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 z-10 relative">
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 text-xs font-semibold shadow-xl shadow-cyan-950/40">
          <Cpu className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>Autonomous SDLC Multi-Agent Orchestrator</span>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
            LangGraph v1.0
          </span>
        </div>

        {/* Huge Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Automate Your Entire SDLC from <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
              Jira Ticket to UAT Deployment
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Driven by 8 specialized AI agents with continuous test planning, conditional code generation, and step-by-step Human-in-the-Loop guardrails.
          </p>
        </div>

        {/* Prominent Ticket Input Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-2xl shadow-slate-950 text-left space-y-5 max-w-xl mx-auto border-t border-t-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Enter Jira Ticket ID</span>
                <span className="text-[11px] text-slate-500 font-mono font-normal">Format: PROJECT-ID</span>
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                  <Ticket className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  placeholder="e.g. PROJ-101"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-xl text-base font-mono text-cyan-300 font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
            </div>

            {/* Execution Mode Selector */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setHitlMode('STEP_BY_STEP')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  hitlMode === 'STEP_BY_STEP'
                    ? 'bg-amber-950/60 border-amber-600/80 text-amber-200 ring-1 ring-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> Step-by-Step HITL
                  </span>
                  {hitlMode === 'STEP_BY_STEP' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Pause & review output artifact at every single agent node
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHitlMode('AUTO_PILOT')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  hitlMode === 'AUTO_PILOT'
                    ? 'bg-sky-950/60 border-sky-600/80 text-sky-200 ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-400" /> Auto-Pilot Mode
                  </span>
                  {hitlMode === 'AUTO_PILOT' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Execute continuously; pause only at final L3 approval gate
                </span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
            >
              <span>Launch Autonomous SDLC Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer Agent Pipeline Chips */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="text-slate-400">Pipeline Agents:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">1. Jira Ingest</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">2. Jira Analysis</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">3. Code Analysis</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/60 text-amber-300">4 & 5. Code Dev/Review (If)</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">6. STP Prep</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">7. STP Exec</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">8. Jira Closure</span>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
