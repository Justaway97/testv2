from order.models import Item, OrderDetail

def addOrderDetail(detail):
    item = Item.objects.get(item_name = detail['item_name'])
    new_order_detail = OrderDetail(order2_id=detail['order_id'],
                                      item_id=item,
                                     quantity=detail['quantity'],
                                       status=detail['status'])
    new_order_detail.save()
    return new_order_detail
