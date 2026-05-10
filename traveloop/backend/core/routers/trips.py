from django.shortcuts import get_object_or_404
from ninja import File, Router, UploadedFile
from ninja_jwt.authentication import JWTAuth

from core.models import Trip
from core.schemas import TripIn, TripOut

router = Router(tags=["trips"], auth=JWTAuth())


@router.get("/", response=list[TripOut])
def list_trips(request):
    return Trip.objects.filter(user=request.user)


@router.post("/", response=TripOut)
def create_trip(request, payload: TripIn, cover_photo: UploadedFile = File(None)):
    trip = Trip.objects.create(user=request.user, **payload.dict())
    if cover_photo:
        trip.cover_photo.save(cover_photo.name, cover_photo, save=True)
    return trip


@router.get("/{trip_id}", response=TripOut)
def get_trip(request, trip_id: int):
    return get_object_or_404(Trip, id=trip_id, user=request.user)


@router.put("/{trip_id}", response=TripOut)
def update_trip(request, trip_id: int, payload: TripIn, cover_photo: UploadedFile = File(None)):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    for field, value in payload.dict().items():
        setattr(trip, field, value)
    if cover_photo:
        trip.cover_photo.save(cover_photo.name, cover_photo, save=False)
    trip.save()
    return trip


@router.delete("/{trip_id}", response={204: None})
def delete_trip(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    trip.delete()
    return 204, None
