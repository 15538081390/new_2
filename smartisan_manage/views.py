import os
from datetime import datetime
import random

from django.conf import settings
from django.db.models import Min
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse
from django.shortcuts import render

from App.models import *
from App.models import Productcategorie

from operate.code import send_sms
from operate.form import UserForm
from operate.models import Orderform, User, Getaddr,Shopping

from App import views
import hashlib

from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse

from django_chuizi.settings import MAXAGE, SMSCONFIG, MAXAGECODE
from operate.models import *
from operate.verifycode import VerifyCode

from smartisan_manage.models import *
import hashlib
# Create your views here.

def login(request):
    if request.method=='POST':
        print ('lll')
        adminname=request.POST['adminname']
        password=request.POST['password']
        password=hashlib.sha1(password.encode('utf8')).hexdigest()
        print (adminname,password)
        user=User.objects.filter(admin=1)
        print (user)
        for u in user:
            if u.username==adminname and u.password==password:
                return render(request,'manage/index.html')
        return render(request, 'manage/login.html')
    elif request.method=='GET':
        return render(request, 'manage/login.html')

def index(request):
    return render(request,'manage/index.html')

def distrib(request):
    distrib_list=Distrib.objects.all()
    return render(request,"manage/express_list.html",locals())


def pay(request):
    pay_list=Pay.objects.all()
    return render(request,"manage/pay_list.html",locals())

def adddistrib(request):
    if request.method=='GET':
        distrib_list = Distrib.objects.all()
        return render(request,"manage/adddistrib.html",locals())
    elif request.method=='POST':
        img = request.FILES.get('picture')
        print(img, request.POST['name'], request.POST['instro'])
        # print(file.name)
        # print(file.size)
        picture = os.path.join(settings.MDEIA_ROOT, img.name)  # print(savePath)
        with open(picture, 'wb') as f:
            # f.write(file.read())
            if img.multiple_chunks():
                for myf in img.chunks():
                    f.write(myf)
                print('大大于2.5')
            else:
                print('小小于2.5')
                f.write(img.read())
        name=request.POST.get('name')
        instro=request.POST.get('instro')
        picture='/static/usrpic/'+img.name
        newdistrib=Distrib(name=name,instro=instro,picture=picture)
        newdistrib.save()
        distrib_list = Distrib.objects.all()
        return render(request,"manage/express_list.html",locals())


def addpay(request):
    if request.method == 'GET':
        pay_list =Pay.objects.all()
        return render(request, "manage/addpay.html", locals())
    elif request.method == 'POST':
        print('aaaa-------')
        img = request.FILES.get('picture')

        # print(file.name)
        # print(file.size)
        picture = os.path.join(settings.MDEIA_ROOT, img.name)  # print(savePath)
        with open(picture, 'wb') as f:
            # f.write(file.read())
            if img.multiple_chunks():
                for myf in img.chunks():
                    f.write(myf)
                print('大大于2.5')
            else:
                print('小小于2.5')
                f.write(img.read())
        name = request.POST.get('name')
        instro = request.POST.get('instro')
        picture = '/static/usrpic/' + img.name
        newpay = Pay(name=name, instro=instro, picture=picture)
        newpay.save()
        pay_list = Pay.objects.all()
        return render(request, "manage/pay_list.html", locals())



def deletepay(request,id):
    Pay.objects.filter(idpay=id).delete()
    pay_list = Pay.objects.all()
    return render(request,"manage/pay_list.html",locals())


def deletedistrib(request,id):
    Distrib.objects.filter(iddistrib=id).delete()
    distrib_list = Distrib.objects.all()
    return render(request,"manage/express_list.html",locals())


def userdetail(request):
    if request.method=='GET':
        return render(request,'manage/user_detail.html')
    elif request.method=='POST':
        img = request.FILES.get('picture')
        picture = os.path.join(settings.MDEIA_ROOT, img.name)  # print(savePath)
        with open(picture, 'wb') as f:
            if img.multiple_chunks():
                for myf in img.chunks():
                    f.write(myf)
                print('大大于2.5')
            else:
                print('小小于2.5')
                f.write(img.read())
        picture = '/static/usrpic/' + img.name
        name=request.POST['name']
        username=request.POST['username']
        password=request.POST['password']
        email=request.POST['email']
        phone=request.POST['phone']
        addr=request.POST['addr']
        street=request.POST['street']
        user=User(username=username,password=password,email=email,phone=phone,portrait=picture)
        user.save()
        address=Getaddr(username=username,phone=phone,fulladdr=addr,street=street,name=name,etc=1)
        address.save()
        return render(request,'manage/index.html')


def userlist(request):
    users=User.objects.all()
    return render(request,'manage/user_list.html',locals())

def deleteuser(request,id):
    User.objects.filter(uid=id).delete()
    users=User.objects.all()
    return render(request,'manage/user_list.html',locals())

def billlist(request):
    #订单
    bill=Bill.objects.values('bianhao').annotate(Min('idbill'))
    list1 = []
    for p in bill:
        list1.append(p['idbill__min'])
    bills = Bill.objects.filter(idbill__in=list1)
    print(bills)
    return render(request,'manage/order_list.html',locals())

def bill(request):
    #订单
    bill = Bill.objects.values('bianhao').annotate(Min('idbill'))
    list1 = []
    for p in bill:
        list1.append(p['idbill__min'])
    bills = Bill.objects.filter(idbill__in=list1)

    allbill=Bill.objects.all()
    return render(request,'manage/order_detail.html',locals())

def deletebill(requeset,bianhao):
    #删订单
    bill=Bill.objects.filter(bianhao=bianhao)
    for b in bill:
        b.delete()
    return redirect(reverse('manage:billlist'))

def addpro(request):
    if request.method=='POST':
        img=request.FILES.get('picture')
        picture='/static/usrpic/' + img.name
        new=Merchandise(mername=request.POST['mername'],money=request.POST['money'],pcid=request.POST['pcid'],
                        show=request.POST['show'],picture=picture,color=request.POST['color'],size=request.POST['size'],
                        capacity=request.POST['capacity'],specification=request.POST['specification'],
                        kuanshi=request.POST['kuanshi'],inf=request.POST['inf'])
        new.save()
        return render(request,'manage/product_detail.html')
    elif request.method=='GET':
        return render(request,'manage/product_detail.html')

def showpro(request):
    if request.method=='GET':
        products=Merchandise.objects.all()
        return render(request,'manage/recycle_bin.html',locals())


def deletepro(request,id):
    Merchandise.objects.filter(mid=id).delete()
    products = Merchandise.objects.all()
    return render(request, 'manage/recycle_bin.html', locals())
#
# def buypro(request,id):
#     p=Merchandise.objects.get(mid=id)
#     return render(request,"manage/buy.html",locals())


