import React, { useState } from 'react';
import { 
  X, CheckCircle, Play, RefreshCw, FileText, 
  Code, ShieldAlert, CheckSquare, Edit3, HelpCircle
} from 'lucide-react';

const NodeInspectorSidebar = ({ selectedNode, graphState, onApproveStep, onClose }) => {
  if (!selectedNode) return null;

  const nodeId = selectedNode.id;
  const nodeData = selectedNode.data;
  const status = nodeData.status || 'PENDING';
  const artifactData = graphState?.step_outputs?.[nodeId] || graphState?.[nodeId] || null;

  // Local state for HITL editable fields
  const [editableJson, setEditableJson] = useState(
    artifactData ? JSON.stringify(artifactData, null, 2) : ''
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleApprove = () => {
    let modifiedData = null;
    if (isEditing) {
      try {
        modifiedData = JSON.parse(editableJson);
      } catch (err) {
        alert("Invalid JSON format in edit box!");
        return;
      }
    }
    onApproveStep(nodeId, modifiedData);
  };

  return (
    <div className="absolute right-0 top-14 bottom-10 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-30 flex flex-col transition-all duration-300">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">{nodeData.label}</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Node Status Banner */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">Status:</span>
        {status === 'PAUSED' ? (
          <span className="text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded font-semibold animate-pulse">
            ⏸ Action Required (HITL)
          </span>
        ) : status === 'COMPLETED' ? (
          <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
            ✅ Completed
          </span>
        ) : status === 'RUNNING' ? (
          <span className="text-sky-400 bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded font-semibold">
            ⚡ Running Agent...
          </span>
        ) : (
          <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            🕒 Pending
          </span>
        )}
      </div>

      {/* Content / Artifact Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Agent Output Artifact
            </span>
            {artifactData && (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> {isEditing ? 'Cancel Edit' : 'Edit Artifact'}
              </button>
            )}
          </div>

          {artifactData ? (
            isEditing ? (
              <textarea
                value={editableJson}
                onChange={(e) => setEditableJson(e.target.value)}
                className="w-full h-64 bg-slate-950 border border-cyan-800/80 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            ) : (
              <pre className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-80 border-l-2 border-l-cyan-500">
                {JSON.stringify(artifactData, null, 2)}
              </pre>
            )
          ) : (
            <div className="p-6 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-500">
              No artifact generated yet. Trigger node to produce output.
            </div>
          )}
        </div>

        {/* Specialized Step Highlights */}
        {nodeId === 'code_analysis' && graphState?.needs_code_change !== undefined && (
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1 text-xs">
            <div className="text-slate-400 font-medium">Branching Decision:</div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Needs Code Change:</span>
              <span className={`font-mono font-bold ${graphState.needs_code_change ? 'text-amber-400' : 'text-emerald-400'}`}>
                {graphState.needs_code_change ? 'TRUE (Triggers Dev & Review)' : 'FALSE (Direct to STP)'}
              </span>
            </div>
          </div>
        )}

        {nodeId === 'stp_execution' && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-lg space-y-1 text-xs">
            <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Automated STP Pass Rate
            </div>
            <div className="text-slate-300 text-[11px]">
              3 of 3 Test Scenarios Passed (100% Coverage). Ready for L3 UAT Sign-off.
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer / Action Buttons */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
        <button
          onClick={handleApprove}
          disabled={status === 'RUNNING'}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-lg shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {status === 'PAUSED' ? 'Approve & Advance Step' : 'Run / Step Agent Node'}
        </button>

        <button
          onClick={() => onApproveStep(nodeId, null)}
          className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Re-run Agent Node
        </button>
      </div>
    </div>
  );
};

export default NodeInspectorSidebar;
