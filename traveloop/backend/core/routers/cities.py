from django.shortcuts import get_object_or_404
from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.models import City
from core.schemas import CityIn, CityOut

router = Router(tags=["cities"], auth=JWTAuth())


@router.get("/", response=list[CityOut])
def list_cities(request):
    return City.objects.order_by("name", "id")


@router.post("/", response=CityOut)
def create_city(request, payload: CityIn):
    return City.objects.create(**payload.dict())


@router.put("/{city_id}", response=CityOut)
def update_city(request, city_id: int, payload: CityIn):
    city = get_object_or_404(City, id=city_id)
    for field, value in payload.dict().items():
        setattr(city, field, value)
    city.save()
    return city


@router.delete("/{city_id}", response={204: None})
def delete_city(request, city_id: int):
    city = get_object_or_404(City, id=city_id)
    city.delete()
    return 204, None
