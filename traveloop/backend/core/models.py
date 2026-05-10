from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    mood_profile = models.JSONField(default=dict, blank=True)
    dna_embedding = models.JSONField(null=True, blank=True)
    language = models.CharField(max_length=50, blank=True)

    def __str__(self) -> str:
        return self.username


class City(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    cost_index = models.FloatField(default=0)
    popularity = models.IntegerField(default=0)
    embedding = models.JSONField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name}, {self.country}"


class Activity(models.Model):
    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="activities", null=True, blank=True
    )
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True)
    avg_cost_usd = models.FloatField(default=0)
    duration_hours = models.FloatField(default=0)
    embedding = models.JSONField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.city_id})"


class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    cover_photo = models.ImageField(upload_to="trip_covers/", null=True, blank=True)
    budget_total = models.FloatField(default=0)
    visibility = models.CharField(max_length=50, default="private")
    share_token = models.UUIDField(null=True, blank=True)
    mood_tag = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self) -> str:
        return f"{self.name} ({self.user_id})"


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="stops")
    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="stops", null=True, blank=True
    )
    order = models.IntegerField(default=0)
    arrival_date = models.DateField(null=True, blank=True)
    departure_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"Stop {self.id} (Trip {self.trip_id})"


class StopActivity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="stop_activities")
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="stop_activities"
    )
    scheduled_time = models.TimeField(null=True, blank=True)
    actual_cost = models.FloatField(default=0)
    is_done = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"StopActivity {self.id}"


class BudgetItem(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="budget_items")
    stop = models.ForeignKey(
        Stop, on_delete=models.SET_NULL, null=True, blank=True, related_name="budget_items"
    )
    category = models.CharField(max_length=100, blank=True)
    label = models.CharField(max_length=200, blank=True)
    amount = models.FloatField(default=0)
    is_estimated = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.label} ({self.trip_id})"


class PackingItem(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="packing_items")
    label = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True)
    is_packed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.label} ({self.trip_id})"


class TripNote(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="notes")
    stop = models.ForeignKey(
        Stop, on_delete=models.SET_NULL, null=True, blank=True, related_name="notes"
    )
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.trip_id})"
