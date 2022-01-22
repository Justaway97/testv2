from django.contrib.auth.models import User
from django.db import models
import uuid

class Warehouse(models.Model):
    warehouse_name = models.CharField(max_length=200)
    warehouse_address = models.CharField(max_length=300)

    def updateState(self, data):
        if 'warehouse_name' in data:
            self.warehouse_name = data['warehouse_name']
        if 'warehouse_address' in data:
            self.warehouse_address = data['warehouse_address']
        super().save()

    def __str__(self):
        return self.warehouse_name

class Outlet(models.Model):
    outlet_name = models.CharField(max_length=200)
    outlet_address = models.CharField(max_length=300)

    def updateState(self, data):
        if 'outlet_name' in data:
            self.outlet_name = data['outlet_name']
        if 'outlet_address' in data:
            self.outlet_address = data['outlet_address']
        super().save()

    def __str__(self):
        return self.outlet_name

def upload_path(instance, filename):
    return '/'.join(['images', str(instance.title), filename])

class Item(models.Model):
    item_name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=0)
    package = models.CharField(max_length=200)
    image_path = models.ImageField(null=True, blank=True, upload_to='images/')
    remark = models.TextField(null=True)

    def updateState(self, data):
        if 'item_name' in data:
            self.item_name = data['item_name']
        if 'quantity' in data:
            self.quantity = data['quantity']
        if 'package' in data:
            self.package = data['package']
        if 'image_path' in data:
            self.image_path = data['image_path']
        if 'remark' in data:
            self.remark = data['remark']
        super().save()

    def __str__(self):
        return self.item_name

class Order(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4) change all to uuid for security issue songming
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    order_date = models.DateTimeField()
    order_by = models.ForeignKey(User, on_delete=models.CASCADE)
    target_received_date = models.DateTimeField()
    outlet_id = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    arrived_date = models.DateTimeField(null=True)
    order_status = models.CharField(max_length=100,default='P')
    remark = models.TextField(null=True)
    warehouse_id = models.ForeignKey(Warehouse, on_delete=models.CASCADE, null=True)
    # update to status, remove order_received or order completed, status use code -> completed, confirmed, sent, canceled

    def updateState(self, data):
        if 'quantity' in data:
            self.quantity = data['quantity']
        if 'order_date' in data:
            self.order_date = data['order_date']
        if 'order_by' in data:
            self.order_by = data['order_by']
        if 'target_received_date' in data:
            self.target_received_date = data['target_received_date']
        if 'outlet_id' in data:
            self.outlet_id = data['outlet_id']
        if 'arrived_date' in data:
            self.arrived_date = data['arrived_date']
        if 'order_status' in data:
            self.order_status = data['order_status']
        if 'remark' in data:
            self.remark = data['remark']
        if 'warehouse' in data:
            self.warehouse = data['warehouse']
        super().save()

    def __str__(self):
        return str(self.pk)

class DatabaseLock(models.Model):
    database_name = models.CharField(max_length=50)
    is_database_lock = models.BooleanField(default=False)
    database_lock_time = models.DateTimeField()
    database_record = models.IntegerField(default=0)

    def updateState(self, data):
        if 'database_name' in data:
            self.database_name = data['database_name']
        if 'is_database_lock' in data:
            self.is_database_lock = data['is_database_lock']
        if 'database_lock_time' in data:
            self.database_lock_time = data['database_lock_time']
        if 'database_record' in data:
            self.database_record = data['database_record']
        super().save()

    def __str__(self):
        return self.database_name

class Token(models.Model):
    token_name = models.TextField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    expired = models.DateTimeField()

    def __str__(self):
        return str(self.token_name)

class MessageTable(models.Model):
    message_name = models.CharField(max_length=200)
    message_description = models.CharField(max_length=300)

    def __str__(self):
        return str(self.message_name)