from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from core.routers.activities import router as activities_router
from core.routers.budgets import router as budgets_router
from core.routers.cities import router as cities_router
from core.routers.dashboard import router as dashboard_router
from core.routers.google_auth import router as google_auth_router
from core.routers.packing_items import router as packing_items_router
from core.routers.stop_activities import router as stop_activities_router
from core.routers.stops import router as stops_router
from core.routers.trip_notes import router as trip_notes_router
from core.routers.trips import router as trips_router

api = NinjaExtraAPI(title="Traveloop API")
api.register_controllers(NinjaJWTDefaultController)

api.add_router("dashboard", dashboard_router)
api.add_router("trips", trips_router)
api.add_router("stops", stops_router)
api.add_router("activities", activities_router)
api.add_router("cities", cities_router)
api.add_router("auth", google_auth_router)
api.add_router("stop-activities", stop_activities_router)
api.add_router("budget-items", budgets_router)
api.add_router("packing-items", packing_items_router)
api.add_router("notes", trip_notes_router)
