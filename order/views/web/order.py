
from datetime import timezone
import datetime
import json
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from order.models import Item, Order, Outlet, Warehouse

def serialize_order(order):
    # serialize list of order
    # print(order.get('target_received_date').replace(tzinfo=timezone.utc).timestamp())
    res = {
        # 'order_id': order.get('id'),
        # 'item_name': order.get('item_id__item_name'),
        # 'quantity': order.get('quantity'),
        # 'order_date': order.get('order_date').replace(tzinfo=timezone.utc).timestamp(),
        # 'order_by': order.get('order_by__username'),
        # 'target_received_date': order.get('target_received_date').replace(tzinfo=timezone.utc).timestamp(),
        # 'delay_day': order.get('delay_day'),
        # 'outlet_id': order.get('outlet_id__outlet_name'),
        # 'arrived_date': order.get('arrived_date').replace(tzinfo=timezone.utc).timestamp(),
        # 'order_received': order.get('order_received'),
        # 'order_completed': order.get('order_completed'),
        # 'remark': order.get('remark'),
        'order_id': order.id,
        'item_name': order.item_id.item_name,
        'quantity': order.quantity,
        'order_date': order.order_date.replace(tzinfo=timezone.utc).timestamp(),
        'order_by': order.order_by.username,
        'target_received_date': order.target_received_date.replace(tzinfo=timezone.utc).timestamp(),
        'delay_day': order.delay_day,
        'outlet_id': order.outlet_id.outlet_name,
        'arrived_date': order.arrived_date.replace(tzinfo=timezone.utc).timestamp() if order.arrived_date is not None else order.arrived_date,
        'order_received': order.order_received,
        'order_completed': order.order_completed,
        'remark': order.remark,
        # 'warehouse_id': order.warehouse_id,
    }
    return res

@require_GET
def getOrderList(request, user_id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    orders = Order.objects.filter(order_by__id=user_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.filter(order_by__id=user_id).count()
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
                   order_date=datetime.datetime.now(tz=timezone.utc),
                     order_by=user,
         target_received_date=data['target_received_date'],
                    delay_day=data['delay_day'],
                    outlet_id=outlet,
               order_received=data['order_received'],
              order_completed=data['order_completed'],
                       remark=data['remark'],
                 warehouse_id=warehouse)
    new_order.save()
    return JsonResponse({}, status=200)

@require_GET
def getOrder(request, order_id):
    order = Order.objects.filter(id=order_id).first()
    return JsonResponse({'values': serialize_order(order)}, status=200)
