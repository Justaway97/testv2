from django.urls.conf import path

from order import views


urlpatterns = [
    path(r'', views.index),
]