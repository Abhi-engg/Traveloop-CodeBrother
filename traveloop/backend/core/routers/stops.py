from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import City, Stop, Trip
from core.schemas import StopIn, StopOut

router = Router(tags=["stops"], auth=JWTAuth())


@router.get("/trips/{trip_id}", response=list[StopOut])
def list_stops(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return Stop.objects.filter(trip=trip).order_by("order", "id")


@router.post("/trips/{trip_id}", response=StopOut)
def create_stop(request, trip_id: int, payload: StopIn):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    city = get_object_or_404(City, id=payload.city_id)
    return Stop.objects.create(trip=trip, city=city, **payload.dict(exclude={"city_id"}))


@router.put("/{stop_id}", response=StopOut)
def update_stop(request, stop_id: int, payload: StopIn):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    stop.city = get_object_or_404(City, id=payload.city_id)
    for field, value in payload.dict(exclude={"city_id"}).items():
        setattr(stop, field, value)
    stop.save()
    return stop


@router.delete("/{stop_id}", response={204: None})
def delete_stop(request, stop_id: int):
    stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
    stop.delete()
    return 204, None
