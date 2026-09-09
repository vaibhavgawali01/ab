from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.schemas.api_schemas import ConflictsResponse, ResolveConflictRequest, ResolveConflictResponse
from app.services.conflict_engine import conflict_engine

router = APIRouter(prefix="/conflicts", tags=["Conflict Management"])

@router.get("", response_model=ConflictsResponse)
def get_track_conflicts(
    corridor: Optional[str] = Query(None, description="Optional corridor filter")
):
    """
    Retrieve active track conflicts (Headway violations, Platform overlaps, Precedence inversions)
    detected across railway corridors along with dispatcher recommendations.
    """
    conflicts = conflict_engine.get_active_conflicts(corridor_code=corridor)
    critical = sum(1 for c in conflicts if c.get("severity") == "Critical" and not c.get("resolved"))
    
    return ConflictsResponse(
        total_active_conflicts=len([c for c in conflicts if not c.get("resolved")]),
        critical_count=critical,
        conflicts=conflicts
    )

@router.post("/resolve", response_model=ResolveConflictResponse)
@router.post("-conflict", response_model=ResolveConflictResponse)
def resolve_conflict(req: ResolveConflictRequest):
    """
    Apply a simulated dispatcher resolution to an active track conflict
    (e.g., Loop line diversion, Precedence override, Speed advisory).
    """
    res = conflict_engine.resolve_conflict(
        conflict_id=req.conflict_id,
        action=req.resolution_action,
        notes=req.notes
    )
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message"))
    
    return ResolveConflictResponse(
        conflict_id=req.conflict_id,
        success=True,
        status="Resolved",
        message=res["message"]
    )


@router.post("/reset")
def reset_all_conflicts():
    """Reset simulated conflict scenarios to default demo state."""
    conflict_engine.reset_conflicts()
    return {"message": "Simulated conflicts reset to default active state."}
