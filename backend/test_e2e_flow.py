import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/sdlc"

def post(endpoint, data):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def main():
    print("1. Starting SDLC Pipeline for PROJ-101 in Step-by-Step HITL mode...")
    start_res = post("/start", {"ticket_id": "PROJ-101", "hitl_mode": "STEP_BY_STEP"})
    thread_id = start_res["thread_id"]
    print(f"   Thread ID: {thread_id}")
    print(f"   Next Nodes: {start_res['next_nodes']}")

    step_count = 1
    while start_res.get("next_nodes"):
        next_node = start_res["next_nodes"][0]
        print(f"\n--- Step {step_count}: Approving node '{next_node}' ---")
        start_res = post("/step/approve", {"thread_id": thread_id, "action": "APPROVE"})
        print(f"   Status: {start_res['status']}")
        print(f"   Next Nodes: {start_res.get('next_nodes')}")
        step_count += 1

    print("\n==========================================")
    print("[SUCCESS] END-TO-END PIPELINE COMPLETED SUCCESSFULLY!")
    print("Completed steps:", start_res["state"]["completed_steps"])
    print("\nExecution logs:")
    for log in start_res["state"]["logs"]:
        print(f"  {log}")

if __name__ == "__main__":
    main()
