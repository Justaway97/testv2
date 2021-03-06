# Generated by Django 3.2.9 on 2022-01-01 08:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DatabaseLock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('database_name', models.CharField(max_length=50)),
                ('is_database_lock', models.BooleanField(default=False)),
                ('database_lock_time', models.DateTimeField()),
                ('database_record', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=200)),
                ('quantity', models.IntegerField(default=0)),
                ('package', models.CharField(max_length=200)),
                ('image_path', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('remark', models.TextField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='MessageTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_name', models.CharField(max_length=200)),
                ('message_description', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Outlet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('outlet_name', models.CharField(max_length=200)),
                ('outlet_address', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200, unique=True)),
                ('password', models.CharField(max_length=50)),
                ('role', models.CharField(max_length=50)),
                ('handphone_number', models.CharField(max_length=50)),
                ('full_name', models.CharField(max_length=200)),
                ('approve_by', models.CharField(max_length=200, null=True)),
                ('approve_date', models.DateField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('warehouse_name', models.CharField(max_length=200)),
                ('warehouse_address', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_name', models.TextField()),
                ('expired', models.DateTimeField()),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.user')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('order_date', models.DateTimeField()),
                ('target_received_date', models.DateTimeField()),
                ('delay_day', models.IntegerField(default=0)),
                ('arrived_date', models.DateTimeField(null=True)),
                ('order_received', models.BooleanField()),
                ('order_completed', models.BooleanField()),
                ('remark', models.TextField(null=True)),
                ('item_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.item')),
                ('order_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.user')),
                ('outlet_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.outlet')),
                ('warehouse_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='order.warehouse')),
            ],
        ),
    ]
