import datetime
from typing import Dict, Any
from app.graph.state import AgentState

def run_jira_analysis(state: AgentState) -> Dict[str, Any]:
    jira_data = state.get("jira_raw_data", {})
    ticket_id = state.get("ticket_id", "PROJ-101")
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    
    analysis_report = {
        "ticket_id": ticket_id,
        "summary_analysis": f"Issue '{jira_data.get('summary')}' relates to session expiration configuration mismatch.",
        "root_cause_hypothesis": "Session manager timeout constant is hardcoded or misconfigured to 300s instead of 3600s.",
        "functional_requirements": [
            "Modify DEFAULT_SESSION_TIMEOUT constant to 3600 seconds.",
            "Ensure session refresh endpoint extends session duration correctly."
        ],
        "non_functional_requirements": [
            "Zero security vulnerability in JWT signature validation.",
            "Response latency of auth middleware < 15ms."
        ],
        "edge_cases": [
            "Expired refresh tokens must trigger 401 Unauthorized cleanly.",
            "Concurrent session refreshes should not invalidate valid tokens prematurely."
        ],
        "recommended_action": "Modify authentication session configuration and update test suite."
    }
    
    new_logs = [
        f"[{timestamp}] [Jira Analysis Agent] Analyzing requirements and edge cases for {ticket_id}...",
        f"[{timestamp}] [Jira Analysis Agent] Analysis report generated successfully."
    ]

    return {
        "analysis_report": analysis_report,
        "logs": new_logs,
        "current_step": "jira_analysis",
        "completed_steps": ["jira_analysis"],
        "step_outputs": {"jira_analysis": analysis_report}
    }
