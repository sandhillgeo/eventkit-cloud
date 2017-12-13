# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-12-08 16:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0023_auto_20171122_1431'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataprovider',
            name='size_estimate_constant',
            field=models.FloatField(blank=True, default=None, help_text='This is a constant to help estimate file size. For raster sources its the relationship of area (sq km) to output size in GB.For osm its the relationship of feature count to output size in GB.', null=True),
        ),
    ]