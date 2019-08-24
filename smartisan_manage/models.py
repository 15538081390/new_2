from django.db import models

# Create your models here.
#支付方式
class Pay(models.Model):
    idpay = models.IntegerField(primary_key=True)
    picture = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    instro = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pay'

#配送方式
class Distrib(models.Model):
    iddistrib = models.IntegerField(primary_key=True)
    picture = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=25, blank=True, null=True)
    instro = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'distrib'
