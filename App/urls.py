
from django.conf.urls import url

from App import views

urlpatterns =[

    url(r"^index/$",views.index,name="index"),
    url(r"^second/(\d+)/$",views.second,name="second"),
    url(r"^server/$",views.server,name="server"),
    url(r"^server2/$",views.server2,name="server2"),
    url(r"^server3/$",views.server3,name="server3"),
    url(r"^application/$",views.application,name="application"),
    url(r"^osx/$",views.osx,name="osx"),
    url(r"^pron2s/$",views.pron2s,name="pron2s"),
    url(r"^r1/$",views.r1,name="r1"),
    url(r"^tnt/$",views.tnt,name="tnt"),
    url(r"^dingduan/$",views.dingduan,name="dingduan"),
    url(r"^show/(?P<num>\d+)/$",views.show,name="show"),
    url(r"^show/$",views.joinshopcar,name="joinshopcar"),
    url(r"^change/$",views.change,name="change"),
    url(r"^deletecar/$",views.deletecar,name="deletecar"),
    url(r"^pay1/(?P<mid>\d+)/$",views.pay1,name="pay1"),
    url(r"^save/$",views.save,name="save"),
    url(r"^deleteaddr/$", views.deleteaddr, name="deleteaddr"),
    url(r"^payover/$", views.payover, name="payover"),
    url(r"^payover2/$", views.payover2, name="payover2"),
    url(r"^alipay/(\d+)/$",views.ali_buy,name='ali_buy')

]
