
import json
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from order.models import Outlet
from order.views.web.shared import generate_error_response


def isOutletExist(data, outlet_id = 0):
    if outlet_id != 0:
        outlet = Outlet.objects.filter(outlet_name=data['outlet_name']).filter(id=outlet_id).count()
    else:
        outlet = Outlet.objects.filter(outlet_name=data['outlet_name']).count()
    if outlet:
        return True
    return False

def serialize_outlet(outlet):
    # serialize list of outlet
    res = {
        'outlet_id': outlet.pk,
        'outlet_name': outlet.outlet_name,
        'outlet_address': outlet.outlet_address,
    }
    return res

@csrf_exempt
@require_POST
def addOutlet(request):
    # add new item
    data = json.loads(request.body)
    if isOutletExist(data):
        return generate_error_response('You cannot have two outlet with same item name and same package', status=409)
    new_outlet = Outlet(outlet_name=data['outlet_name'],
                   outlet_address=data['outlet_address'])
    new_outlet.save()
    return JsonResponse({}, status=200)

@csrf_exempt
@require_http_methods(['GET', 'POST', 'DELETE'])
def manageOutlet(request, outlet_id):
    # find, update and delete action
    targetOutlet = Outlet.objects.get(id=outlet_id)
    if request.method == 'GET':
        if targetOutlet:
            return JsonResponse({'values': serialize_outlet(targetOutlet)}, status=200)
        return generate_error_response('Item not found!', status=404)
    if request.method == 'POST':
        if isOutletExist(serialize_outlet(targetOutlet), outlet_id):
            return generate_error_response('You cannot have two outlet with same name', status=409)
        if targetOutlet is None:
            return generate_error_response('outlet not found!', status=404)
        targetOutlet.updateState(json.loads(request.body))
        return JsonResponse({}, status=200)
    return generate_error_response({}, status=405)

@require_GET
def getOutletList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    outlets = Outlet.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Outlet.objects.all().count()
    return JsonResponse({'values': [serialize_outlet(x) for x in outlets], 'size': size}, status=200)

@require_GET
def getOptionOutletList(request):
    outlets = Outlet.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'outlet_name':x.outlet_name} for x in outlets]}, status=200)
