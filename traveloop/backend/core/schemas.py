from datetime import date, time

from ninja import Schema


class UserOut(Schema):
    id: int
    username: str
    email: str
    mood_profile: dict
    language: str | None = None


class CityIn(Schema):
    name: str
    country: str
    cost_index: float = 0
    popularity: int = 0


class CityOut(CityIn):
    id: int


class ActivityIn(Schema):
    name: str
    category: str | None = ""
    avg_cost_usd: float = 0
    duration_hours: float = 0


class ActivityOut(ActivityIn):
    id: int
    city_id: int


class TripIn(Schema):
    name: str
    start_date: date
    end_date: date | None = None
    budget_total: float = 0
    visibility: str = "private"
    mood_tag: str | None = ""
    share_token: str | None = None


class TripOut(TripIn):
    id: int
    user_id: int


class StopIn(Schema):
    city_id: int
    order: int = 0
    arrival_date: date | None = None
    departure_date: date | None = None


class StopOut(StopIn):
    id: int
    trip_id: int


class StopActivityIn(Schema):
    activity_id: int
    scheduled_time: time | None = None
    actual_cost: float = 0
    is_done: bool = False


class StopActivityOut(StopActivityIn):
    id: int
    stop_id: int


class BudgetItemIn(Schema):
    stop_id: int | None = None
    category: str | None = ""
    label: str | None = ""
    amount: float = 0
    is_estimated: bool = True


class BudgetItemOut(BudgetItemIn):
    id: int
    trip_id: int


class PackingItemIn(Schema):
    label: str
    category: str | None = ""
    is_packed: bool = False


class PackingItemOut(PackingItemIn):
    id: int
    trip_id: int


class TripNoteIn(Schema):
    stop_id: int | None = None
    title: str
    body: str | None = ""


class TripNoteOut(TripNoteIn):
    id: int
    trip_id: int
