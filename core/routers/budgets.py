from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import Budget, Trip
from core.schemas import BudgetIn, BudgetOut

router = Router(tags=["budgets"], auth=JWTAuth())


@router.get("/trips/{trip_id}", response=list[BudgetOut])
def list_budgets(request, trip_id: int):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return Budget.objects.filter(trip=trip).order_by("id")


@router.post("/trips/{trip_id}", response=BudgetOut)
def create_budget(request, trip_id: int, payload: BudgetIn):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    return Budget.objects.create(trip=trip, **payload.dict())


@router.put("/{budget_id}", response=BudgetOut)
def update_budget(request, budget_id: int, payload: BudgetIn):
    budget = get_object_or_404(Budget, id=budget_id, trip__user=request.user)
    for field, value in payload.dict().items():
        setattr(budget, field, value)
    budget.save()
    return budget


@router.delete("/{budget_id}", response={204: None})
def delete_budget(request, budget_id: int):
    budget = get_object_or_404(Budget, id=budget_id, trip__user=request.user)
    budget.delete()
    return 204, None
