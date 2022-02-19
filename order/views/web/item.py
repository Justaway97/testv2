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

def serialize_item(item, isImageRequired: bool = False):
    # serialize list of item
    res = {
        'item_id': item.pk,
        'item_name': item.item_name,
        'quantity': item.quantity,
        'package': item.package,
        'remark': item.remark,
    }
    if isImageRequired:
        with open('media/' + str(item.image_path), "rb") as img_file:
            res['image'] = base64.b64encode(img_file.read()).decode("utf-8")
    return res

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
def getItemList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    items = Item.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Item.objects.all().count()
    return JsonResponse({'values': [serialize_item(x) for x in items], 'size': size}, status=200)

@csrf_exempt
@require_POST
def addItem(request):
    # add new item
    data = json.loads(request.body)
    if isItemExist(data):
        return generate_error_response('You cannot have two item with same item name and same package', status=409)
    new_item = Item(item_name=data['item_name'],
                     quantity=data['quantity'],
                      package=data['package'],
                   image_path=saveImageInFolder(data))
    new_item.save()
    return JsonResponse({}, status=200)

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageItem(request, item_id):
    # find, update and delete action
    targetItem = Item.objects.get(id=item_id)
    if request.method == 'GET':
        if targetItem:
            return JsonResponse({'values': serialize_item(targetItem,True)}, status=200)
        return generate_error_response('Item not found!', status=404)
    if request.method == 'POST':
        if isItemExist(serialize_item(targetItem), item_id):
            return generate_error_response('You cannot have two item with same item name and same package', status=409)
        if targetItem is None:
            return generate_error_response('Item not found!', status=404)
        removeImage('media/' + str(targetItem.image_path))
        data = json.loads(request.body)
        targetItem.item_name = data['item_name']
        targetItem.quantity = data['quantity']
        targetItem.package = data['package']
        targetItem.image_path = saveImageInFolder(data)
        targetItem.remark = data['remark']
        targetItem.save()
        # return JsonResponse({}, status=200) all update function shouldnt return value back front end
        return JsonResponse({'values': serialize_item(targetItem,True)}, status=200)
    return generate_error_response({}, status=405)

@require_GET
def getOptionItemList(request):
    items = Item.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'item_name':x.item_name} for x in items]}, status=200)
