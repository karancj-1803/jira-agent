import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.graph.workflow import build_sdlc_graph
from app.graph.state import AgentState

router = APIRouter(prefix="/api/sdlc", tags=["SDLC Graph"])

# Active in-memory graph runners per thread
THREAD_GRAPHS: Dict[str, Any] = {}

class StartGraphRequest(BaseModel):
    ticket_id: str
    hitl_mode: Optional[str] = "STEP_BY_STEP"

class ApproveStepRequest(BaseModel):
    thread_id: str
    action: Optional[str] = "APPROVE"  # "APPROVE", "AUTO_RUN", "REJECT"
    modified_data: Optional[Dict[str, Any]] = None

@router.post("/start")
def start_sdlc_workflow(req: StartGraphRequest):
    thread_id = str(uuid.uuid4())
    
    # Configure graph interrupt based on mode
    interrupt_nodes = None
    if req.hitl_mode == "AUTO_PILOT":
        interrupt_nodes = ["jira_closure"]  # Only interrupt for final L3 approval gate
    else:
        interrupt_nodes = [
            "jira_ingestion", "jira_analysis", "code_analysis",
            "code_development", "code_review", "stp_preparation",
            "stp_execution", "jira_closure"
        ]
        
    graph_instance = build_sdlc_graph(interrupt_nodes=interrupt_nodes)
    THREAD_GRAPHS[thread_id] = graph_instance
    
    config = {"configurable": {"thread_id": thread_id}}
    initial_state: AgentState = {
        "ticket_id": req.ticket_id,
        "hitl_mode": req.hitl_mode,
        "hitl_approved_steps": [],
        "logs": [f"[00:00:00] Pipeline initialized for ticket {req.ticket_id} (Mode: {req.hitl_mode})."],
        "completed_steps": [],
        "step_outputs": {},
        "current_step": "start"
    }
    
    # Invoke first node step
    events = list(graph_instance.stream(initial_state, config, stream_mode="values"))
    current_snapshot = graph_instance.get_state(config)
    
    return {
        "thread_id": thread_id,
        "status": "RUNNING" if current_snapshot.next else "COMPLETED",
        "next_nodes": current_snapshot.next,
        "state": current_snapshot.values
    }

@router.get("/state/{thread_id}")
def get_graph_state(thread_id: str):
    if thread_id not in THREAD_GRAPHS:
        raise HTTPException(status_code=404, detail="Thread not found")
        
    graph_instance = THREAD_GRAPHS[thread_id]
    config = {"configurable": {"thread_id": thread_id}}
    snapshot = graph_instance.get_state(config)
    
    return {
        "thread_id": thread_id,
        "next_nodes": snapshot.next,
        "state": snapshot.values,
        "is_paused": len(snapshot.next) > 0
    }

@router.post("/step/approve")
def approve_and_step_next(req: ApproveStepRequest):
    if req.thread_id not in THREAD_GRAPHS:
        raise HTTPException(status_code=404, detail="Thread not found")
        
    graph_instance = THREAD_GRAPHS[req.thread_id]
    config = {"configurable": {"thread_id": req.thread_id}}
    
    # If user provided state updates during HITL step inspection
    if req.modified_data:
        graph_instance.update_state(config, req.modified_data)
        
    # Resume graph execution
    events = list(graph_instance.stream(None, config, stream_mode="values"))
    snapshot = graph_instance.get_state(config)
    
    return {
        "thread_id": req.thread_id,
        "status": "RUNNING" if snapshot.next else "COMPLETED",
        "next_nodes": snapshot.next,
        "state": snapshot.values
    }

@router.get("/nodes")
def get_n8n_nodes_definition():
    """Returns static node graph topology for n8n UI canvas initialization"""
    return {
        "nodes": [
            {"id": "jira_ingestion", "label": "1. Jira Ingestion Agent", "type": "agent", "icon": "inbox"},
            {"id": "jira_analysis", "label": "2. Jira Analysis Agent", "type": "agent", "icon": "file-search"},
            {"id": "code_analysis", "label": "3. Code Analysis Agent", "type": "agent", "icon": "code"},
            {"id": "code_development", "label": "4. Code Development Agent", "type": "agent", "icon": "git-pull-request", "conditional": True},
            {"id": "code_review", "label": "5. Code Review Agent", "type": "agent", "icon": "shield-check"},
            {"id": "stp_preparation", "label": "6. STP Preparation Agent", "type": "agent", "icon": "list-checks"},
            {"id": "stp_execution", "label": "7. STP Execution Agent", "type": "agent", "icon": "play-circle"},
            {"id": "jira_closure", "label": "8. Jira Closure Agent", "type": "agent", "icon": "check-circle"}
        ],
        "edges": [
            {"source": "jira_ingestion", "target": "jira_analysis"},
            {"source": "jira_analysis", "target": "code_analysis"},
            {"source": "code_analysis", "target": "code_development", "label": "Needs Code Change = True"},
            {"source": "code_analysis", "target": "stp_preparation", "label": "Continuous Path"},
            {"source": "code_development", "target": "code_review"},
            {"source": "code_review", "target": "stp_execution"},
            {"source": "stp_preparation", "target": "stp_execution"},
            {"source": "stp_execution", "target": "jira_closure"}
        ]
    }
