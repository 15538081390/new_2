# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-08-12 16:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operate', '0003_auto_20190812_1554'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='portrait',
            field=models.CharField(max_length=256, null=True),
        ),
    ]
