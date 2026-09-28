from typing import TypedDict, Optional, List, Dict, Any, Annotated
import operator

def merge_step_outputs(left: Optional[Dict[str, Any]], right: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    res = dict(left or {})
    if right:
        res.update(right)
    return res

def take_latest_step(left: Optional[str], right: Optional[str]) -> str:
    return right if right is not None else (left or "")

class AgentState(TypedDict, total=False):
    ticket_id: str
    hitl_mode: str  # "STEP_BY_STEP" or "AUTO_PILOT"
    hitl_approved_steps: List[str]
    
    # Node outputs & artifacts
    jira_raw_data: Optional[Dict[str, Any]]
    analysis_report: Optional[Dict[str, Any]]
    code_analysis_report: Optional[Dict[str, Any]]
    needs_code_change: bool
    code_patch: Optional[Dict[str, Any]]
    review_feedback: Optional[Dict[str, Any]]
    stp_plan: Optional[Dict[str, Any]]
    stp_execution_report: Optional[Dict[str, Any]]
    l3_approval_status: Optional[str]  # "PENDING", "APPROVED", "REJECTED"
    l3_feedback: Optional[str]
    jira_closure_status: Optional[Dict[str, Any]]
    
    # Progress & Logging with reducers for parallel branch support
    logs: Annotated[List[str], operator.add]
    completed_steps: Annotated[List[str], operator.add]
    step_outputs: Annotated[Dict[str, Any], merge_step_outputs]
    current_step: Annotated[str, take_latest_step]
    
    error: Optional[str]
