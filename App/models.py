from django.db import models

# # This is an auto-generated Django model module.
# # You'll have to do the following manually to clean this up:
# #   * Rearrange models' order
# #   * Make sure each model has one field with primary_key=True
# #   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
# #   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# # Feel free to rename the models, but don't rename db_table values or field names.
# from __future__ import unicode_literals
#
# from django.db import models

#首页顶行
class IndexTab(models.Model):
    tid = models.AutoField(primary_key=True)
    tname = models.CharField(unique=True, max_length=45)
    href = models.CharField(unique=True,max_length=255)

    class Meta:
        managed = False
        db_table = 'index_tab'

#选项表分类
class Indexcopy(models.Model):
    cid = models.AutoField(primary_key=True)
    hid = models.IntegerField()
    cname = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'indexcopy'

#选项表分类
class Indexhome(models.Model):
    hid = models.AutoField(primary_key=True)
    gname = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = False
        db_table = 'indexhome'

#产品表
class Productcategorie(models.Model):
    pcid = models.AutoField(primary_key=True)
    pcname = models.CharField(unique=True, max_length=45)
    cid = models.IntegerField()
    hid = models.IntegerField()
    money = models.IntegerField()
    picture = models.CharField(max_length=255)
    inf = models.CharField(max_length=255)
    class Meta:
        managed = False
        db_table = "productcategorie"

    class Meta:
        managed = False
        db_table = 'productcategorie'

#产品规格表
class Merchandise(models.Model):
    mid = models.AutoField(primary_key=True)                            #id
    pcid = models.IntegerField()                                        # 手机产品id
    mername = models.CharField(max_length=45)                           #手机名字
    money = models.FloatField()                                         #价格
    color = models.CharField(max_length=128,null=True)                  #颜色
    specification = models.CharField(max_length=128,null=True)          #规格

    size = models.CharField(max_length=128,null=True)                   #尺码
    capacity = models.CharField(max_length=128, null=True)              #容量
    kuanshi = models.CharField(max_length=128, null=True)                # 款式
    xiaoliang = models.IntegerField(null=True)                          #销量
    kucun = models.IntegerField(default=10)                             #库存
    show = models.IntegerField()                                        #模板判断展示
    Service = models.CharField(max_length=200,null=True)                #服务说明
    inf = models.CharField(max_length=45)                                # 产品说明
    picture = models.CharField(max_length=255, blank=True, null=True)    #主图片
    Choosepicture = models.CharField(max_length=255,null=True)           #颜色选择
    infpicture = models.CharField(max_length=255, blank=True, null=True) #产品说明图片


    class Meta:
        managed = False
        db_table = 'merchandise'
#订单表
class Bill(models.Model):
    idbill = models.AutoField(primary_key=True)
    user = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    addr = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    time = models.DateTimeField(blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    picture = models.CharField(max_length=255, blank=True, null=True)
    sum = models.IntegerField()
    summoney=models.FloatField()
    name=models.CharField(max_length=255, blank=True, null=True)
    price=models.FloatField()
    bianhao=models.CharField(max_length=255, blank=True, null=True)
    summoney2=models.FloatField()
    class Meta:
        managed = False
        db_table = 'bill'




#产品细分
class Indexproduct(models.Model):
    pid = models.AutoField(primary_key=True)
    pname = models.CharField(unique=True, max_length=45)
    cid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'indexproduct'

#官方配件产品类 ：备用
class Parts(models.Model):
    partsid = models.AutoField(primary_key=True)             #id
    partsname = models.CharField(unique=True, max_length=45) #名称
    money = models.FloatField()                              #单价
    one = models.IntegerField()                              #1条
    two = models.IntegerField()                              #2条
    three = models.IntegerField()                            #3条
    white = models.IntegerField()                            #白色
    black = models.IntegerField()                            #黑色
    diantongban = models.IntegerField(blank=True, null=True)        #
    picture = models.CharField(max_length=45, blank=True, null=True) #图片
    infpicture = models.CharField(max_length=45, blank=True, null=True) #产品信息图片
    inf = models.CharField(max_length=45, blank=True, null=True)            #产品信息
    infserver = models.CharField(max_length=45, blank=True, null=True)      #服务说明
    xiaoliang = models.IntegerField()                                   #销量
    tochan = models.IntegerField()                                      #官方配件产品id
    kucun = models.IntegerField()                                       #库存
    show = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'parts'

#畅呼吸商品类 ：备用
class Breath(models.Model):
    money = models.FloatField()
    idbreath = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=45)
    picture = models.CharField(max_length=45, blank=True, null=True)
    infpicture = models.CharField(max_length=45, blank=True, null=True)
    infserver = models.CharField(max_length=45, blank=True, null=True)
    inf = models.CharField(max_length=45, blank=True, null=True)
    black = models.IntegerField()
    white = models.IntegerField()
    fuhe = models.IntegerField()
    jiaquan = models.IntegerField()
    biaozhun = models.IntegerField()
    xiaoliang = models.IntegerField()
    tochan = models.IntegerField()
    kucun = models.IntegerField()
    show = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'breath'

#衣服商品类  ：备用
class Clothes(models.Model):
    idclothes = models.AutoField(primary_key=True)                       #id
    money = models.FloatField()                                         #单价
    name = models.CharField(max_length=45)                              #名字
    picture = models.CharField(max_length=45, blank=True, null=True)    #图片
    infpicture = models.CharField(max_length=45, blank=True, null=True) #产品信息图片
    inf = models.CharField(max_length=45, blank=True, null=True)        #产品信息
    infserver = models.CharField(max_length=45, blank=True, null=True)  #服务说明
    black = models.IntegerField()                                       #黑色
    white = models.IntegerField()                                       #白色
    fifteen_6 = models.IntegerField()                                   #
    twenty = models.IntegerField()
    notopen = models.IntegerField()
    s = models.IntegerField()                                           #尺码
    l = models.IntegerField()
    m = models.IntegerField()
    xl = models.IntegerField()
    man = models.IntegerField()
    kid = models.IntegerField()
    women = models.IntegerField()                                       #款式
    three_7 = models.IntegerField()
    three_8 = models.IntegerField()
    three_9 = models.IntegerField()
    four_0 = models.IntegerField()
    four_1 = models.IntegerField()
    four_2 = models.IntegerField()
    xiaoliang = models.IntegerField()
    tochan = models.IntegerField()                                       #衣服产品id
    kucun = models.IntegerField()
    show = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'clothes'

































































