import datetime
from typing import Dict, Any
from app.graph.state import AgentState

def run_stp_preparation(state: AgentState) -> Dict[str, Any]:
    ticket_id = state.get("ticket_id", "PROJ-101")
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    
    stp_plan = {
        "ticket_id": ticket_id,
        "plan_version": "1.0",
        "test_cases": [
            {
                "test_id": "TC-AUTH-01",
                "title": "Verify Session Timeout Configuration",
                "procedure": "Read SESSION_EXPIRE_SECONDS from application config.",
                "expected_result": "Value equals 3600 seconds."
            },
            {
                "test_id": "TC-AUTH-02",
                "title": "Token Refresh Endpoint Behavior",
                "procedure": "POST /api/auth/refresh with valid refresh token.",
                "expected_result": "HTTP 200 OK returned with new 1-hour expiration timestamp."
            },
            {
                "test_id": "TC-AUTH-03",
                "title": "Expired Token Rejection",
                "procedure": "POST /api/auth/refresh with token expired > 3600s.",
                "expected_result": "HTTP 401 Unauthorized returned."
            }
        ],
        "test_environment": "UAT Staging Sandbox"
    }
    
    new_logs = [
        f"[{timestamp}] [STP Preparation Agent] Generating Software Test Plan (STP) and automated test suite for {ticket_id}...",
        f"[{timestamp}] [STP Preparation Agent] STP generated with 3 test scenarios."
    ]

    return {
        "stp_plan": stp_plan,
        "logs": new_logs,
        "current_step": "stp_preparation",
        "completed_steps": ["stp_preparation"],
        "step_outputs": {"stp_preparation": stp_plan}
    }
