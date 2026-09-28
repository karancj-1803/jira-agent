import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState 
} from '@xyflow/react';

import HeroLanding from './components/HeroLanding';
import HeaderBar from './components/HeaderBar';
import AgentNodeCard from './components/AgentNodeCard';
import NodeInspectorSidebar from './components/NodeInspectorSidebar';
import LiveLogFooter from './components/LiveLogFooter';

const nodeTypes = {
  agent: AgentNodeCard
};

// Vertical top-to-bottom layout node positions
const INITIAL_NODES = [
  {
    id: 'jira_ingestion',
    type: 'agent',
    position: { x: 350, y: 40 },
    data: { label: '1. Jira Ingestion Agent', icon: 'inbox', status: 'PENDING', subtitle: 'Fetch ticket details via API' }
  },
  {
    id: 'jira_analysis',
    type: 'agent',
    position: { x: 350, y: 180 },
    data: { label: '2. Jira Analysis Agent', icon: 'file-search', status: 'PENDING', subtitle: 'Extract specs & edge cases' }
  },
  {
    id: 'code_analysis',
    type: 'agent',
    position: { x: 350, y: 320 },
    data: { label: '3. Code Analysis Agent', icon: 'code', status: 'PENDING', subtitle: 'Identify files & code change flag' }
  },
  {
    id: 'code_development',
    type: 'agent',
    position: { x: 120, y: 480 },
    data: { label: '4. Code Development Agent', icon: 'git-pull-request', status: 'PENDING', subtitle: 'Generate code patch & diffs', conditional: true }
  },
  {
    id: 'code_review',
    type: 'agent',
    position: { x: 120, y: 640 },
    data: { label: '5. Code Review Agent', icon: 'shield-check', status: 'PENDING', subtitle: 'Audit patch for syntax & security' }
  },
  {
    id: 'stp_preparation',
    type: 'agent',
    position: { x: 580, y: 480 },
    data: { label: '6. STP Preparation Agent', icon: 'list-checks', status: 'PENDING', subtitle: 'Generate test plan & scenarios' }
  },
  {
    id: 'stp_execution',
    type: 'agent',
    position: { x: 350, y: 800 },
    data: { label: '7. STP Execution Agent', icon: 'play-circle', status: 'PENDING', subtitle: 'Execute test suite & gather logs' }
  },
  {
    id: 'jira_closure',
    type: 'agent',
    position: { x: 350, y: 950 },
    data: { label: '8. Jira Closure Agent', icon: 'check-circle', status: 'PENDING', subtitle: 'Update status & deploy to UAT' }
  }
];

// Clean vertical smoothstep edges
const INITIAL_EDGES = [
  { id: 'e1-2', source: 'jira_ingestion', target: 'jira_analysis', type: 'smoothstep', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e2-3', source: 'jira_analysis', target: 'code_analysis', type: 'smoothstep', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e3-4', source: 'code_analysis', target: 'code_development', type: 'smoothstep', label: 'Needs Code Change = True', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' } },
  { id: 'e3-6', source: 'code_analysis', target: 'stp_preparation', type: 'smoothstep', label: 'Continuous Path', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e4-5', source: 'code_development', target: 'code_review', type: 'smoothstep', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e5-7', source: 'code_review', target: 'stp_execution', type: 'smoothstep', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e6-7', source: 'stp_preparation', target: 'stp_execution', type: 'smoothstep', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e7-8', source: 'stp_execution', target: 'jira_closure', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } }
];

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  const [ticketId, setTicketId] = useState('PROJ-101');
  const [hitlMode, setHitlMode] = useState('STEP_BY_STEP');
  const [threadId, setThreadId] = useState(null);
  const [graphState, setGraphState] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  // Sync React Flow node status badges with backend graph state
  const syncNodesWithState = useCallback((state, nextNodes = []) => {
    const completed = state?.completed_steps || [];
    const currentStep = state?.current_step;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        let status = 'PENDING';
        if (completed.includes(node.id)) {
          status = 'COMPLETED';
        } else if (nextNodes.includes(node.id)) {
          status = 'PAUSED'; // HITL interrupt state
        } else if (currentStep === node.id) {
          status = 'RUNNING';
        }

        // Special check if code change was skipped
        if (node.id === 'code_development' || node.id === 'code_review') {
          if (state?.needs_code_change === false && !completed.includes(node.id)) {
            status = 'SKIPPED';
          }
        }

        return {
          ...node,
          data: {
            ...node.data,
            status
          }
        };
      })
    );
  }, [setNodes]);

  // Start new SDLC workflow run
  const handleStartWorkflow = async (selectedTicketId = ticketId, selectedHitlMode = hitlMode) => {
    setTicketId(selectedTicketId);
    setHitlMode(selectedHitlMode);
    setHasStarted(true);
    setIsWorkflowRunning(true);
    setNodes(INITIAL_NODES);
    setSelectedNode(null);

    try {
      const res = await fetch('/api/sdlc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: selectedTicketId, hitl_mode: selectedHitlMode })
      });
      const data = await res.json();
      setThreadId(data.thread_id);
      setGraphState(data.state);
      syncNodesWithState(data.state, data.next_nodes);

      // Auto select active paused node
      if (data.next_nodes && data.next_nodes.length > 0) {
        const nextId = data.next_nodes[0];
        const match = INITIAL_NODES.find((n) => n.id === nextId);
        if (match) setSelectedNode(match);
      }
    } catch (err) {
      console.error("Failed to start workflow:", err);
    } finally {
      setIsWorkflowRunning(false);
    }
  };

  // Approve step & advance graph
  const handleApproveStep = async (nodeId, modifiedData = null) => {
    if (!threadId) return;
    setIsWorkflowRunning(true);

    try {
      const res = await fetch('/api/sdlc/step/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: threadId,
          action: 'APPROVE',
          modified_data: modifiedData
        })
      });
      const data = await res.json();
      setGraphState(data.state);
      syncNodesWithState(data.state, data.next_nodes);

      if (data.next_nodes && data.next_nodes.length > 0) {
        const nextId = data.next_nodes[0];
        const match = nodes.find((n) => n.id === nextId);
        if (match) setSelectedNode(match);
      } else {
        setSelectedNode(null);
      }
    } catch (err) {
      console.error("Failed to advance step:", err);
    } finally {
      setIsWorkflowRunning(false);
    }
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  // Render Hero Landing View when not started
  if (!hasStarted) {
    return <HeroLanding onStartWorkflow={handleStartWorkflow} />;
  }

  // Render Interactive n8n Node DAG Canvas
  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Top Controller Header */}
      <HeaderBar
        ticketId={ticketId}
        setTicketId={setTicketId}
        hitlMode={hitlMode}
        setHitlMode={setHitlMode}
        onStartWorkflow={handleStartWorkflow}
        onResetToLanding={() => setHasStarted(false)}
        isWorkflowRunning={isWorkflowRunning}
        currentStep={graphState?.current_step}
      />

      {/* Main n8n Node Canvas Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background color="#1e293b" gap={24} size={1} />
          <Controls />
        </ReactFlow>

        {/* Node Inspector Sidebar */}
        <NodeInspectorSidebar
          selectedNode={selectedNode}
          graphState={graphState}
          onApproveStep={handleApproveStep}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {/* Bottom Live Execution Logs Console */}
      <LiveLogFooter logs={graphState?.logs || []} />
    </div>
  );
}
