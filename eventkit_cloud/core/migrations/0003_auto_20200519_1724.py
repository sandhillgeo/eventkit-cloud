# Generated by Django 2.2.5 on 2020-05-19 17:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20181213_1723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grouppermission',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_permissions', to='auth.Group'),
        ),
        migrations.AlterField(
            model_name='jobpermission',
            name='job',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='permissions', to='jobs.Job'),
        ),
        migrations.AlterField(
            model_name='jobpermission',
            name='object_id',
            field=models.PositiveIntegerField(db_index=True),
        ),
    ]