from django.conf.urls import url

from operate import views, tests
from operate import views

urlpatterns =[
    url(r"^login/$", views.login, name="login"),
    url(r"^generateCode/$", views.generate_code, name='generatecode'),
    url(r"^login/register/$", views.register, name='register'),
    url(r"^smartisan/$", views.smartisan, name="smartisan"),
    url(r"^code/$", views.code, name="code"),
    url(r"^money/$", views.money, name="money"),
    url(r"^payment/$", views.payment, name="payment"),
    url(r"^user/orderlist$", views.userform, name='orderlist'),
    url(r"^user/aftersale$", views.aftersale, name='aftersale'),
    url(r"^user/coupon$", views.coupon, name='coupon'),
    url(r"^user/usersetting$", views.usersetting, name='usersetting'),
    url(r"user/getaddr$", views.getaddr, name='getaddr'),
    url(r"user/logout", views.logout, name='logout'),
    url(r"user/changeimg", views.changeimg, name='changeimg'),
    url(r"user/changename", views.changename, name='changename'),
    url(r"user/changepsd", views.changepsd, name='changepsd'),
    url(r"user/changeemail", views.changeemail, name='changeemail'),
    url(r"user/settingqst", views.settingqst, name='settingqst'),
    url(r"user/safecheck", views.safecheck, name='safecheck'),
    url(r"user/phonecheck", views.phonecheck, name='phonecheck'),
    url(r"user/emailcheck", views.emailcheck, name='emailcheck'),
    url(r"user/qstcheck", views.qstcheck, name='qstcheck'),
    url(r"user/phoneinput", views.phoneinput, name='phoneinput'),
    url(r"user/rephonecheck", views.rephonecheck, name='rephonecheck'),
    url(r"user/emailcode", views.emailcode, name='emailcode'),
    url(r"user/forgetpsdphone", views.forgetpsdphone, name='forgetpsdphone'),
    url(r"user/forgetpsd", views.forgetpsd, name='forgetpsd'),

]

