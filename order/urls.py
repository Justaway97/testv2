from django.shortcuts import render
from django.urls.conf import path, re_path

from order.views.web.user import isLoggedIn, register, userLogin, getStatus, getApprovalUser, logOut, manageUser
from order.views.web.order import getOrderList, getOrder, addOrder, getOrderWarehouse, manageOrder, getOrder2List, addOrder2, getOrderDetailList, getDashboard2List
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
    path(r'logout', logOut),
    path(r'order2/<str:order_id>', manageOrder),
    path(r'order2', addOrder2),
    path(r'order2List/<str:id>', getOrder2List),
    path(r'orderDetailList', getOrderDetailList),
    path(r'dashboard2', getDashboard2List),

    re_path(r'^(?P<path>.*)/$', index),
    re_path(r'$', index),
]