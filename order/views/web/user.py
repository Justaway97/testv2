import json
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from core.settings import MEDIA_ROOT, MEDIA_URL
from django.contrib.auth import login, logout, authenticate
import base64
from PIL import Image
from io import BytesIO
from order.models import Item, MessageTable, Order, Outlet, User, DatabaseLock, Warehouse
from datetime import timezone
import os
from django.db.models import Q
import jwt, datetime

from order.views.web.shared import generate_error_response

class user_key:
    # List of key for user
    ID = 'id'
    USERNAME = 'username'
    PASSWORD = 'password'
    IS_ACTIVE = 'isActive'
    IS_SUPERUSER = 'isSuperuser'
    # LAST_LOGIN_KEY = 'lastLogin'

def serialize_user(user: User):
    data = {
        'id': user.pk,
        'username': user.username,
        'isActive': user.is_active,
    }
    return data

@require_GET
def index(request):
    # for testing purpose
    data = [
        {
            'name': 'sm',
            'value': 'here',
        }
    ]
    return JsonResponse({'values': data})

@require_GET
def isLoggedIn(request):
    # is logged in
    data = [
        {
            'name': 'sm',
            'value': 'here',
        }
    ]
    return JsonResponse({'values': data})

@require_http_methods(['GET', 'POST', 'DELETE'])
def manage_user(request, user_id):
    # manage user
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return generate_error_response('User not found', status=404)
    if request.method == 'GET':
        return JsonResponse(serialize_user(user))
    if request.method == 'POST':
        data = json.loads(request.body)
        if data['approve_by']:
            admin = User.objects.filter(pk=user_id).first()
            if admin:
                if data.get(user_key.PASSWORD, None):
                    user.set_password(data[user_key.PASSWORD])
                    user.save()
                User.objects.filter(pk=user_id).update(
                    username=data[user_key.USERNAME],
                    is_active=True,
                )
                user = User.objects.get(pk=user_id)
                return JsonResponse(serialize_user(user))
        else:
            user.delete()
    if request.method == 'DELETE':
        user.delete()
        return JsonResponse({})
    return JsonResponse({}, status=405)

@csrf_exempt
@require_POST
def register(request):
    # registration
    data = json.loads(request.body)
    user = User.objects.filter(username=data['username']).first()
    if user:
        return generate_error_response('User is exist', status=404)
    new_user = User(username=data['username'],
               is_active=False)
    print(data, request.POST)
    new_user.set_password(data['password'])
    new_user.save()
    return JsonResponse({}, status=200)

@csrf_exempt
@require_POST
def user_login(request):
    # login
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({}, status=200)
    return generate_error_response('Invalid username/password', status=401)


