from ninja import NinjaAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from core.routers.activities import router as activities_router
from core.routers.budgets import router as budgets_router
from core.routers.stops import router as stops_router
from core.routers.trips import router as trips_router

api = NinjaAPI(title="Traveloop API")
api.register_controllers(NinjaJWTDefaultController)

api.add_router("trips", trips_router)
api.add_router("stops", stops_router)
api.add_router("activities", activities_router)
api.add_router("budgets", budgets_router)
