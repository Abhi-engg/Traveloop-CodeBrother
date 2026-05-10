import os
import django
from django.utils import timezone
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveloop.settings')
django.setup()

from core.models import User, City, Activity, Trip, Stop, StopActivity, BudgetItem
from django.contrib.auth import get_user_model

# Get or create admin user
User = get_user_model()
admin_user, _ = User.objects.get_or_create(username="admin", defaults={"email": "admin@example.com", "is_staff": True, "is_superuser": True})
if _:
    admin_user.set_password("password")
    admin_user.save()

# Create Cities
jaipur, _ = City.objects.get_or_create(name="Jaipur", country="India", defaults={"cost_index": 50, "popularity": 90})
udaipur, _ = City.objects.get_or_create(name="Udaipur", country="India", defaults={"cost_index": 55, "popularity": 85})
jodhpur, _ = City.objects.get_or_create(name="Jodhpur", country="India", defaults={"cost_index": 45, "popularity": 80})
jaisalmer, _ = City.objects.get_or_create(name="Jaisalmer", country="India", defaults={"cost_index": 40, "popularity": 75})

kochi, _ = City.objects.get_or_create(name="Kochi", country="India", defaults={"cost_index": 60, "popularity": 85})
alleppey, _ = City.objects.get_or_create(name="Alleppey", country="India", defaults={"cost_index": 65, "popularity": 90})
munnar, _ = City.objects.get_or_create(name="Munnar", country="India", defaults={"cost_index": 55, "popularity": 85})

manali, _ = City.objects.get_or_create(name="Manali", country="India", defaults={"cost_index": 60, "popularity": 95})
leh, _ = City.objects.get_or_create(name="Leh", country="India", defaults={"cost_index": 70, "popularity": 85})


# Create Activities
activities_data = [
    {"city": jaipur, "name": "Dal Baati Churma Thali", "category": "food", "cost": 350, "duration": 1},
    {"city": jaipur, "name": "Amer Fort Tour", "category": "sightseeing", "cost": 500, "duration": 3},
    {"city": jaipur, "name": "Hawa Mahal Walk", "category": "tour", "cost": 200, "duration": 1.5},
    {"city": jaipur, "name": "Nahargarh Fort Sunset", "category": "nature", "cost": 300, "duration": 2},
    {"city": jaipur, "name": "Johari Bazaar Shopping", "category": "shopping", "cost": 1500, "duration": 2},
    {"city": jaipur, "name": "Chokhi Dhani Village", "category": "nightlife", "cost": 1200, "duration": 4},
]

activity_objs = {}
for act in activities_data:
    obj, _ = Activity.objects.get_or_create(
        city=act["city"],
        name=act["name"],
        defaults={"category": act["category"], "avg_cost_usd": act["cost"], "duration_hours": act["duration"]}
    )
    activity_objs[act["name"]] = obj

# Create Trips
trip1, _ = Trip.objects.get_or_create(
    user=admin_user,
    name="Rajasthan Royal Route",
    defaults={
        "description": "Jaipur → Udaipur → Jodhpur → Jaisalmer",
        "start_date": datetime(2026, 6, 15).date(),
        "end_date": datetime(2026, 6, 28).date(),
        "budget_total": 45000,
        "mood_tag": "Heritage & Culture",
        "cover_photo": "trip_covers/rajasthan.jpg"
    }
)

trip2, _ = Trip.objects.get_or_create(
    user=admin_user,
    name="Kerala Backwaters",
    defaults={
        "description": "Kochi → Alleppey → Munnar → Thekkady",
        "start_date": datetime(2026, 9, 5).date(),
        "end_date": datetime(2026, 9, 14).date(),
        "budget_total": 35000,
        "mood_tag": "Nature & Wellness",
        "cover_photo": "trip_covers/kerala.jpg"
    }
)

# Add Stops for Trip 1
stop1, _ = Stop.objects.get_or_create(trip=trip1, city=jaipur, order=1, defaults={"arrival_date": trip1.start_date, "departure_date": trip1.start_date + timedelta(days=3)})
stop2, _ = Stop.objects.get_or_create(trip=trip1, city=udaipur, order=2, defaults={"arrival_date": trip1.start_date + timedelta(days=3), "departure_date": trip1.start_date + timedelta(days=6)})

# Add Stop Activities
StopActivity.objects.get_or_create(stop=stop1, activity=activity_objs["Dal Baati Churma Thali"], defaults={"actual_cost": 350})
StopActivity.objects.get_or_create(stop=stop1, activity=activity_objs["Amer Fort Tour"], defaults={"actual_cost": 500})
StopActivity.objects.get_or_create(stop=stop1, activity=activity_objs["Hawa Mahal Walk"], defaults={"actual_cost": 200})

# Add Budget Items
BudgetItem.objects.get_or_create(trip=trip1, stop=stop1, category="Lodging", label="Hotel in Jaipur", defaults={"amount": 12000, "is_estimated": False})
BudgetItem.objects.get_or_create(trip=trip1, stop=stop1, category="Food", label="Food in Jaipur", defaults={"amount": 6500, "is_estimated": True})

# Mock Users for Admin Dashboard
users_data = [
    {"username": "aarav", "email": "aarav.sharma@gmail.com", "first_name": "Aarav", "last_name": "Sharma"},
    {"username": "priya", "email": "priya.patel@gmail.com", "first_name": "Priya", "last_name": "Patel"},
    {"username": "rohan", "email": "rohan.mehta@outlook.com", "first_name": "Rohan", "last_name": "Mehta"},
    {"username": "ananya", "email": "ananya.r@gmail.com", "first_name": "Ananya", "last_name": "Reddy"},
]
for u in users_data:
    User.objects.get_or_create(username=u["username"], defaults={"email": u["email"], "first_name": u["first_name"], "last_name": u["last_name"]})

print("Successfully seeded the database with India mock data!")
