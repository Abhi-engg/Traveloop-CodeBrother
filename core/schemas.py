from datetime import date, datetime
from decimal import Decimal

from ninja import Schema


class TripIn(Schema):
    name: str
    start_date: date
    end_date: date | None = None
    status: str = "planned"
    currency: str = "USD"


class TripOut(TripIn):
    id: int
    created_at: datetime
    updated_at: datetime


class StopIn(Schema):
    name: str
    order: int = 0
    location: str | None = ""
    arrival_date: date | None = None
    departure_date: date | None = None


class StopOut(StopIn):
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime


class ActivityIn(Schema):
    name: str
    start_time: datetime | None = None
    end_time: datetime | None = None
    cost: Decimal = 0
    notes: str | None = ""


class ActivityOut(ActivityIn):
    id: int
    stop_id: int
    created_at: datetime
    updated_at: datetime


class BudgetIn(Schema):
    name: str
    amount: Decimal
    spent: Decimal = 0
    currency: str = "USD"


class BudgetOut(BudgetIn):
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime
