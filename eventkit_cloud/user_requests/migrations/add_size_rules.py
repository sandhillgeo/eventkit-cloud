# Generated by Django 2.2.5 on 2020-04-14 01:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', 'add_map_image_snapshot'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user_requests', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSizeRule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('max_data_size', models.DecimalField(decimal_places=3, default=100, help_text='This is the maximum data size in MB that can be exported from this provider in a single DataPack.', max_digits=12, verbose_name='Max data size')),
                ('max_selection_size', models.DecimalField(decimal_places=3, default=100, help_text='This is the maximum area in square kilometers that can be exported from this provider in a single DataPack. This rule is generally superseded by data size.', max_digits=12, verbose_name='Max AOI selection size')),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobs.DataProvider')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='usersizerule',
            index=models.Index(fields=['user', 'provider'], name='user_reques_user_id_459a6a_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='usersizerule',
            unique_together={('provider', 'user')},
        ),
    ]
