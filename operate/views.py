import os
from datetime import datetime
import random

from django.conf import settings
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


class Summoney:
    def sum(self):
        sum = 0
        for i in self:
            sum += i.money
        activity = 20
        sum = sum - activity
        return sum


# 购物车
def smartisan(request): # san = 商品id
    tab = IndexTab.objects.all()    #板块
    user1 = User.objects.get(username = request.session.get('username'))
    user=User.objects.filter(username=request.session.get('username'))
    shopcar = Shopping.objects.filter(uid=user[0].uid)
    return render(request,"operate/smartisan.html",locals())


# 商品购买
def money(request):                             #san = 商品id

    tab = IndexTab.objects.all()  # 板块
    shopcar = Shopping.objects.all()
    buy=request.POST.getlist('shure')
    print (buy)
    whichone=Merchandise.objects.filter(mid__in=buy)
    print (whichone)
    for i in whichone:
        s1=request.POST.get(str('text1'+str(i.mid)))
        user=User.objects.get(username=request.session['username'])
        product=Shopping.objects.get(mid=i.mid,uid=user.uid)
        product.sum=s1
        product.save()
    for j in whichone:
        m1=request.POST.get(str(j.mid))
        user = User.objects.get(username=request.session['username'])
        product = Shopping.objects.get(mid=j.mid,uid=user.uid)
        print (product)
        product.summoney = m1
        product.save()
    user = User.objects.get(username=request.session['username'])
    products=Shopping.objects.filter(uid=user.uid,mid__in=buy)
    gouid=[]
    for pp in products:
        gouid.append(pp.sid)
    sum=0
    sumprice=0
    for p in products:
        sum+=p.sum
        sumprice+=p.summoney
    addrs=Getaddr.objects.filter(username=request.session['username'])
    return render(request, "App/shopping/pay2.html", locals())



# 用户注册+登录
def login(request):
    if request.method == 'POST':
        phone = request.POST['phone']
        password = request.POST['password']
        code = request.POST['code']
        password_hash = hashlib.sha1(password.encode('utf8')).hexdigest()
        if User.objects.filter(phone = phone, password = password_hash).exists() and code == request.session['code']:
            user = User.objects.filter(phone = phone, password = password_hash)
            response = redirect(reverse('app:index'))
            request.session['username'] = user[0].username
            request.session.set_expiry(MAXAGE)
            return response
        else:
            return HttpResponse('用户名或密码错误')
    return render(request, 'operate/login11.html')


def logout(request):
    try:
        del request.session['username']
    except:
        return redirect(reverse('app:index'))
    return redirect(reverse('app:index'))

# 图形验证码函数
def generate_code(request):
    vc = VerifyCode()
    data = vc.output()
    request.session['code'] = vc.code
    response = HttpResponse(data, content_type= 'image/png')
    # response.headers['Content-Type'] = 'image/png'
    return response


def forgetpsdphone(request):
    if request.method == 'POST':
        phone = request.POST['phone']
        user = User.objects.all()
        for i in user:
            if i.phone == phone:
                code = request.POST['verification']
                codeconfig = request.session['code']
                if codeconfig == code:
                    request.session['phone'] = phone
                    return render(request, 'operate/forgetpsd.html')
                else:
                    return render(request, 'operate/forgetpsdphone.html', {'script': "alert", 'wrong': '验证码错误'})

        else:
            return render(request, 'operate/forgetpsdphone.html', {'script': "alert", 'wrong': '没有此用户'})
    return render(request, 'operate/forgetpsdphone.html', locals())


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        phone = request.POST['tel']
        code = request.POST['code']
        codeconfig = request.session['code']
        if codeconfig == code :
            password_hash = hashlib.sha1(password.encode('utf8')).hexdigest()
            user = User(username=username, phone=phone, password=password_hash)
            user.save()
            response = redirect(reverse('app:index'))
            request.session['username'] = user.username
            request.session.set_expiry(MAXAGE)
            return response
    return render(request, 'operate/registerIM.html')
    # if request.method == 'GET':
    #     form = UserForm()
    #     return render(request, 'operate/test.html', {'form': form})
    # else:
    #     form = UserForm(request.POST)
    #     if form.is_valid():
    #         password_hash = hashlib.sha1(form.password.encode('utf8')).hexdigest()
    #         user = User(username=form.username, phone=form.phone, password=password_hash)
    #         user.save()
    #         response = redirect(reverse('app:index'))
    #         response.session['username'] = form.sername
    #         request.session.set_expiry(MAXAGE)
    #         return response
    #     else:
    #         return render(request, 'operate/test.html', {'form': form})


def code(request):
    num=str(random.randint(100000, 999999))
    request.session['phone'] = request.POST['phone']
    request.session['code'] = num
    request.session.set_expiry(MAXAGECODE)
    send_sms(request.POST['phone'], {'code':num}, **SMSCONFIG)
    return HttpResponse('True')

# 支付
def payment(request):
    tab = IndexTab.objects.all()
    return render(request, "operate/smartisan.html", locals())


