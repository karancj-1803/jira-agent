import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Inbox, FileSearch, Code, GitPullRequest, 
  ShieldCheck, ListChecks, PlayCircle, CheckCircle,
  Clock, Loader2, PauseCircle
} from 'lucide-react';

const ICON_MAP = {
  'inbox': Inbox,
  'file-search': FileSearch,
  'code': Code,
  'git-pull-request': GitPullRequest,
  'shield-check': ShieldCheck,
  'list-checks': ListChecks,
  'play-circle': PlayCircle,
  'check-circle': CheckCircle
};

const AgentNodeCard = memo(({ data, selected }) => {
  const IconComponent = ICON_MAP[data.icon] || Code;
  const status = data.status || 'PENDING'; // PENDING, RUNNING, PAUSED, COMPLETED, SKIPPED

  const getStatusBadge = () => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Done
          </span>
        );
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded-full animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin text-sky-400" /> Running
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/90 border border-amber-600/80 px-2 py-0.5 rounded-full animate-pulse shadow-md shadow-amber-900/50">
            <PauseCircle className="w-3 h-3 text-amber-300" /> HITL Action
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full">
            Skipped
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getBorderColor = () => {
    if (selected) return 'border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-500/40';
    if (status === 'PAUSED') return 'border-amber-500/90 shadow-2xl shadow-amber-900/50 ring-2 ring-amber-500/40';
    if (status === 'RUNNING') return 'border-sky-400 shadow-lg shadow-sky-500/20';
    if (status === 'COMPLETED') return 'border-emerald-500/60 shadow-md shadow-emerald-950/30';
    return 'border-slate-800 hover:border-slate-700';
  };

  return (
    <div className={`relative w-72 bg-slate-900/95 backdrop-blur-md border rounded-xl p-3.5 shadow-2xl transition-all duration-200 ${getBorderColor()}`}>
      {/* Top Handle (Incoming Vertical Edge) */}
      <Handle type="target" position={Position.Top} className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-slate-950" />
      
      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800/90 text-cyan-400 border border-slate-700/60 shadow-inner">
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide truncate max-w-[140px]">
            {data.label}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Node Body / Subtitle */}
      <div className="text-[11px] text-slate-400 leading-snug font-mono">
        {data.subtitle || 'Click node to inspect artifact & HITL payload'}
      </div>

      {data.conditional && (
        <div className="mt-2 text-[10px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/60 font-mono inline-block">
          ⚡ Conditional (Needs Code Change)
        </div>
      )}

      {/* Bottom Handle (Outgoing Vertical Edge) */}
      <Handle type="source" position={Position.Bottom} className="!w-3.5 !h-3.5 !bg-cyan-500 !border-2 !border-slate-950" />
    </div>
  );
});

export default AgentNodeCard;
