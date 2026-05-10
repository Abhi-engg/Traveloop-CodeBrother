from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import Activity, City
from core.schemas import ActivityIn, ActivityOut

router = Router(tags=["activities"], auth=JWTAuth())


@router.get("/cities/{city_id}", response=list[ActivityOut])
def list_activities(request, city_id: int):
    city = get_object_or_404(City, id=city_id)
    return Activity.objects.filter(city=city).order_by("name", "id")


@router.post("/cities/{city_id}", response=ActivityOut)
def create_activity(request, city_id: int, payload: ActivityIn):
    city = get_object_or_404(City, id=city_id)
    return Activity.objects.create(city=city, **payload.dict())


@router.put("/{activity_id}", response=ActivityOut)
def update_activity(request, activity_id: int, payload: ActivityIn):
    activity = get_object_or_404(Activity, id=activity_id)
    for field, value in payload.dict().items():
        setattr(activity, field, value)
    activity.save()
    return activity


@router.delete("/{activity_id}", response={204: None})
def delete_activity(request, activity_id: int):
    activity = get_object_or_404(Activity, id=activity_id)
    activity.delete()
    return 204, None
