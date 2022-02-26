import json
import os
import base64
from PIL import Image
from io import BytesIO
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.views.decorators.http import require_GET, require_POST, require_http_methods

from order.models import Item
from order.views.web.shared import generate_error_response

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

@require_GET
def getOptionItemList(request):
    items = Item.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'item_name':x.item_name} for x in items]}, status=200)
