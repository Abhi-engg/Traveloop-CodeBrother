from django.conf import settings
from django.db import models


class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default="planned")
    currency = models.CharField(max_length=3, default="USD")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.user_id})"


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="stops")
    name = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=200, blank=True)
    arrival_date = models.DateField(null=True, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.name} (Trip {self.trip_id})"


class Activity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="activities")
    name = models.CharField(max_length=200)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} (Stop {self.stop_id})"


class Budget(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="budgets")
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="USD")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} (Trip {self.trip_id})"
