# Generated by Django 2.2.5 on 2020-08-13 09:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0005_auto_20200813_0902'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='provider_tasks',
        ),
    ]