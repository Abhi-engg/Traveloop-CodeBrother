from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import Activity, Stop
from core.schemas import ActivityIn, ActivityOut

router = Router(tags=["activities"], auth=JWTAuth())


@router.get("/stops/{stop_id}", response=list[ActivityOut])
def list_activities(request, stop_id: int):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    return Activity.objects.filter(stop=stop).order_by("start_time", "id")


@router.post("/stops/{stop_id}", response=ActivityOut)
def create_activity(request, stop_id: int, payload: ActivityIn):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    return Activity.objects.create(stop=stop, **payload.dict())


@router.put("/{activity_id}", response=ActivityOut)
def update_activity(request, activity_id: int, payload: ActivityIn):
    activity = get_object_or_404(Activity, id=activity_id, stop__trip__user=request.user)
    for field, value in payload.dict().items():
        setattr(activity, field, value)
    activity.save()
    return activity


@router.delete("/{activity_id}", response={204: None})
def delete_activity(request, activity_id: int):
    activity = get_object_or_404(Activity, id=activity_id, stop__trip__user=request.user)
    activity.delete()
    return 204, None
