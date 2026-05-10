from datetime import date

from django.db.models import Count, Sum
from ninja import Router, Schema
from ninja_jwt.authentication import JWTAuth

from core.models import BudgetItem, City, Trip
from core.schemas import CityOut, TripOut


class BudgetSummaryOut(Schema):
    total_estimated: float = 0
    total_actual: float = 0
    category_breakdown: list[dict] = []


class DashboardOut(Schema):
    username: str
    recent_trips: list[TripOut] = []
    upcoming_trip: TripOut | None = None
    total_trips: int = 0
    recommended_cities: list[CityOut] = []
    budget_summary: BudgetSummaryOut = BudgetSummaryOut()


router = Router(tags=["dashboard"], auth=JWTAuth())


@router.get("/", response=DashboardOut)
def get_dashboard(request):
    """
    Aggregated dashboard endpoint — returns everything the home screen needs
    in a single API call to minimize frontend requests.
    """
    user = request.user
    today = date.today()

    # ── Recent trips (latest 5) ──────────────────────────────
    all_trips = Trip.objects.filter(user=user)
    recent_trips = list(all_trips[:5])

    # ── Upcoming trip (next trip with start_date >= today) ────
    upcoming_trip = (
        Trip.objects.filter(user=user, start_date__gte=today)
        .order_by("start_date")
        .first()
    )

    # ── Budget summary across all user trips ─────────────────
    budget_items = BudgetItem.objects.filter(trip__user=user)
    total_estimated = (
        budget_items.filter(is_estimated=True).aggregate(s=Sum("amount"))["s"] or 0
    )
    total_actual = (
        budget_items.filter(is_estimated=False).aggregate(s=Sum("amount"))["s"] or 0
    )

    # Category breakdown (top 5 categories by amount)
    category_breakdown = list(
        budget_items.values("category")
        .annotate(total=Sum("amount"), count=Count("id"))
        .order_by("-total")[:5]
    )

    # ── Recommended cities (most popular, limit 6) ───────────
    recommended_cities = list(City.objects.order_by("-popularity", "name")[:6])

    return DashboardOut(
        username=user.username,
        recent_trips=recent_trips,
        upcoming_trip=upcoming_trip,
        total_trips=all_trips.count(),
        recommended_cities=recommended_cities,
        budget_summary=BudgetSummaryOut(
            total_estimated=total_estimated,
            total_actual=total_actual,
            category_breakdown=category_breakdown,
        ),
    )
