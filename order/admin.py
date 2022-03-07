from os import access
from django.contrib import admin

from order.models import Access, Item, Order2, OrderDetail, Outlet, Role, UserProfile, ReportTemplate

# Register your models here.
admin.site.register(Item)
admin.site.register(Outlet)
admin.site.register(Order2)
admin.site.register(OrderDetail)

class AccessAdmin(admin.ModelAdmin):
    search_fields = ['description']

admin.site.register(Access, AccessAdmin)

class RoleAdmin(admin.ModelAdmin):
    search_fields = ['code']
    autocomplete_fields = ['access']

admin.site.register(Role, RoleAdmin)

class UserProfileAdmin(admin.ModelAdmin):
    autocomplete_fields = ['role']

admin.site.register(UserProfile, UserProfileAdmin)

admin.site.register(ReportTemplate)