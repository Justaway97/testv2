from django.shortcuts import render
from django.urls.conf import path, re_path

from order.views.web.user import isLoggedIn, register, userLogin, logOut, manageUser
from order.views.web.order import manageOrder, getOrder2List, addOrder2, getOrderDetailList, getDashboard2List, cancelOrder2
from order.views.web.outlet import getOutletList
from order.views.web.item import getOptionItemList
# from order.views.web.warehouse import getOptionWarehouseList, getWarehouseList, manageWarehouse, addWarehouse

# pylint: disable=unused-argument
def index(request, **kwargs):
    """Returns main page"""
    return render(request, 'order/index.html')

urlpatterns = [
    path(r'isLoggedIn/<str:username>', isLoggedIn),
    path(r'register', register),
    path(r'login', userLogin),
    path(r'outletList', getOutletList),
    path(r'option/item', getOptionItemList),
    path(r'user', manageUser),
    path(r'logout', logOut),
    path(r'order2/<str:order_id>', manageOrder),
    path(r'can/order2/<str:order_id>', cancelOrder2),
    path(r'order2', addOrder2),
    path(r'order2List/<str:id>', getOrder2List),
    path(r'orderDetailList', getOrderDetailList),
    path(r'dashboard2', getDashboard2List),

    re_path(r'^(?P<path>.*)/$', index),
    re_path(r'$', index),
]