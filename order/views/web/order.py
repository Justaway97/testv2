
from datetime import timezone
import datetime
import json
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.core.mail import send_mail
from core import settings

from order.models import Item, Order, Order2, OrderDetail, Outlet, Warehouse
from order.views.web.order_detail import addOrderDetail
from order.views.web.serialize import serialize_order2, serialize_order_detail
from order.views.web.shared import generate_error_response

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
    orders = Order.objects.filter(order_by__id=user_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.filter(order_by__id=user_id).count()
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@csrf_exempt
@require_POST
def addOrder(request):
    # add new order
    data = json.loads(request.body)
    outlet = Outlet.objects.get(outlet_name = data['outlet_name'])
    warehouse = Warehouse.objects.get(warehouse_name = data['warehouse_name'])
    user = User.objects.get(id = data['order_by'])
    item = Item.objects.get(item_name = data['item_name'])
    new_order = Order(item_id=item,
                     quantity=data['quantity'],
                   order_date=datetime.datetime.now().date(),
                     order_by=user,
         target_received_date=data['target_received_date'],
                    outlet_id=outlet,
                 order_status=data['order_status'],
                       remark=data['remark'],
                 warehouse_id=warehouse)
    new_order.save()
    return JsonResponse({}, status=200)

@require_GET
def getOrder(request, order_id):
    order = Order.objects.filter(id=order_id).first()
    return JsonResponse({'values': serialize_order(order)}, status=200)

@require_GET
def getOrderWarehouse(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    orders = Order.objects.order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.count()
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@require_GET
def getStatus(request, user_id):
    # size = Order.objects.filter(order_by__id=user_id,
    #                                         =).count()
    return JsonResponse({}, status=200)

# v2

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageOrder(request, order_id):
    # find, update and delete action
    targetOrder = Order2.objects.filter(id=order_id).first()
    targetOrderDetails = OrderDetail.objects.filter(order2_id=order_id)
    if targetOrder and targetOrderDetails:
        if request.method == 'GET':
            serialize = serialize_order2(targetOrder)
            serialize['order_detail'] = [serialize_order_detail(x) for x in targetOrderDetails]
            return JsonResponse({'values': serialize}, status=200)
        if request.method == 'POST':
            # subject = 'welcome to testing world'
            # message = 'Hi songming, testing here.'
            # email_from = settings.EMAIL_HOST_USER
            # # recipient_list = [user.email, ]
            # recipient_list = ['97songming@gmail.com', ]
            # send_mail( subject, message, email_from, recipient_list )
            orderJson = json.loads(request.body)
            outlet = Outlet.objects.get(outlet_name = orderJson['outlet_name'])
            if outlet:
                orderJson['outlet_id'] = outlet
            user = User.objects.get(username = orderJson['order_by'])
            if user:
                orderJson['order_by'] = user
            targetOrder.updateState(orderJson)
            if 'order_detail' in orderJson:
                orderDetailsJson = orderJson['order_detail']
                print(orderDetailsJson)
                orderDetailsIds = []
                for detail in orderDetailsJson:
                    item = Item.objects.get(id=detail['item_id'])
                    print(item, order_id, OrderDetail.objects.filter(item_id=Item.objects.get(id=detail['item_id']), order2_id=order_id))
                    order_detail = OrderDetail.objects.filter(item_id=Item.objects.get(id=detail['item_id']), order2_id=order_id)
                    detail['item_id'] = item
                    if order_detail:
                        order_detail[0].updateState(detail)
                        print(order_detail[0].id)
                        orderDetailsIds.append(order_detail[0].id)
                    else:
                        new_order_detail = addOrderDetail(detail)
                        orderDetailsIds.append(new_order_detail.pk)
                for detail in targetOrderDetails:
                    if not detail.id in orderDetailsIds:
                        OrderDetail.objects.filter(id=detail.id).delete()
            return JsonResponse({}, status=200)
    return generate_error_response('Order not found!', status=404)

@csrf_exempt
@require_POST
def addOrder2(request):
    # add new order
    data = json.loads(request.body)
    print(data)
    outlet = Outlet.objects.get(outlet_name = data['outlet_name'])
    user = User.objects.get(id = data['order_by'])
    new_order = Order2(order_date=datetime.datetime.now().date(),
                         order_by=user,
                    received_date=data['received_date'],
                           remark=data['remark'],
                        outlet_id=outlet)
    new_order.save()
    order_details = data['order_detail']
    print(new_order.id)
    for detail in order_details:
        item = Item.objects.get(id = detail['item_id'])
        new_order_detail = OrderDetail(order2_id=new_order,
                                          item_id=item,
                                         quantity=detail['quantity'],
                                           status=detail['status'])
        new_order_detail.save()
    subject = 'From xxx application'
    users = User.objects.filter(is_staff=True, is_active=True).exclude(email__isnull=True)
    print(users)
    for user in users:
        message = f'Hi {user.username}, {outlet.outlet_name} has created a new order.'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email, ]
        send_mail( subject, message, email_from, recipient_list )
    return JsonResponse({}, status=200)

@require_GET
def getOrder2List(request, id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    if request.GET['findBy'] == 'null' or request.GET['findBy'] == 'user_id':
        print('songmingif')
        orders = Order2.objects.filter(order_by__id=id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
        size = Order2.objects.filter(order_by__id=id).count()
    elif request.GET['findBy'] == 'outlet_id':
        print('songmingelse')
        orders = Order2.objects.filter(outlet_id__id=id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
        size = Order2.objects.filter(outlet_id__id=id).count()
    print(orders, 'songming', size)
    return JsonResponse({'values': [serialize_order2(x) for x in orders], 'size': size}, status=200)

@require_GET
def getOrderDetailList(request, order_id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    orderDetails = OrderDetail.objects.filter(order2_id__id=order_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order2.objects.filter(order2_id__id=order_id).count()
    return JsonResponse({'values': [serialize_order_detail(x) for x in orderDetails], 'size': size}, status=200)

@require_GET
def getDashboard2List(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    orders = Order2.objects.order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order2.objects.order_by(request.GET['orderBy']).count()
    return JsonResponse({'values': [serialize_order2(x) for x in orders], 'size': size}, status=200)