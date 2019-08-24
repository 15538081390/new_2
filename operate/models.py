from django.db import models

# Create your models here.

# 用户表
class User(models.Model):
    uid = models.AutoField(primary_key=True)                         #用户ID
    username = models.CharField(unique=True, max_length=50)          #用户名
    password = models.CharField(max_length=128)                      #密码
    phone = models.CharField(unique=True, max_length=50)                         #电话号码
    email = models.CharField(max_length=100, blank=True, null=True)  #邮箱
    portrait = models.CharField(max_length=255,null=True)                      #头像
    admin=models.IntegerField()

    class Meta:
        db_table = 'user'

#收货地址
class Getaddr(models.Model):
    gid = models.AutoField(primary_key=True)
    username = models.CharField(null=True,max_length=255)                            # 用户id
    fulladdr = models.CharField(max_length=255, blank=True, null=True) #详细地址
    street = models.CharField(max_length=256,null=True)                 #街道地址
    phone = models.CharField(max_length=255,blank=True, null=True)            #手机号码
    etc = models.IntegerField( blank=True, null=True)  #默认地址
    telephone = models.CharField(max_length=50, blank=True, null=True)
    name=models.CharField(max_length=50,null=True)
    class Meta:
        db_table = 'getaddr'




#购物清单表
class Orderform(models.Model):
    oid = models.AutoField(primary_key=True)         #订单id
    ordernumber = models.CharField(max_length=250,unique=True)   #订单号
    uid = models.IntegerField()                      #用户id
    pid = models.IntegerField()                     #商品id
    invoice = models.IntegerField(default=0)         #发票信息#0=个人1=单位
    emil = models.CharField(max_length=128,null=True) #判空默认发送账户邮箱
    number = models.IntegerField()                   #订单数量
    time = models.DateField()                        #订单时间

    class Meta:
        db_table = "orderform"


#购物车
class Shopping(models.Model):
    sid = models.AutoField(primary_key=True)         #购物车id
    uid = models.IntegerField()                      #用户id
    mid = models.IntegerField()                     #商品id
    picture=models.CharField(max_length=255,null=True)
    name=models.CharField(max_length=255,null=True)
    price=models.IntegerField()
    sum=models.IntegerField()
    summoney = models.FloatField()


    class Meta:
        db_table = "shopcar"


# 安全问题表
class Question(models.Model):
    id = models.IntegerField(primary_key=True)
    question = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'question'


# 用户个人安全问题设置
class Questionsafe(models.Model):
    uid = models.IntegerField(blank=True, null=True)
    question1 = models.IntegerField(blank=True, null=True)
    answer1 = models.CharField(max_length=255, blank=True, null=True)
    question2 = models.IntegerField(blank=True, null=True)
    answer2 = models.CharField(max_length=255, blank=True, null=True)
    question3 = models.IntegerField(blank=True, null=True)
    answer3 = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'questionsafe'








