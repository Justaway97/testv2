
from django.http.response import JsonResponse

def generate_error_response(msg, status=400):
    # Return a json response with error message
    return JsonResponse({'error': msg}, status=status)
