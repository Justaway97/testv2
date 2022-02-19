import datetime

def serialize_order2(order2):
    print(order2)
    print(order2.id, order2.order_date, order2.order_by.username, order2.received_date, order2.remark, order2.outlet_id.outlet_name,
    order2.status)
    res = {
        'order_id': order2.id,
        'order_date': order2.order_date,
        'order_by': order2.order_by.username,
        'received_date': order2.received_date,
        'remark': order2.remark,
        'outlet_name': order2.outlet_id.outlet_name,
        'outlet_id': order2.outlet_id.id,
        'status': order2.status,
    }
    return res

def serialize_order_detail(order_detail):
    res = {
        'order_detail_id': order_detail.id,
        'order2_id': order_detail.order2_id.id,
        'item_id': order_detail.item_id.id,
        'quantity': order_detail.quantity,
        'status': order_detail.status,
    }
    return res