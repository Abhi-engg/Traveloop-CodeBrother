from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import PackingItem, Trip
from core.schemas import PackingItemIn, PackingItemOut

router = Router(tags=["packing-items"], auth=JWTAuth())


@router.get("/trips/{trip_id}", response=list[PackingItemOut])
def list_packing_items(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return PackingItem.objects.filter(trip=trip).order_by("id")


@router.post("/trips/{trip_id}", response=PackingItemOut)
def create_packing_item(request, trip_id: int, payload: PackingItemIn):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return PackingItem.objects.create(trip=trip, **payload.dict())


@router.put("/{packing_item_id}", response=PackingItemOut)
def update_packing_item(request, packing_item_id: int, payload: PackingItemIn):
    packing_item = get_object_or_404(
        PackingItem, id=packing_item_id, trip__user=request.user
    )
    for field, value in payload.dict().items():
        setattr(packing_item, field, value)
    packing_item.save()
    return packing_item


@router.delete("/{packing_item_id}", response={204: None})
def delete_packing_item(request, packing_item_id: int):
    packing_item = get_object_or_404(
        PackingItem, id=packing_item_id, trip__user=request.user
    )
    packing_item.delete()
    return 204, None
