
from datetime import timezone
import datetime
import json
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.core.mail import send_mail
from core import settings
from django.contrib.auth.decorators import login_required

from order.models import Item, Order2, OrderDetail, Outlet
from order.views.web.order_detail import addOrderDetail
from order.views.web.serialize import serialize_order2, serialize_order_detail
from order.views.web.shared import emailTo, generate_error_response

# v2
@login_required
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
                orderDetailsIds = []
                for detail in orderDetailsJson:
                    if targetOrder.status == 'CAN' or targetOrder.status == 'C':
                        detail['status'] = targetOrder.status
                    order_detail = OrderDetail.objects.filter(item_id=Item.objects.get(id=detail['item_id']), order2_id=order_id)
                    detail['item_id'] = Item.objects.filter(id=detail['item_id']).first()
                    detail['order2_id'] = targetOrder
                    if order_detail:
                        order_detail[0].updateState(detail)
                        orderDetailsIds.append(order_detail[0].id)
                    else:
                        new_order_detail = addOrderDetail(request, detail)
                        orderDetailsIds.append(new_order_detail.pk)
                for detail in targetOrderDetails:
                    if not detail.id in orderDetailsIds:
                        OrderDetail.objects.filter(id=detail.id).delete()
                if targetOrder.status == 'CAN':
                    message = f'{user.username} has cancel order {targetOrder.id} for {outlet.outlet_name}.'
                    emailTo(message)
            return JsonResponse({}, status=200)
    return generate_error_response('Order not found!', status=404)

@login_required
@csrf_exempt
@require_POST
def addOrder2(request):
    # add new order
    data = json.loads(request.body)
    outlet = Outlet.objects.get(outlet_name = data['outlet_name'])
    user = User.objects.get(id = data['order_by'])
    new_order = Order2(order_date=datetime.datetime.now().date(),
                         order_by=user,
                    received_date=data['received_date'],
                           remark=data['remark'],
                        outlet_id=outlet)
    new_order.save()
    order_details = data['order_detail']
    for detail in order_details:
        item = Item.objects.get(id = detail['item_id'])
        new_order_detail = OrderDetail(order2_id=new_order,
                                          item_id=item,
                                         quantity=detail['quantity'],
                                           status=detail['status'])
        new_order_detail.save()
    message = f'{user.username} has created a new order for {outlet.outlet_name}.'
    emailTo(message)
    return JsonResponse({}, status=200)

@login_required
@require_GET
def getOrder2List(request, id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    if request.GET['findBy'] == 'null' or request.GET['findBy'] == 'user_id':
        orders = Order2.objects.filter(order_by__id=id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
        size = Order2.objects.filter(order_by__id=id).count()
    elif request.GET['findBy'] == 'outlet_id':
        orders = Order2.objects.filter(outlet_id__id=id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
        size = Order2.objects.filter(outlet_id__id=id).count()
    return JsonResponse({'values': [serialize_order2(x) for x in orders], 'size': size}, status=200)

@login_required
@require_GET
def getOrderDetailList(request, order_id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    orderDetails = OrderDetail.objects.filter(order2_id__id=order_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order2.objects.filter(order2_id__id=order_id).count()
    return JsonResponse({'values': [serialize_order_detail(x) for x in orderDetails], 'size': size}, status=200)

@login_required
@require_GET
def getDashboard2List(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    orders = Order2.objects.raw(
        'select * from order_order2 order by '+ request.GET['orderBy'] + ' offset ' + str(offset) +
        ' rows fetch first ' + request.GET['pageSize'] + ' rows only')
    size = Order2.objects.order_by(request.GET['orderBy']).count()
    return JsonResponse({'values': [serialize_order2(x) for x in orders], 'size': size}, status=200)

@login_required
@csrf_exempt
@require_POST
def cancelOrder2(request, order_id):
    # cancel order
    Order2.objects.filter(id=order_id).update(status='CAN')
    OrderDetail.objects.filter(order2_id=order_id).update(status='CAN')
    order = Order2.objects.filter(id=order_id).first()
    return JsonResponse({'id':serialize_order2(order)['outlet_id']}, status=202)
