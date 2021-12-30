from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

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
