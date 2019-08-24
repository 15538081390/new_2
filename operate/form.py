import re

from django import forms
from django.core.exceptions import ValidationError


def check_password(password):
    if re.match(r'\d+$',password):
        raise ValidationError("密码不能是纯数字")

#自定义表单
class UserForm(forms.Form):
    username = forms.CharField(label='用&nbsp;&nbsp;户&nbsp;&nbsp;名:&nbsp;&nbsp;',max_length=10,
                               label_suffix=''
                               ,min_length=3,
                               error_messages={
                                   'required':'用户名必须输入',
                                   'max_length':'用户名最大10字符',
                                   'min_length':'用户名最少3个字符'
                                 }
                               )
    password = forms.CharField(label='密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:&nbsp;&nbsp;',max_length='20',
                                    min_length=3,
                                    widget=forms.PasswordInput(attrs={
                                        'placehold':'请输入密码',
                                        'class':'password'
                                    }),
                                    error_messages={
                                        'required': '密码必须输入',
                                        'max_length': '密码最大20字符',
                                        'min_length': '密码最少3个字符'
                                    },
                                    validators=[check_password]
                                    )
    repassword = forms.CharField(label="确认密码:&nbsp;&nbsp;",max_length='20',
                                    min_length=3,
                                    widget=forms.PasswordInput(attrs={
                                        'placehold':'请输入密码',
                                        'class':'password'
                                    }),
                                    error_messages={
                                        'required': '密码必须输入',
                                        'max_length': '密码最大20字符',
                                        'min_length': '密码最少3个字符'
                                    },
                                    validators=[check_password]
                                )
    tel = forms.CharField(label='手&nbsp;&nbsp;机&nbsp;&nbsp;号:&nbsp;&nbsp;',min_length=11,max_length=11,
                            error_messages={
                                'required':'手机号必须输入',
                                'max_length': '手机号长度必须是11位',
                                'min_length': '手机号长度必须是11位'
                            })

    code = forms.CharField(label='验&nbsp;&nbsp;证&nbsp;&nbsp;码:&nbsp;&nbsp;',
                          error_messages={
                              'required': '验证码必须输入',
                          })

    #自定义验证字段
    # 方法名规则： clean_字段名
    def clean_phone(self):
        # 必须使用cleaned_data获取数据
        value = self.cleaned_data.get('tel')
        if re.match(r'1[3,5,6,7,8,9]\d{9}$',value):
            return value
        raise ValidationError("手机号码格式错误")

    #全局验证函数
    def clean(self):
        password1 = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('repassword')
        if password1 == password2:
            return self.cleaned_data
        #错误信息可以是一个字典，字典的键应该是出错的字段名
        raise ValidationError({'confirm_password':"两次密码不一致"})