def userform(request):
    products = Productcategorie.objects.all()
    home = Indexhome.objects.all()
    tab = IndexTab.objects.all()
    user = User.objects.get(username=request.session['username'])
    return render(request, 'operate/userinform.html', locals())


def aftersale(request):
    products = Productcategorie.objects.all()
    home = Indexhome.objects.all()
    tab = IndexTab.objects.all()
    user = User.objects.get(username=request.session['username'])
    return render(request, 'operate/shouhou.html', locals())


def coupon(request):
    products = Productcategorie.objects.all()
    home = Indexhome.objects.all()
    tab = IndexTab.objects.all()
    user = User.objects.get(username=request.session['username'])
    return render(request, 'operate/youhui.html', locals())


def usersetting(request):
    products = Productcategorie.objects.all()
    home = Indexhome.objects.all()
    tab = IndexTab.objects.all()
    user1 = User.objects.all()
    user = User.objects.get(username = request.session['username'])
    quest = Questionsafe.objects.filter( uid = user.uid).all()
    return render(request, 'operate/usersetting.html', locals())


# 修改头像
def changeimg(request):
    img = request.FILES.get('img')
    # print(file.name)
    # print(file.size)
    savePath = os.path.join(settings.MDEIA_ROOT, img.name)  # print(savePath)
    with open(savePath, 'wb') as f:
    # f.write(file.read())
        if img.multiple_chunks():
            for myf in img.chunks():
                f.write(myf)
            print('大大于2.5')
        else:
            print('小小于2.5')
            f.write(img.read())
    user = User.objects.get(username=request.session.get('username'))
    user.portrait = '/static/usrpic/'+img.name
    user.save()
    return redirect(reverse('operate:usersetting'))


def getaddr(request):
    products = Productcategorie.objects.all()
    home = Indexhome.objects.all()
    tab = IndexTab.objects.all()
    user = User.objects.get(username=request.session['username'])
    return render(request, 'operate/getaddr.html', locals())


# 修改昵称
def changename(request):
    if request.method == 'POST':
        name = request.POST['nickname']
        user = User.objects.all()
        if name in user[0].username:
            # return HttpResponse('用户名已存在')
            return render(request, 'operate/changename.html', {'script': "alert", 'wrong': '用户名已存在'})
        else:
            user6 = User.objects.get(username=request.session.get('username'))
            user6.username = name
            user6.save()
            request.session['username'] = name
            request.session.set_expiry(MAXAGE)
            return redirect(reverse('operate:usersetting'))
    return render(request, 'operate/changename.html')

def changepsd(request):
    if request.method == 'POST':
        password = request.POST['oldpassword']
        newpassword = request.POST['password']
        password_hash = hashlib.sha1(password.encode('utf8')).hexdigest()
        newpassword_hash = hashlib.sha1(newpassword.encode('utf8')).hexdigest()
        user = User.objects.all()
        if password_hash != user[0].password:
            return render(request, 'operate/changepsd.html', {'script': "alert", 'wrong': '密码错误,修改失败'})
        else:
            user = User.objects.get(username=request.session.get('username'))
            user.password = newpassword_hash
            user.save()
            return redirect(reverse('operate:usersetting'))
    return render(request, 'operate/changepsd.html')


def changeemail(request):
    if request.method == 'POST':
        email = request.POST['mail']
        user = User.objects.all()
        if email == user[0].email:
            return render(request, 'operate/changeemail.html', {'script': "alert", 'wrong': '您输入的邮箱已被注册'})
        else:
            user = User.objects.get(username=request.session.get('username'))
            user.email = email
            user.save()
            return redirect(reverse('operate:usersetting'))
    return render(request, 'operate/changeemail.html')


def settingqst(request):
    quest = Question.objects.all()
    if request.method == 'POST':
        question1 = request.POST['question1']
        question2 = request.POST['question2']
        question3 = request.POST['question3']
        answer1 = request.POST['answer1']
        answer2 = request.POST['answer2']
        answer3 = request.POST['answer3']
        user = User.objects.get(username=request.session.get('username'))
        qst = Questionsafe.objects.filter(uid = user.uid).all()
        if len(qst) == 0:
            user1 = Questionsafe(uid=user.uid, question1=question1, answer1=answer1, question2=question2, answer2=answer2, question3=question3, answer3 = answer3)
            user1.save()
            return redirect(reverse('operate:usersetting'))
        else:
            if int(question1) == int(qst[0].question1):
                return render(request, 'operate/changeqst.html', {'script': "alert", 'wrong': '已存在问题1, 请重新设置', 'quest': quest})
            elif int(question2) == int(qst[0].question2):
                return render(request, 'operate/changeqst.html', {'script': "alert", 'wrong': '已存在问题2, 请重新设置', 'quest': quest})
            elif int(question3) == int(qst[0].question3):
                return render(request, 'operate/changeqst.html', {'script': "alert", 'wrong': '已存在问题3, 请重新设置', 'quest': quest})
            else:
                user2 = Questionsafe(uid = user.uid, question1=question1, answer1=answer1, question2=question2, answer2=answer2, question3=question3, answer3 = answer3)
                user2.save()
                return redirect(reverse('operate:usersetting'))
    return render(request, 'operate/changeqst.html', locals())


