import json
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from core.settings import MEDIA_ROOT, MEDIA_URL
from django.contrib.auth import login, logout, authenticate
from order.models import MessageTable, DatabaseLock, Order, Warehouse
from datetime import timezone
import os
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

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageUser(request):
    # manage user
    data = json.loads(request.body)
    if data:
        if request.method == 'GET':
            user = User.objects.filter(username=data['username']).first()
            if not user:
                return generate_error_response('User not found', status=404)
            return JsonResponse(serialize_user(user))
        if request.method == 'POST':
            data = json.loads(request.body)
            usernames = data['usernames']
            if data['action'] == 'approve':
                for username in usernames:
                    User.objects.filter(username=username).update(
                        is_active=True,
                    )
                return JsonResponse({}, status=200)
            else:
                for username in usernames:
                    user = User.objects.filter(username=data['username']).first()
                    if user:
                        user.delete()
        if request.method == 'DELETE':
            user = User.objects.filter(username=data['username']).first()
            if user:
                user.delete()
            return JsonResponse({}, status=200)
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
def userLogin(request):
    # login
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        res = {
            'id': user.id,
            'username': username
        }
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')
        return JsonResponse({'values': res, 'token': token}, status=200)
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
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
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

def serialize_message(message):
    # serialize list of outlet
    res = {
        'message_name': message.message_name,
        'message_description': message.message_description,
    }
    return res

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
@require_http_methods(['GET'])
def getApprovalUser(request):
    if request.method == 'GET':
        users = User.objects.filter(is_active=False)
        return JsonResponse({'values': [serialize_user(x) for x in users]}, status=200)
    return JsonResponse({}, status=404)

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
