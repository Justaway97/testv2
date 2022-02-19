
# import json
# from django.http.response import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_GET, require_POST, require_http_methods
# from order.models import Warehouse
# from order.views.web.shared import generate_error_response


# def serialize_warehouse(warehouse):
#     res = {
#         'warehouse_id': warehouse.pk,
#         'warehouse_name': warehouse.warehouse_name,
#         'warehouse_address': warehouse.warehouse_address,
#     }
#     return res

# @require_GET
# def getWarehouseList(request):
#     offset = (int(request.GET['pageSize'])*int(request.GET['pageIndex']))
#     print(offset)
#     warehouses = Warehouse.objects.all().order_by(request.GET['orderBy'])[offset: offset+int(request.GET['pageSize'])]
#     size = Warehouse.objects.all().count()
#     return JsonResponse({'values': [serialize_warehouse(x) for x in warehouses], 'size': size}, status=200)

# @require_GET
# def getOptionWarehouseList(request):
#     warehouses = Warehouse.objects.all()
#     return JsonResponse({'values': [{'id':x.id , 'warehouse_name':x.warehouse_name} for x in warehouses]}, status=200)

# @csrf_exempt
# @require_POST
# def addWarehouse(request):
#     # add new item
#     data = json.loads(request.body)
#     if isWarehouseExist(data):
#         return generate_error_response('You cannot have two warehouse with same name', status=409)
#     new_warehouse = Warehouse(warehouse_name=data['warehouse_name'],
#                    warehouse_address=data['warehouse_address'])
#     new_warehouse.save()
#     return JsonResponse({}, status=200)

# @csrf_exempt
# @require_http_methods(['GET', 'POST', 'DELETE'])
# def manageWarehouse(request, warehouse_id):
#     # find, update and delete action
#     targetWarehouse = Warehouse.objects.get(id=warehouse_id)
#     if request.method == 'GET':
#         if targetWarehouse:
#             return JsonResponse({'values': serialize_warehouse(targetWarehouse)}, status=200)
#         return generate_error_response('Item not found!', status=404)
#     if request.method == 'POST':
#         if isWarehouseExist(serialize_warehouse(targetWarehouse), warehouse_id):
#             return generate_error_response('You cannot have two warehouse with same name', status=409)
#         if targetWarehouse is None:
#             return generate_error_response('warehouse not found!', status=404)
#         targetWarehouse.updateState(json.loads(request.body))
#         return JsonResponse({}, status=200)
#     return generate_error_response({}, status=405)

# def isWarehouseExist(data, warehouse_id = 0):
#     if warehouse_id != 0:
#         warehouse = Warehouse.objects.filter(warehouse_name=data['warehouse_name']).filter(id=warehouse_id).count()
#     else:
#         warehouse = Warehouse.objects.filter(warehouse_name=data['warehouse_name']).count()
#     if warehouse:
#         return True
#     return False
