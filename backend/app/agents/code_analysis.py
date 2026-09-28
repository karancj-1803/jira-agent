import datetime
from typing import Dict, Any
from app.graph.state import AgentState

def run_code_analysis(state: AgentState) -> Dict[str, Any]:
    ticket_id = state.get("ticket_id", "PROJ-101")
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    
    needs_code_change = True
    
    code_analysis_report = {
        "ticket_id": ticket_id,
        "needs_code_change": needs_code_change,
        "target_files": [
            "backend/app/core/config.py",
            "backend/app/services/session_manager.py"
        ],
        "impact_assessment": "Low risk; localized configuration update in session manager service.",
        "proposed_changes": [
            "Update SESSION_EXPIRE_SECONDS from 300 to 3600 in config.py.",
            "Verify session validation check in session_manager.py."
        ]
    }
    
    new_logs = [
        f"[{timestamp}] [Code Analysis Agent] Scanning codebase and identifying target files for {ticket_id}...",
        f"[{timestamp}] [Code Analysis Agent] Code analysis completed. needs_code_change={needs_code_change}."
    ]

    return {
        "code_analysis_report": code_analysis_report,
        "needs_code_change": needs_code_change,
        "logs": new_logs,
        "current_step": "code_analysis",
        "completed_steps": ["code_analysis"],
        "step_outputs": {"code_analysis": code_analysis_report}
    }
