from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import BudgetItem, Stop, Trip
from core.schemas import BudgetItemIn, BudgetItemOut

router = Router(tags=["budget-items"], auth=JWTAuth())


@router.get("/trips/{trip_id}", response=list[BudgetItemOut])
def list_budget_items(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return BudgetItem.objects.filter(trip=trip).order_by("id")


@router.post("/trips/{trip_id}", response=BudgetItemOut)
def create_budget_item(request, trip_id: int, payload: BudgetItemIn):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    stop = None
    if payload.stop_id:
        stop = get_object_or_404(Stop, id=payload.stop_id, trip=trip)
    return BudgetItem.objects.create(trip=trip, stop=stop, **payload.dict(exclude={"stop_id"}))


@router.put("/{budget_item_id}", response=BudgetItemOut)
def update_budget_item(request, budget_item_id: int, payload: BudgetItemIn):
    budget_item = get_object_or_404(
        BudgetItem, id=budget_item_id, trip__user=request.user
    )
    if payload.stop_id is not None:
        budget_item.stop = (
            get_object_or_404(Stop, id=payload.stop_id, trip=budget_item.trip)
            if payload.stop_id
            else None
        )
    for field, value in payload.dict(exclude={"stop_id"}).items():
        setattr(budget_item, field, value)
    budget_item.save()
    return budget_item


@router.delete("/{budget_item_id}", response={204: None})
def delete_budget_item(request, budget_item_id: int):
    budget_item = get_object_or_404(
        BudgetItem, id=budget_item_id, trip__user=request.user
    )
    budget_item.delete()
    return 204, None
