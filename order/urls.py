from django.shortcuts import render
from django.urls.conf import path, re_path

from order import views

# pylint: disable=unused-argument
def index(request, **kwargs):
    """Returns main page"""
    return render(request, 'order/index.html')

urlpatterns = [
    re_path(r'^(?P<path>.*)/$', index),
    re_path(r'$', index),
]