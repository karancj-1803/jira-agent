import React from 'react';
import { Play, Pause, Zap, Cpu, ArrowLeft } from 'lucide-react';

const HeaderBar = ({ 
  ticketId, 
  setTicketId, 
  hitlMode, 
  setHitlMode, 
  onStartWorkflow, 
  onResetToLanding,
  isWorkflowRunning,
  currentStep
}) => {
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetToLanding}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs flex items-center gap-1 transition"
          title="Return to Hero Landing Screen"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> New Ticket
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              SDLC Workflow Orchestrator
              <span className="text-[9px] font-mono font-normal bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded-full">
                n8n Vertical DAG
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Ticket Input & Workflow Controller */}
      <div className="flex items-center gap-3">
        {/* Ticket Indicator Input */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-xs text-slate-400 font-mono mr-2">Ticket:</span>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="PROJ-101"
            className="w-24 bg-transparent text-xs font-mono text-cyan-300 font-bold focus:outline-none"
          />
        </div>

        {/* HITL Mode Switch */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setHitlMode('STEP_BY_STEP')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
              hitlMode === 'STEP_BY_STEP'
                ? 'bg-amber-950 text-amber-300 border border-amber-800/80 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pause className="w-3 h-3 text-amber-400" /> Step-by-Step
          </button>

          <button
            onClick={() => setHitlMode('AUTO_PILOT')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
              hitlMode === 'AUTO_PILOT'
                ? 'bg-sky-950 text-sky-300 border border-sky-800/80 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-sky-400" /> Auto-Pilot
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onStartWorkflow(ticketId, hitlMode)}
          disabled={isWorkflowRunning}
          className="py-1.5 px-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-900/40 flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isWorkflowRunning ? 'Running...' : 'Restart Pipeline'}
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
