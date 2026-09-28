import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';

const LiveLogFooter = ({ logs = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer className={`bg-slate-950 border-t border-slate-800 transition-all duration-300 flex flex-col z-20 ${isExpanded ? 'h-52' : 'h-10'}`}>
      {/* Log Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 font-mono">Live Agent Execution Logs</span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500 font-mono">
            {logs.length > 0 ? logs[logs.length - 1] : 'Ready to start'}
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Logs Console */}
      {isExpanded && (
        <div className="flex-1 p-3 bg-slate-950/90 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1 border-t border-slate-800/60">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">No execution logs logged yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="leading-tight flex items-start gap-2">
                <span className="text-slate-600 font-bold select-none">&gt;</span>
                <span className={log.includes('PASSED') || log.includes('Successfully') ? 'text-emerald-400' : log.includes('PAUSED') || log.includes('Mode') ? 'text-amber-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </footer>
  );
};

export default LiveLogFooter;
