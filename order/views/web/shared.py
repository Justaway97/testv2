
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.core.mail import send_mass_mail

from core import settings

def generate_error_response(msg, status=400):
    # Return a json response with error message
    return JsonResponse({'error': msg}, status=status)

def emailTo(m):
    emailTuples = []
    subject = 'From FattyBomBom application'
    users = User.objects.filter(is_staff=True, is_active=True).exclude(email__isnull=True)
    for user in users:
        message = f'Hi {user.username}, ' + m
        email_from = settings.EMAIL_HOST_USER
        if user.email:
            recipient_list = [user.email, ]
            emailTuple = (subject, message, email_from, recipient_list)
            emailTuples.append(emailTuple)
    send_mass_mail( tuple(emailTuples), fail_silently=False)