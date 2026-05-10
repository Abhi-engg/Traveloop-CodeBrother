from django.contrib import admin

from core.models import Activity, Budget, Stop, Trip

admin.site.register(Trip)
admin.site.register(Stop)
admin.site.register(Activity)
admin.site.register(Budget)
