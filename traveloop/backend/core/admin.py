from django.contrib import admin

from core.models import (
	Activity,
	BudgetItem,
	City,
	PackingItem,
	Stop,
	StopActivity,
	Trip,
	TripNote,
	User,
)

admin.site.register(User)
admin.site.register(City)
admin.site.register(Activity)
admin.site.register(Trip)
admin.site.register(Stop)
admin.site.register(StopActivity)
admin.site.register(BudgetItem)
admin.site.register(PackingItem)
admin.site.register(TripNote)
