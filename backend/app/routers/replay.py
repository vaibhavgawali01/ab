from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.api_schemas import ReplayStateResponse, ReplayStepRequest
from app.services.replay_engine import replay_engine

router = APIRouter(prefix="/replay", tags=["Replay & Simulation"])

@router.get("", response_model=ReplayStateResponse)
def get_current_replay_state(
    corridor: Optional[str] = Query(None, description="Optional corridor filter (e.g. NDLS-HWH)")
):
    """Get the current real-time simulated train positions, speeds, block sections, and signal aspects."""
    state = replay_engine.get_current_state(corridor_code=corridor)
    return state

@router.post("/step", response_model=ReplayStateResponse)
def step_simulation(request: ReplayStepRequest):
    """Advance simulation clock by step_seconds * time_multiplier."""
    state = replay_engine.advance_simulation(
        step_seconds=request.step_seconds or 30,
        multiplier=request.time_multiplier or 1
    )
    return state

@router.post("/reset", response_model=ReplayStateResponse)
def reset_simulation():
    """Reset the simulation clock to the base timestamp."""
    state = replay_engine.reset_simulation()
    return state
