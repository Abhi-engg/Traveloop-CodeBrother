from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import Activity, Stop, StopActivity
from core.schemas import StopActivityIn, StopActivityOut

router = Router(tags=["stop-activities"], auth=JWTAuth())


@router.get("/stops/{stop_id}", response=list[StopActivityOut])
def list_stop_activities(request, stop_id: int):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    return StopActivity.objects.filter(stop=stop).order_by("id")


@router.post("/stops/{stop_id}", response=StopActivityOut)
def create_stop_activity(request, stop_id: int, payload: StopActivityIn):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    activity = get_object_or_404(Activity, id=payload.activity_id)
    return StopActivity.objects.create(
        stop=stop, activity=activity, **payload.dict(exclude={"activity_id"})
    )


@router.put("/{stop_activity_id}", response=StopActivityOut)
def update_stop_activity(request, stop_activity_id: int, payload: StopActivityIn):
    stop_activity = get_object_or_404(
        StopActivity, id=stop_activity_id, stop__trip__user=request.user
    )
    stop_activity.activity = get_object_or_404(Activity, id=payload.activity_id)
    for field, value in payload.dict(exclude={"activity_id"}).items():
        setattr(stop_activity, field, value)
    stop_activity.save()
    return stop_activity


@router.delete("/{stop_activity_id}", response={204: None})
def delete_stop_activity(request, stop_activity_id: int):
    stop_activity = get_object_or_404(
        StopActivity, id=stop_activity_id, stop__trip__user=request.user
    )
    stop_activity.delete()
    return 204, None
