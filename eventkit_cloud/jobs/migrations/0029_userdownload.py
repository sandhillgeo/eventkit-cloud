# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-05-10 19:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('jobs', 'add_permissions_to_existing_jobs'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserDownload',
            fields=[
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('uid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('time', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='Time of download')),
                ('size', models.DecimalField(decimal_places=3, default=0, editable=False, max_digits=12, null=True, verbose_name='Download size (MB)')),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='jobs.DataProvider')),
                ('job', models.ForeignKey(related_name='downloads', to='jobs.Job')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='downloads', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-time'],
            },
        ),
    ]
