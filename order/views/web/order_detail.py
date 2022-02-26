from order.models import Item, OrderDetail
from django.contrib.auth.decorators import login_required

@login_required
def addOrderDetail(request, detail):
    new_order_detail = OrderDetail(order2_id=detail['order2_id'],
                                      item_id=detail['item_id'],
                                     quantity=detail['quantity'],
                                       status=detail['status'])
    new_order_detail.save()
    return new_order_detail