# 安全验证
def safecheck(request):
    user = User.objects.get(username=request.session['username'])
    quest = Questionsafe.objects.filter(uid = user.uid).all()
    if request.method == 'POST':
        numget = request.POST.get('safecheck')
        if numget == '1':
            return redirect(reverse('operate:phonecheck'))
        if numget == '2':
            return redirect(reverse('operate:emailcheck'))
        if numget == '3':
            return redirect(reverse('operate:qstcheck'))
    return render(request, 'operate/safecheck.html', locals())


def phonecheck(request):
    user = User.objects.get(username=request.session.get('username'))
    if request.method == 'POST':
        code = request.POST['verification']
        print(code)
        codeconfig = request.session['code']
        if codeconfig == code:
            return render(request, 'operate/phoneinput.html')
        else:
            return render(request, 'operate/phonecheck.html', {'script': "alert", 'wrong': '验证码错误，请重新输入', 'user': user})
    return render(request, 'operate/phonecheck.html', locals())
def emailcheck(request):
    if request.method == 'GET':
        user = User.objects.filter(username=request.session['username']).all()
        email = user[0].email
        # 生成随机字符
        random_str = get_random_str()
        # 拼接验证链接（加网址）
        url = "http://127.0.0.1:8000/operate/user/phoneinput" + random_str
        # 加载激活模板
        tmp = loader.get_template('operate/email.html')
        # 渲染
        html_str = tmp.render({'url': url})

        title = "验证邮箱"
        msg = ""
        email_from = settings.EMAIL_FROM
        reciever = [
            email,
        ]
        send_mail(title, msg, email_from, reciever, html_message=html_str)
        return render(request, 'operate/emailcheck.html', locals())


# 生成随机字符串
def get_random_str():
    uuid_val = uuid.uuid4()
    uuid_str = str(uuid_val).encode("utf-8")
    md5 = hashlib.md5()
    md5.update(uuid_str)
    return md5.hexdigest()


def emailcode(request):
    if request.method == "POST":
        user = User.objects.filter(username=request.session['username']).all()
        email = user[0].email
        # 生成随机字符
        random_str = get_random_str()
        # 拼接验证链接（加网址）
        url = "http://127.0.0.1:8000/operate/user/phoneinput" + random_str
        # 加载激活模板
        tmp = loader.get_template('operate/email.html')
        # 渲染
        html_str = tmp.render({'url': url})

        title = "验证邮箱"
        msg = ""
        email_from = settings.EMAIL_FROM
        reciever = [
            email,
        ]
        send_mail(title, msg, email_from, reciever, html_message=html_str)
        return HttpResponse('ok')


def qstcheck(request):
    user = User.objects.filter(username=request.session['username']).all()
    qstsafe = Questionsafe.objects.filter(uid = user[0].uid).all()
    questionlist = {qstsafe[0].question1:qstsafe[0].answer1, qstsafe[0].question2:qstsafe[0].answer2, qstsafe[0].question3:qstsafe[0].answer3}
    list1 = []
    for key in questionlist:
        list1.append(key)
    quest = random.sample(list1, 2)
    newlist = []
    for num in quest:
        qst = Question.objects.get(id = num)
        newlist.append(qst.question)
    if request.method == 'POST':
        answer1 = request.POST['answer1']
        answer2 = request.POST['answer2']
        print(answer1)
        print(answer2)
        print(questionlist[quest[0]])
        print(questionlist[quest[1]])
        if questionlist[quest[0]] == answer1 and questionlist[quest[1]] == answer2:
            return redirect(reverse('operate:phoneinput'))
        else:
            return render(request, 'operate/qstcheck.html', {'script': "alert", 'wrong': '答案输入错误', 'newlist': newlist})
    return render(request, 'operate/qstcheck.html', locals())


def phoneinput(request):
    if request.method == 'POST':
        phone = request.POST['mobile']
        request.session['phone'] = phone
        user = User.objects.all()
        for i in user:
            if i.phone == phone:
                return render(request, 'operate/phoneinput.html', {'script': "alert", 'wrong': '该手机已被注册'})
        return render(request, 'operate/phonerecheck.html')
    return render(request, 'operate/phoneinput.html')


def rephonecheck(request):
    user = User.objects.get(username=request.session.get('username'))
    if request.method == 'POST':
        code = request.POST['verification']
        codeconfig = request.session['code']
        if codeconfig == code:
            phone = request.session['phone']
            user1 = User.objects.get(username=request.session.get('username'))
            user1.phone = phone
            user1.save()
            del request.session['phone']
            return redirect(reverse('operate:usersetting'))
        else:
            return render(request, 'operate/phonerecheck.html', {'script': "alert", 'wrong': '验证码错误，请重新输入', 'user': user})
    return render(request, 'operate/phonerecheck.html', locals())


def forgetpsd(request):
    if request.method == 'POST':
        password = request.POST['password']
        phone = request.session['phone']
        user = User.objects.get(phone = phone)
        user.password = password
        user.save()
        return redirect(reverse('operate:usersetting'))
    return render(request, 'operate/forgetpsd.html')
