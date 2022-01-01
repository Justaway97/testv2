from django.contrib import admin

from order.models import DatabaseLock, Item, MessageTable, Order, Outlet, Token, User, Warehouse

# Register your models here.
admin.site.register(User)
admin.site.register(Item)
admin.site.register(Outlet)
admin.site.register(Order)
admin.site.register(Warehouse)
admin.site.register(Token)
admin.site.register(DatabaseLock)
admin.site.register(MessageTable)