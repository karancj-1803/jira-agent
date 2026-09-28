from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from app.graph.state import AgentState

from app.agents.jira_ingestion import run_jira_ingestion
from app.agents.jira_analysis import run_jira_analysis
from app.agents.code_analysis import run_code_analysis
from app.agents.code_development import run_code_development
from app.agents.code_review import run_code_review
from app.agents.stp_preparation import run_stp_preparation
from app.agents.stp_execution import run_stp_execution
from app.agents.jira_closure import run_jira_closure

def route_after_code_analysis(state: AgentState):
    needs_code_change = state.get("needs_code_change", True)
    if needs_code_change:
        return ["code_development", "stp_preparation"]
    return ["stp_preparation"]

def build_sdlc_graph(interrupt_nodes=None):
    builder = StateGraph(AgentState)
    
    # Add Agent Nodes
    builder.add_node("jira_ingestion", run_jira_ingestion)
    builder.add_node("jira_analysis", run_jira_analysis)
    builder.add_node("code_analysis", run_code_analysis)
    builder.add_node("code_development", run_code_development)
    builder.add_node("code_review", run_code_review)
    builder.add_node("stp_preparation", run_stp_preparation)
    builder.add_node("stp_execution", run_stp_execution)
    builder.add_node("jira_closure", run_jira_closure)
    
    # Edges
    builder.add_edge(START, "jira_ingestion")
    builder.add_edge("jira_ingestion", "jira_analysis")
    builder.add_edge("jira_analysis", "code_analysis")
    
    # Branching after Code Analysis
    builder.add_conditional_edges("code_analysis", route_after_code_analysis, ["code_development", "stp_preparation"])
    
    builder.add_edge("code_development", "code_review")
    builder.add_edge("code_review", "stp_execution")
    builder.add_edge("stp_preparation", "stp_execution")
    builder.add_edge("stp_execution", "jira_closure")
    builder.add_edge("jira_closure", END)
    
    checkpointer = MemorySaver()
    
    # Optional interrupt points for HITL
    if interrupt_nodes is None:
        interrupt_nodes = [
            "jira_ingestion", "jira_analysis", "code_analysis",
            "code_development", "code_review", "stp_preparation",
            "stp_execution", "jira_closure"
        ]
        
    compiled_graph = builder.compile(
        checkpointer=checkpointer,
        interrupt_before=interrupt_nodes
    )
    return compiled_graph

# Shared instance for runtime
sdlc_graph = build_sdlc_graph()
