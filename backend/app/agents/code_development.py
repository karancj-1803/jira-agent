import datetime
from typing import Dict, Any
from app.graph.state import AgentState

def run_code_development(state: AgentState) -> Dict[str, Any]:
    ticket_id = state.get("ticket_id", "PROJ-101")
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    
    code_patch = {
        "ticket_id": ticket_id,
        "patched_files": [
            {
                "file_path": "backend/app/core/config.py",
                "diff": (
                    "--- a/backend/app/core/config.py\n"
                    "+++ b/backend/app/core/config.py\n"
                    "@@ -12,3 +12,3 @@\n"
                    "-SESSION_EXPIRE_SECONDS: int = 300\n"
                    "+SESSION_EXPIRE_SECONDS: int = 3600  # Updated per ticket requirement\n"
                )
            },
            {
                "file_path": "backend/app/services/session_manager.py",
                "diff": (
                    "--- a/backend/app/services/session_manager.py\n"
                    "+++ b/backend/app/services/session_manager.py\n"
                    "@@ -45,2 +45,4 @@\n"
                    " def is_session_valid(session: Session) -> bool:\n"
                    "+    if session.is_expired():\n"
                    "+        return False\n"
                    "     return session.active\n"
                )
            }
        ],
        "summary": "Updated SESSION_EXPIRE_SECONDS to 3600 and added explicit session expiration check."
    }
    
    new_logs = [
        f"[{timestamp}] [Code Development Agent] Generating code patch and file edits for {ticket_id}...",
        f"[{timestamp}] [Code Development Agent] Code patch generated for 2 target files."
    ]

    return {
        "code_patch": code_patch,
        "logs": new_logs,
        "current_step": "code_development",
        "completed_steps": ["code_development"],
        "step_outputs": {"code_development": code_patch}
    }
