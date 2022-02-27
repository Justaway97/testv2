from django.contrib.auth.models import User
from django.db import models

# drop table need to use meta and manage = false, https://stackoverflow.com/questions/54836848/use-django-migrations-to-delete-a-table

class Outlet(models.Model):
    outlet_name = models.CharField(max_length=200, unique=True)
    outlet_address = models.CharField(max_length=300, unique=True)

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
    item_name = models.CharField(max_length=200, unique=True)
    # image_path = models.ImageField(null=True, blank=True, upload_to='images/')
    remark = models.TextField(blank=True, default='')

    def updateState(self, data):
        if 'item_name' in data:
            self.item_name = data['item_name']
        # if 'image_path' in data:
        #     self.image_path = data['image_path']
        if 'remark' in data:
            self.remark = data['remark']
        super().save()

    def __str__(self):
        return self.item_name

class Order2(models.Model):
    order_date = models.DateField()
    order_by = models.ForeignKey(User, on_delete=models.PROTECT)
    received_date = models.DateField()
    remark = models.TextField(null=True)
    outlet_id = models.ForeignKey(Outlet, on_delete=models.PROTECT)
    status = models.CharField(max_length=100, default='P')

    def __str__(self):
        return str(self.pk)

    def updateState(self, data):
        if 'order_date' in data:
            self.order_date = data['order_date']
        if 'order_by' in data:
            self.order_by = data['order_by']
        if 'received_date' in data:
            self.received_date = data['received_date']
        if 'remark' in data:
            self.remark = data['remark']
        if 'outlet_id' in data:
            self.outlet_id = data['outlet_id']
        if 'status' in data:
            self.status = data['status']
        super().save()

class OrderDetail(models.Model):
    order2_id = models.ForeignKey(Order2, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=0)
    status = models.CharField(max_length=100)

    def __str__(self):
        return str(self.pk)

    def updateState(self, data):
        if 'order2_id' in data:
            self.order2_id = data['order2_id']
        if 'item_id' in data:
            self.item_id = data['item_id']
        if 'quantity' in data:
            self.quantity = data['quantity']
        if 'status' in data:
            self.status = data['status']
        super().save()

class Access(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    def __str__(self):
        return str(self.description)

class Role(models.Model):
    code = models.CharField(max_length=50, default='test')
    access = models.ManyToManyField(Access, blank=True)

    def __str__(self):
        return str(self.code)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ManyToManyField(Role)

    def __str__(self):
        return str(self.user)
