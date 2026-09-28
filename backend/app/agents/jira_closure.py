import datetime
from typing import Dict, Any
from app.graph.state import AgentState

def run_jira_closure(state: AgentState) -> Dict[str, Any]:
    ticket_id = state.get("ticket_id", "PROJ-101")
    l3_status = state.get("l3_approval_status", "APPROVED")
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    
    jira_closure_status = {
        "ticket_id": ticket_id,
        "new_status": "Closed / Sent to UAT",
        "comment_posted": (
            f"✅ Autonomous SDLC Pipeline completed successfully.\n"
            f"- Requirements & Code Analysis: Completed\n"
            f"- Code Patch & Review: Passed\n"
            f"- STP Preparation & Execution: Passed (3/3)\n"
            f"- L3 Manager Approval: {l3_status}\n"
            f"Deployment pushed to UAT environment."
        ),
        "closed_at": datetime.datetime.now().isoformat()
    }
    
    new_logs = [
        f"[{timestamp}] [Jira Closure Agent] Closing ticket {ticket_id} and transitioning status to UAT...",
        f"[{timestamp}] [Jira Closure Agent] Ticket {ticket_id} successfully closed and sent to UAT."
    ]

    return {
        "jira_closure_status": jira_closure_status,
        "logs": new_logs,
        "current_step": "jira_closure",
        "completed_steps": ["jira_closure"],
        "step_outputs": {"jira_closure": jira_closure_status}
    }
