import json
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from core.settings import MEDIA_ROOT, MEDIA_URL
from django.contrib.auth import login, logout, authenticate
from datetime import timezone
import os
import jwt, datetime
from order.models import Role, UserProfile

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
def isLoggedIn(request, username):
    authenticate = request.user.is_authenticated
    return JsonResponse({'isLogIn': authenticate}, status=200 if authenticate else 400)

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
                    email=data['email'],
                    is_active=False)
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
        userProfile = UserProfile.objects.filter(user=user).first()
        roles = userProfile.role.all()
        userAccess = []
        userRoles = []
        for role in roles:
            roleObj = Role.objects.filter(code=role.code).first()
            accesses = roleObj.access.all()
            for access in accesses:
                if access.code not in userAccess:
                    userAccess.append(access.code)
            userRoles.append(role.code)
        res = {
            'id': user.pk,
            'username': user.username,
            'roles': userRoles,
            'accesses': userAccess,
        }
        return JsonResponse({'values': res}, status=200)
    return generate_error_response('Invalid username/password', status=401)

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
@require_http_methods(['GET'])
def getApprovalUser(request):
    if request.method == 'GET':
        users = User.objects.filter(is_active=False)
        return JsonResponse({'values': [serialize_user(x) for x in users]}, status=200)
    return JsonResponse({}, status=404)

@csrf_exempt
@require_POST
def logOut(request):
    logout(request)
    return JsonResponse({}, status=200)

