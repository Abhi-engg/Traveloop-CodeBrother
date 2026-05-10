from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import Stop, Trip, TripNote
from core.schemas import TripNoteIn, TripNoteOut

router = Router(tags=["notes"], auth=JWTAuth())


@router.get("/trips/{trip_id}", response=list[TripNoteOut])
def list_notes(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return TripNote.objects.filter(trip=trip).order_by("-id")


@router.post("/trips/{trip_id}", response=TripNoteOut)
def create_note(request, trip_id: int, payload: TripNoteIn):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    stop = None
    if payload.stop_id:
        stop = get_object_or_404(Stop, id=payload.stop_id, trip=trip)
    return TripNote.objects.create(trip=trip, stop=stop, **payload.dict(exclude={"stop_id"}))


@router.put("/{note_id}", response=TripNoteOut)
def update_note(request, note_id: int, payload: TripNoteIn):
    note = get_object_or_404(TripNote, id=note_id, trip__user=request.user)
    if payload.stop_id is not None:
        note.stop = (
            get_object_or_404(Stop, id=payload.stop_id, trip=note.trip)
            if payload.stop_id
            else None
        )
    for field, value in payload.dict(exclude={"stop_id"}).items():
        setattr(note, field, value)
    note.save()
    return note


@router.delete("/{note_id}", response={204: None})
def delete_note(request, note_id: int):
    note = get_object_or_404(TripNote, id=note_id, trip__user=request.user)
    note.delete()
    return 204, None
