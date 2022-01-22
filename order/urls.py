from django.shortcuts import render
from django.urls.conf import path, re_path

from order.views.web.user import isLoggedIn, register, userLogin, getStatus, getApprovalUser, getMessage, logOut, manageUser
from order.views.web.order import getOrderList, getOrder, addOrder, getOrderWarehouse
from order.views.web.outlet import getOutletList, manageOutlet, getOptionOutletList, addOutlet
from order.views.web.item import addItem, getItemList, getOptionItemList, manageItem
from order.views.web.warehouse import getOptionWarehouseList, getWarehouseList, manageWarehouse, addWarehouse

# pylint: disable=unused-argument
def index(request, **kwargs):
    """Returns main page"""
    return render(request, 'order/index.html')

urlpatterns = [
    path(r'isLoggedIn', isLoggedIn),
    path(r'register', register),
    path(r'login', userLogin),
    path(r'item', addItem),
    path(r'itemList', getItemList),
    path(r'orderList/<str:user_id>', getOrderList),
    path(r'order/warehouse', getOrderWarehouse),
    path(r'order/<str:order_id>', getOrder),
    path(r'order', addOrder),
    path(r'item/<str:item_id>', manageItem),
    path(r'outletList', getOutletList),
    path(r'outlet', addOutlet),
    path(r'outlet/<str:outlet_id>', manageOutlet),
    path(r'approval/user', getApprovalUser),
    path(r'option/item', getOptionItemList),
    path(r'option/outlet', getOptionOutletList),
    path(r'warehouse', addWarehouse),
    path(r'option/warehouse', getOptionWarehouseList),
    path(r'status/<str:user_id>', getStatus),
    path(r'user', manageUser),
    path(r'warehouseList', getWarehouseList),
    path(r'warehouse/<str:warehouse_id>', manageWarehouse),
    path(r'message', getMessage),
    path(r'logout', logOut),

    re_path(r'^(?P<path>.*)/$', index),
    re_path(r'$', index),
]