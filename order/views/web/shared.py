
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.core.mail import send_mass_mail

from core import settings
from order.models import Role, UserProfile
from django.db.models import Q

def generate_error_response(msg, status=400):
    # Return a json response with error message
    return JsonResponse({'error': msg}, status=status)

def emailTo(m):
    emailTuples = []
    subject = 'From FattyBomBom application'
    role = Role.objects.filter(Q(code='Manager') | Q(code='Warehouse'))
    userProfiles = UserProfile.objects.filter(role__in=role)
    for user in userProfiles:
        message = f'Hi {user.user.username}, ' + m
        email_from = settings.EMAIL_HOST_USER
        if user.user.email:
            recipient_list = [user.user.email, ]
            emailTuple = (subject, message, email_from, recipient_list)
            emailTuples.append(emailTuple)
    send_mass_mail( tuple(emailTuples), fail_silently=False)