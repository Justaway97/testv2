
from datetime import timezone
import datetime
import json
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from order.models import Item, Order, Outlet, Warehouse

def serialize_order(order):
    res = {
        'order_id': order.id,
        'item_name': order.item_id.item_name,
        'quantity': order.quantity,
        'order_date': datetime.datetime.timestamp(order.order_date),
        'order_by': order.order_by.username,
        'target_received_date': datetime.datetime.timestamp(order.target_received_date),
        'outlet_id': order.outlet_id.outlet_name,
        'arrived_date': datetime.datetime.timestamp(order.arrived_date) if order.arrived_date is not None else order.arrived_date,
        'order_status': order.order_status,
        'remark': order.remark,
        'warehouse_name': order.warehouse_id.warehouse_name,
    }
    return res

@require_GET
def getOrderList(request, user_id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset, user_id, request)
    orders = Order.objects.filter(order_by__id=user_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.filter(order_by__id=user_id).count()
    for order in orders:
        print(order.order_date, datetime.datetime.timestamp(order.order_date))
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@csrf_exempt
@require_POST
def addOrder(request):
    # add new order
    data = json.loads(request.body)
    print(data)
    outlet = Outlet.objects.get(outlet_name = data['outlet_name'])
    warehouse = Warehouse.objects.get(warehouse_name = data['warehouse_name'])
    user = User.objects.get(id = data['order_by'])
    item = Item.objects.get(item_name = data['item_name'])
    new_order = Order(item_id=item,
                     quantity=data['quantity'],
                   order_date=timezone.now,
                     order_by=user,
         target_received_date=data['target_received_date'],
                    outlet_id=outlet,
                 order_status=data['order_status'],
                       remark=data['remark'],
                 warehouse_id=warehouse)
    print(new_order)
    new_order.save()
    return JsonResponse({}, status=200)

@require_GET
def getOrder(request, order_id):
    order = Order.objects.filter(id=order_id).first()
    return JsonResponse({'values': serialize_order(order)}, status=200)

@require_GET
def getOrderWarehouse(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    orders = Order.objects.order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.count()
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@require_GET
def getStatus(request, user_id):
    # size = Order.objects.filter(order_by__id=user_id,
    #                                         =).count()
    return JsonResponse({}, status=200)