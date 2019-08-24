from smartisan_manage import views
from django.conf.urls import url

urlpatterns =[
    url(r"^login/$", views.login, name="login"),
    url(r"^index/$", views.index, name="index"),
    url(r"^pay/$", views.pay, name="pay"),
    url(r"^distrib/$", views.distrib, name="distrib"),
    url(r"^adddistrib/$", views.adddistrib, name="adddistrib"),
    url(r"^addpay/$", views.addpay, name="addpay"),
    url(r"^deletepay/(\d+)/$", views.deletepay, name="deletepay"),
    url(r"^deletedistrib/(\d+)/$", views.deletedistrib, name="deletedistrib"),
    url(r"^userdetail/$", views.userdetail, name="userdetail"),
    url(r"^userlist/$", views.userlist, name="userlist"),
    url(r"^deleteuser/(\d+)/$", views.deleteuser, name="deleteuser"),
    url(r"^billlist/$", views.billlist, name="billlist"),
    url(r"^bill/$",views.bill,name='bill'),
    url(r"^deletebill/(\w+)/$", views.deletebill, name="deletebill"),
    url(r"^addpro/$", views.addpro, name="addpro"),
    url(r"^showpro/$", views.showpro, name="showpro"),
    url(r"^deletepro/(\d+)/$", views.deletepro, name="deletepro"),
    # url(r"^buypro/(\d+)/$", views.buypro, name="buypro"),
    ]