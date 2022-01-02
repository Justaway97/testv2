
from django.http.response import JsonResponse
from django.views.decorators.http import require_GET
from order.models import Warehouse


def serialize_warehouse(warehouse):
    res = {
        'warehouse_id': warehouse.pk,
        'warehouse_name': warehouse.warehouse_name,
        'warehouse_address': warehouse.warehouse_address,
    }
    return res

@require_GET
def getWarehouseList(request):
    offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
    print(offset)
    warehouses = Warehouse.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
    size = Warehouse.objects.all().count()
    return JsonResponse({'values': [serialize_warehouse(x) for x in warehouses], 'size': size}, status=200)

@require_GET
def getOptionWarehouseList(request):
    warehouses = Warehouse.objects.all()
    return JsonResponse({'values': [{'id':x.id , 'warehouse_name':x.warehouse_name} for x in warehouses]}, status=200)