def lockDatabase(tableName):
    lock = DatabaseLock.objects.get(database_name=tableName).first()
    if lock is None:
        new_database_lock = DatabaseLock(database_name=tableName,
                                      is_database_lock=True,
                                    database_lock_time=datetime.datetime.now(tz=timezone.utc),
                                       database_record=1)
        new_database_lock.save()
        return True
    if not lock.is_database_lock or ((datetime.datetime.now(timezone.utc) - lock.database_lock_time).seconds//60)%60 >= 1:
        lock.database_record = lock.database_record + 1
        lock.database_lock_time=datetime.datetime.now(tz=timezone.utc)
        lock.is_table_lock = True
        lock.save()
        return True
    return False

def unlockDatabase(tableName):
    lock = DatabaseLock.objects.get(database_name=tableName).first()
    if lock is None:
        new_database_lock = DatabaseLock(database_name=tableName,
                                      is_database_lock=False,
                                    database_lock_time=datetime.datetime.now(tz=timezone.utc),
                                       database_record=1)
        new_database_lock.save()
        return True
    lock.is_database_lock = False
    lock.database_lock_time=datetime.datetime.now(tz=timezone.utc)
    lock.save()
    return True

def saveImageInFolder(data):
    # save image into media/images folder with <item name>-<package>.png 
    im = Image.open(BytesIO(base64.b64decode(data['image']['content'].split(',')[1])))
    im.save('media/images/' + data['item_name'] + '-' + data['package'] + '.' + data['image']['filename'].split('.')[1], 'PNG')
    return 'images/'+data['item_name'] + '-' + data['package'] + '.' + data['image']['filename'].split('.')[1]

def removeImage(filename):
    if os.path.exists(filename):
        os.remove(filename)

def isItemExist(data, item_id = 0):
    if item_id != 0:
        item = Item.objects.filter(item_name=data['item_name'],
                                     package=data['package']).filter(~Q(id=item_id)).count()
    else:
        item = Item.objects.filter(item_name=data['item_name'],
                                     package=data['package']).count()
    if item:
        return True
    return False

def isOutletExist(data, outlet_id = 0):
    if outlet_id != 0:
        outlet = Outlet.objects.filter(outlet_name=data['outlet_name']).filter(~Q(id=outlet_id)).count()
    else:
        outlet = Outlet.objects.filter(outlet_name=data['outlet_name']).count()
    if outlet:
        return True
    return False

@require_GET
def index(request):
    # for testing purpose
    data = [
        {
            'name': 'sm',
            'value': 'here',
        }
    ]
    return JsonResponse({'values': data})

@csrf_exempt
@require_POST
def getLogin(request):
    # user login
    data = json.loads(request.body)
    username= data['username']
    password= data['password']
    user = User.objects.filter(
        username=username,
        password=password,
        approve_by__isnull=False,
        approve_date__isnull=False).first()
    if user:
        res = {
            'id' : user.pk,
            'access': user.role,
        }
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
        new_token = ''
        for t in token:
            new_token += chr(ord(t)+1)

        print(token, 'old')
        print(new_token, 'new')
        return JsonResponse({'values': res, 'token': token}, status=200)
    
    payload = {
        'id': user.id,
        'exp': datetime.dateime.utcnow() + datetime.timedetal(minutes=60),
        'iat': datetime.datetime.utcnow()
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
    # return the token to front end



    return generate_error_response('Invalid username/password', status=401)

    item_name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=0)
    package = models.CharField(max_length=200)
    image_path = models.ImageField(null=True, blank=True, upload_to='images/')
    remark = models.TextField(null=True)
# def serialize_item(item: Item):
def serialize_item(item, isImageRequired: bool = False):
    # serialize list of item
    res = {
        'item_id': item.pk,
        'item_name': item.item_name,
        'quantity': item.quantity,
        'package': item.package,
        'remark': item.remark,
    }
    if isImageRequired:
        with open('media/' + str(item.image_path), "rb") as img_file:
            res['image'] = base64.b64encode(img_file.read()).decode("utf-8")
    return res

def serialize_outlet(outlet):
    # serialize list of outlet
    res = {
        'outlet_id': outlet.pk,
        'outlet_name': outlet.outlet_name,
        'outlet_address': outlet.outlet_address,
    }
    return res

def serialize_message(message):
    # serialize list of outlet
    res = {
        'message_name': message.message_name,
        'message_description': message.message_description,
    }
    return res

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

def serialize_user(user):
    # serialize list of user
    res = {
        'user_id': user.pk,
        'username': user.username,
        'role': user.role,
        'handphone_number': user.handphone_number,
        'full_name': user.full_name,
        'approve_by': user.approve_by,
        'approve_date': user.approve_date,
    }
    return res

def serialize_warehouse(warehouse):
    res = {
        'warehouse_id': warehouse.pk,
        'warehouse_name': warehouse.warehouse_name,
        'warehouse_address': warehouse.warehouse_address,
    }
    return res

@require_GET
def getItemList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    items = Item.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Item.objects.all().count()
    return JsonResponse({'values': [serialize_item(x) for x in items], 'size': size}, status=200)

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

@csrf_exempt
@require_POST
def addItem(request):
    # add new item
    data = json.loads(request.body)
    if isItemExist(data):
        return generate_error_response('You cannot have two item with same item name and same package', status=409)
    new_item = Item(item_name=data['item_name'],
                     quantity=data['quantity'],
                      package=data['package'],
                   image_path=saveImageInFolder(data))
    new_item.save()
    return JsonResponse({}, status=200)

@csrf_exempt
@require_POST
def addOutlet(request):
    # add new item
    data = json.loads(request.body)
    if isOutletExist(data):
        return generate_error_response('You cannot have two outlet with same item name and same package', status=409)
    new_outlet = Outlet(outlet_name=data['outlet_name'],
                   outlet_address=data['outlet_address'])
    new_outlet.save()
    return JsonResponse({}, status=200)

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageItem(request, item_id):
    # find, update and delete action
    targetItem = Item.objects.get(id=item_id)
    if request.method == 'GET':
        if targetItem:
            return JsonResponse({'values': serialize_item(targetItem,True)}, status=200)
        return generate_error_response('Item not found!', status=404)
    if request.method == 'POST':
        if isItemExist(serialize_item(targetItem), item_id):
            return generate_error_response('You cannot have two item with same item name and same package', status=409)
        if targetItem is None:
            return generate_error_response('Item not found!', status=404)
        removeImage('media/' + str(targetItem.image_path))
        data = json.loads(request.body)
        targetItem.item_name = data['item_name']
        targetItem.quantity = data['quantity']
        targetItem.package = data['package']
        targetItem.image_path = saveImageInFolder(data)
        targetItem.remark = data['remark']
        targetItem.save()
        # return JsonResponse({}, status=200) all update function shouldnt return value back front end
        return JsonResponse({'values': serialize_item(targetItem,True)}, status=200)
    return generate_error_response({}, status=405)

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageOutlet(request, outlet_id):
    # find, update and delete action
    targetOutlet = Outlet.objects.get(id=outlet_id)
    if request.method == 'GET':
        if targetOutlet:
            return JsonResponse({'values': serialize_outlet(targetOutlet)}, status=200)
        return generate_error_response('Item not found!', status=404)
    if request.method == 'POST':
        if isOutletExist(serialize_outlet(targetOutlet), outlet_id):
            return generate_error_response('You cannot have two outlet with same name', status=409)
        if targetOutlet is None:
            return generate_error_response('outlet not found!', status=404)
        targetOutlet.updateState(json.loads(request.body))
        return JsonResponse({}, status=200)
    return generate_error_response({}, status=405)

@require_GET
def getOutletList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    outlets = Outlet.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Outlet.objects.all().count()
    return JsonResponse({'values': [serialize_outlet(x) for x in outlets], 'size': size}, status=200)

@require_GET
def getOrderList(request, user_id):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    orders = Order.objects.filter(order_by__id=user_id).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.filter(order_by__id=user_id).count()
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@require_GET
def getOrder(request, order_id):
    order = Order.objects.filter(id=order_id).first()
    return JsonResponse({'values': serialize_order(order)}, status=200)

@require_GET
def getOrderStatistic(request, user_id):
    # get order today
    today = datetime.datetime.now(tz=timezone.utc)
    orderToday = Order.objects.filter(order_by__id=user_id,
                                      order_date__day=today.day,
                                      order_date__month=today.month,
                                      order_date__year=today.year).count()
    # get pending order to received today
    orderPending = Order.objects.filter(order_by__id=user_id,
                                        order_completed=False,
                                        target_received_date__day=today.day,
                                        target_received_date__month=today.month,
                                        target_received_date__year=today.year).count()
    # get order received today
    orderReceived = Order.objects.filter(order_by__id=user_id,
                                        order_completed=True,
                                        arrived_date__day=today.day,
                                        arrived_date__month=today.month,
                                        arrived_date__year=today.year).count()
    # get order delay
    orderDelay = Order.objects.filter(order_by__id=user_id,
                                      delay_day__gte=0,
                                      order_completed=False).count()
    res = [
      {
        'title': 'Order Today',
        'value': orderToday,
      },
      {
        'title': 'Order Pending To Reach Today',
        'value': orderPending,
      },
      {
        'title': 'Order Received Today',
        'value': orderReceived,
      },
      {
        'title': 'Order Delay',
        'value': orderDelay,
      },
    ]
    if orderToday >= 0 and orderPending >= 0 and orderReceived >= 0 and orderDelay >= 0:
        return JsonResponse({'values': res }, status=200)
    return JsonResponse({}, status=404)

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def getApprovalUserList(request):
    if request.method == 'GET':
        users = User.objects.filter(approve_by__isnull=True)
        return JsonResponse({'values': [serialize_user(x) for x in users]}, status=200)
    if request.method == 'POST':
        data = json.loads(request.body)
        usernames = data['usernames']
        approveBy = data['approveBy']
        for username in usernames:
            user = User.objects.get(username=username)
            user.approve_by = approveBy
            user.approve_date = datetime.datetime.now(tz=timezone.utc)
            user.save()
        return JsonResponse({}, status=200)
    return JsonResponse({}, status=404)

@require_GET
def getOrderWarehouse(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    orders = Order.objects.filter(order_completed=False).order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Order.objects.filter(order_completed=False).count()
    return JsonResponse({'values': [serialize_order(x) for x in orders], 'size': size}, status=200)

@require_GET
def getOptionItemList(request):
    items = Item.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'item_name':x.item_name} for x in items]}, status=200)

@require_GET
def getOptionOutletList(request):
    outlets = Outlet.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'outlet_name':x.outlet_name} for x in outlets]}, status=200)

@require_GET
def getOptionWarehouseList(request):
    warehouses = Warehouse.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'warehouse_name':x.warehouse_name} for x in warehouses]}, status=200)

@csrf_exempt
@require_POST
def logOut(request):
    response = JsonResponse({})
    response.delete_cookie('csrftoken')
    return response

@require_GET
def getMessage(request):
    messages = MessageTable.objects.all()
    return JsonResponse({'values': [serialize_message(x) for x in messages]}, status=200)

@require_GET
def getWarehouseList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    warehouses = Warehouse.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Warehouse.objects.all().count()
    return JsonResponse({'values': [serialize_warehouse(x) for x in warehouses], 'size': size}, status=200)
