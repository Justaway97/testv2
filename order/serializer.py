from django.contrib.auth.models import User


def serialize_user(user: User):
    data = {
        'id': user.pk,
        'username': user.username,
        'isActive': user.is_active,
    }
    return data
