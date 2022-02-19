from os import access
from django.contrib import admin

from order.models import Access, DatabaseLock, Item, Order, Order2, OrderDetail, Outlet, Token, UserProfile

# Register your models here.
admin.site.register(Item)
admin.site.register(Outlet)
admin.site.register(Order)
admin.site.register(Token)
admin.site.register(DatabaseLock)
admin.site.register(Order2)
admin.site.register(OrderDetail)
admin.site.register(UserProfile)
admin.site.register(Access)