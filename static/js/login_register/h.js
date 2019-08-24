define('', function (require, exports, module) {
    var jquery = $ = require('jquery'), mUrl = require('url'), md5 = require('md5'),
        passwordValidator = require('password.validator'), Auth = {
            nonceId: null,
            rUrl: null,
            mobile: null,
            password: null,
            msgCode: null,
            loginPassword: null,
            regPassword: null,
            verifyCode: null,
            loginNeedVerifyCode: false
        }, netErrMsg = '网络异常，请稍后再试', commonErrMsg = '服务器开小差了，请稍后再试', host = '127.0.0.1';
    Auth.rUrl = mUrl.getUrlParam('rurl');
    Auth.getNonceId = function () {
        if (Auth.nonceId) {
            return;
        }
        $.ajax({
            url: '/next/user_assist/getnonceid',
            dataType: "json",
            xhrFields: {withCredentials: true}
        }).done(function (obj) {
            if (obj.errcode === 0) {
                Auth.nonceId = obj.data.NonceId;
            }
        }).fail(function () {
        });
    };
    Auth.getNonceId();
    var AuthValidate = function (options, type) {
        this.authType = null;
        this.msgDelay = null;
        this.msgDelayTemp = null;
        this.options = null;
        this.validate = null;
        this.type = null;
        this.$imgCodeTmpl = null;
        this.$submitBtn = null;
        this.init(options, type);
    };
    AuthValidate.DEFAULTS = {
        authType: null,
        telephoneIpt: null,
        telInfo: null,
        msgCodeIpt: null,
        msgCodeBtn: null,
        msgCodeInfo: null,
        passwordIpt: null,
        passwordInfo: null,
        regPasswordIpt: null,
        regPasswordInfo: null,
        passwordConfirm: null,
        passwordConfirmInfo: null,
        imgCodeCancelBtn: null,
        imgCodeConfirmBtn: null,
        imgCodeWrap: null,
        imgCodePlace: null,
        imgCodeIpt: null,
        imgCodeInfo: null,
        imgCodeBtn: null,
        imgCodeMask: null,
        imgCodeTmpl: null,
        rUrlIpt: null,
        md5PwdIpt: null,
        md5RegPwdIpt: null,
        submitBtn: null
    };
    AuthValidate.prototype.getDefaults = function () {
        return AuthValidate.DEFAULTS
    };
    AuthValidate.prototype.getOptions = function (options) {
        return $.extend({}, this.getDefaults(), options);
    };
    AuthValidate.prototype.CheckNeedVerifyCode = function (cb) {
        var that = this
        var imgUrl = "/next/user_assist/getimagevc?scene=userlogin&t=";
        if (Auth.loginNeedVerifyCode) {
            that.options.imgCodeRow && $(that.options.imgCodeRow).removeClass('hide');
            that.options.imgCodeRow && $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', imgUrl + Math.random());
        } else {
            $.ajax({
                url: '/next/userinfo/checkneedverifycode',
                data: {mobile: Auth.mobile},
                dataType: 'json',
                type: 'post',
                timeout: 5000,
                beforeSend: function () {
                },
                success: function (data) {
                    if (data['errcode'] != 0) {
                        Auth.loginNeedVerifyCode = false;
                    } else {
                        Auth.loginNeedVerifyCode = data['data']['need'];
                        if (Auth.loginNeedVerifyCode) {
                            that.options.passwordInfo && $(that.options.passwordInfo).removeClass('show').addClass('hide');
                            that.options.imgCodeRow && $(that.options.imgCodeRow).removeClass('hide');
                            that.options.imgCodeRow && $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', imgUrl + Math.random());
                            that.options.imgCodeIpt && $(that.options.imgCodeRow).find(that.options.imgCodeIpt).on('focus', function () {
                                that.options.msgCodeInfo && $(that.options.msgCodeInfo).removeClass('show').addClass('hide');
                            });
                            that.options.imgCodeBtn && $(that.options.imgCodeBtn).click(function () {
                                $(that.options.imgCodeRow).find(that.options.imgCodeIpt).focus();
                                $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', imgUrl + Math.random());
                            })
                        }
                    }
                },
                error: function () {
                    Auth.loginNeedVerifyCode = false;
                },
                complete: function () {
                    cb && $.isFunction(cb.fail) && cb.fail();
                }
            });
        }
    }
    AuthValidate.prototype.init = function (options, type) {
        var that = this;
        this.type = type || ~~(Math.random() * 1000000);
        this.msgDelay = 60;
        this.msgDelayTemp = this.msgDelay;
        this.validate = true;
        this.options = this.getOptions(options);
        this.authType = this.options.authType;
        this.$submitBtn = $(this.options.submitBtn);
        !window._hmt && (window._hmt = []);
        if (this.options.imgCodeTmpl) {
            this.$imgCodeTmpl = $('<div />').append($(this.options.imgCodeTmpl).html()).appendTo('body');
            $(this.options.imgCodeRow).find(this.options.imgCodeIpt).on('keyup', function (e) {
                var value = $(e.target).val();
                if (value.length >= 4) {
                    $(e.target).val(value.substr(0, 4));
                    var mobile = $(that.options.telephoneIpt).val();
                    var $imgCodeIpt = $(that.options.imgCodeRow).find(that.options.imgCodeIpt);
                    var imgCode = $imgCodeIpt.val();
                    var params = {mobile: mobile, imgverifycode: imgCode};
                    if (that.type == 'second') {
                        params['sceneid'] = 2;
                    }
                    if (!imgCode) {
                        that.validate = false;
                        $imgCodeIpt.focus();
                        return;
                    }
                    $.ajax({
                        url: '/next/user_assist/getverifycode',
                        type: 'get',
                        dataType: 'json',
                        data: params
                    }).done(function (res) {
                        if (res.errcode == 0) {
                            $(that.options.imgCodeRow).addClass('hide');
                            that.msgCodeTimer();
                            that.validate = true;
                        } else if (res.errcode == '539365411' || res.errcode == '539365410') {
                            that.validate = false;
                            $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', '/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= ' + Math.random());
                        } else {
                            that.validate = false;
                        }
                        $(that.options.imgCodeRow).find(that.options.imgCodeIpt).val('');
                    }).fail(function () {
                        that.validate = false;
                        $(that.options.imgCodeRow).find(that.options.imgCodeIpt).val('');
                    });
                }
            });
            $(that.options.imgCodeRow).find(that.options.imgCodeBtn).on('click', function () {
                var mobile = $(that.options.telephoneIpt).val();
                $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', '/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= ' + Math.random());
                $(that.options.imgCodeRow).find(that.options.imgCodeIpt).focus();
                that.validate = false;
            });
        }
        this.options.telephoneIpt && $(this.options.telephoneIpt).on('keyup', function (e) {
            var value = $(e.target).val();
            var reg = /^\d{0,}$/;
            if (value.length > 11) {
                $(e.target).val(value.substr(0, 11));
            }
            if (!reg.test(value)) {
                that.validate = false;
                if (that.options.telInfo) {
                    $(that.options.telInfo).removeClass('hide').addClass('show').html('请输入正确的手机号');
                } else {
                    alert('请输入正确的手机号');
                }
            } else {
                that.validate = true;
                that.options.telInfo && $(that.options.telInfo).removeClass('show').addClass('hide');
            }
        }).on('keypress', function (e) {
            var k = e.charCode || e.keyCode;
            if ((k == 46) || (k == 8) || (k >= 48 && k <= 57) || (k >= 37 && k <= 40)) {
                return true;
            } else {
                return false;
            }
        }).on('blur', function (e) {
            var value = $(e.target).val();
            var reg = /^1[0-9]{10}$/;
            if (that.authType == 'passwordLogin' && value.length > 0 && reg.test(value)) {
                Auth.mobile = value;
                that.CheckNeedVerifyCode();
            }
        }).on('focus', function () {
            that.options.telInfo && $(that.options.telInfo).removeClass('show').addClass('hide');
        });
        this.options.msgCodeBtn && $(this.options.msgCodeBtn).on('click', function () {
            that.getMsgCode();
        });
        this.options.msgCodeIpt && $(this.options.msgCodeIpt).on('keyup', function (e) {
            var value = $(e.target).val();
            if (value.length > 6) {
                $(e.target).val(value.substr(0, 6));
            }
        }).on('focus', function () {
            that.options.msgCodeInfo && $(that.options.msgCodeInfo).removeClass('show').addClass('hide');
        }).on('blur', function () {
        }).on('keypress', function () {
        });
        this.options.passwordIpt && $(this.options.passwordIpt).on('keyup', function (e) {
            var value = $(e.target).val();
            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }
            that.options.passwordInfo && $(that.options.passwordInfo).removeClass('show').addClass('hide');
        }).on('keypress', function () {
        }).on('blur', function () {
        }).on('focus', function () {
            that.options.passwordInfo && $(that.options.passwordInfo).removeClass('show').addClass('hide');
            if (Auth.loginNeedVerifyCode) {
                that.options.msgCodeInfo && $(that.options.msgCodeInfo).removeClass('show').addClass('hide');
            }
        });
        this.options.regPasswordIpt && $(this.options.regPasswordIpt).on('keyup', function (e) {
            var value = $(e.target).val();
            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }
            that.options.regPasswordInfo && $(that.options.regPasswordInfo).removeClass('show').addClass('hide');
        }).on('keypress', function () {
        }).on('blur', function () {
        }).on('focus', function () {
            that.options.regPasswordInfo && $(that.options.regPasswordInfo).removeClass('show').addClass('hide');
        });
        this.options.protocolIpt && $(this.options.protocolIpt).on('change', function (e) {
            $(that.options.protocolCheckbox).toggleClass('active')
            if ($(that.options.protocolIpt)[0].checked && that.options.protocolInfo) {
                $(that.options.protocolInfo).removeClass('show').addClass('hide');
            }
        });
        this.options.passwordConfirm && $(this.options.passwordConfirm).on('keyup', function (e) {
            var value = $(e.target).val();
            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }
            that.options.passwordConfirmInfo && $(that.options.passwordConfirmInfo).removeClass('show').addClass('hide');
        }).on('keypress', function () {
        }).on('blur', function () {
        }).on('focus', function () {
            that.options.passwordConfirmInfo && $(that.options.passwordConfirmInfo).removeClass('show').addClass('hide');
        });
    };
    AuthValidate.prototype.bindSubmit = function (cb) {
        var that = this;
        this.$submitBtn.off().on('click', function (e) {
            that.reValidate();
            if (!that.isValid()) {
                return false;
            }
            that.submitAuth(cb);
        });
    }
    AuthValidate.prototype.getMsgCode = function () {
        var that = this;
        var $telephoneIpt = $(this.options.telephoneIpt);
        var mobile = $telephoneIpt.val();
        this.validate = this.validateTelephone();
        var params = {mobile: mobile};
        if (!this.validate) {
            return false;
        }
        $(this.options.msgCodeBtn).addClass('gray login_get_code_disabled').off('click');
        if (this.type == 'second') {
            params['sceneid'] = 2;
        }
        $.ajax({
            url: '/next/user_assist/getverifycode',
            type: 'get',
            dataType: 'json',
            data: params
        }).done(function (res) {
            if (res.errcode == 0) {
                that.msgCodeTimer();
            } else if (res.errcode == '539365412') {
                $(that.options.imgCodeRow).removeClass('hide');
                $(that.options.imgCodeRow).find(that.options.imgCodeIpt).focus();
                $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', '/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= ' + Math.random());
            } else {
                that.options.msgCodeBtn && $(that.options.msgCodeBtn).removeClass('gray login_get_code_disabled').bind('click', function () {
                    that.getMsgCode();
                });
                if (that.options.msgCodeInfo) {
                    $(that.options.msgCodeInfo).removeClass('hide').addClass('show').html(res.errmsg || commonErrMsg);
                } else {
                    alert(res.errmsg || commonErrMsg);
                }
            }
        }).fail(function () {
            that.options.msgCodeBtn && $(that.options.msgCodeBtn).removeClass('gray login_get_code_disabled').bind('click', function () {
                that.getMsgCode();
            });
            if (that.options.msgCodeInfo) {
                $(that.options.msgCodeInfo).removeClass('hide').addClass('show').html(commonErrMsg);
            } else {
                alert(commonErrMsg);
            }
        });
    };
    AuthValidate.prototype.msgCodeTimer = function () {
        var that = this;
        var timer = timer || null;
        var $msgCodeBtn = $(this.options.msgCodeBtn);
        if (this.msgDelayTemp > 1) {
            this.msgDelayTemp--;
            if ($msgCodeBtn[0].tagName.toLowerCase() == 'input') {
                $msgCodeBtn.val(this.msgDelayTemp + 's后重新获取');
            } else {
                $msgCodeBtn.html(this.msgDelayTemp + 's后重新获取');
            }
            timer = setTimeout(function () {
                that.msgCodeTimer();
            }, 1000);
        } else {
            if ($msgCodeBtn[0].tagName.toLowerCase() == 'input') {
                $msgCodeBtn.val('重新获取');
            } else {
                $msgCodeBtn.html('重新获取').removeClass('gray login_get_code_disabled').bind('click', function () {
                    that.getMsgCode();
                });
            }
            this.msgDelayTemp = this.msgDelay;
            clearTimeout(timer);
        }
    };
    AuthValidate.prototype.validateTelephone = function () {
        var $telephoneIpt = $(this.options.telephoneIpt);
        var mobile = $telephoneIpt.val();
        var reg = /^1[0-9]{10}$/;
        if (mobile.length < 1 || !reg.test(mobile)) {
            if (this.options.telInfo) {
                $(this.options.telInfo).html('请输入正确的手机号').removeClass('hide').addClass('show');
            } else {
                alert('请输入正确的手机号');
            }
            return false;
        }
        Auth.mobile = mobile;
        return true;
    };
    AuthValidate.prototype.validateVerifyCode = function () {
        var $imgCodeIpt = $(this.options.imgCodeIpt);
        var code = $imgCodeIpt.val();
        var reg = /^[\d|a-zA-Z]{4}$/;
        if (code.length < 1 || !reg.test(code)) {
            if (this.options.msgCodeInfo) {
                $(this.options.msgCodeInfo).html('请输入正确的验证码').removeClass('hide').addClass('show');
            } else {
                alert('请输入正确的验证码');
            }
            return false;
        }
        return true;
    };
    AuthValidate.prototype.validateMsgCode = function () {
        var $msgCodeIpt = $(this.options.msgCodeIpt);
        var msgCode = $.trim($msgCodeIpt.val());
        var reg = /^[0-9]{4,}$/;
        if (!reg.test(msgCode)) {
            if (this.options.msgCodeInfo) {
                $(this.options.msgCodeInfo).html('短信验证码错误').removeClass('hide').addClass('show');
            } else {
                alert('短信验证码错误');
            }
            return false;
        }
        Auth.msgCode = msgCode;
        return true;
    };
    AuthValidate.prototype.validatePassword = function () {
        var $passwordIpt = $(this.options.passwordIpt);
        var password = $.trim($passwordIpt.val());
        var oResp = passwordValidator.check({password: password, minLength: 6, maxLength: 20, level: 1});
        if (oResp.errCode !== 0 && oResp.errMsg) {
            if (this.options.passwordInfo) {
                $(this.options.passwordInfo).html(oResp.errMsg).removeClass('hide').addClass('show');
            } else {
                alert(oResp.errMsg);
            }
            return false;
        }
        Auth.password = password;
        return true;
    };
    AuthValidate.prototype.validateRegPassword = function () {
        var $passwordIpt = $(this.options.regPasswordIpt);
        var password = $passwordIpt.val();
        var oResp = passwordValidator.check({password: password});
        if (oResp.errCode !== 0 && oResp.errMsg) {
            if (this.options.regPasswordInfo) {
                $(this.options.regPasswordInfo).html(oResp.errMsg).removeClass('hide').addClass('show');
            } else {
                alert(oResp.errMsg);
            }
            return false;
        }
        return true;
    };
    AuthValidate.prototype.validateProtocol = function () {
        if (!$(this.options.protocolIpt)[0].checked) {
            if (this.options.protocolInfo) {
                $(this.options.protocolInfo).html('未同意用户注册协议').removeClass('hide').addClass('show');
            } else {
                alert('未同意用户注册协议');
            }
            return false;
        } else {
            if (this.options.protocolInfo) {
                $(this.options.protocolInfo).removeClass('show').addClass('hide');
            }
        }
        return true;
    };
    AuthValidate.prototype.validateConfirmPassword = function () {
        var regPassword = $(this.options.regPasswordIpt).val();
        var $passwordConfirm = $(this.options.passwordConfirm);
        var passwordConfirm = $passwordConfirm.val()
        var oResp = passwordValidator.check({password: passwordConfirm});
        if (oResp.errCode !== 0 && oResp.errMsg) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html(oResp.errMsg).removeClass('hide').addClass('show');
            } else {
                alert(oResp.errMsg);
            }
            return false;
        }
        if (regPassword != passwordConfirm) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html('两次输入的密码不一致').removeClass('hide').addClass('show');
            } else {
                alert('两次输入的密码不一致');
            }
            return false;
        }
        Auth.password = passwordConfirm;
        return true;
    };
    AuthValidate.prototype.submitAuth = function (cb) {
        var that = this;
        var url = '';
        var params = {};
        var submitLoadingText = '';
        var errTipsDom = '';
        switch (that.authType) {
            case'passwordLogin':
                url = '/next/userinfo/loginbypasswd';
                params = {mobile: Auth.mobile, passwd: Auth.loginPassword, sceneid: 1, rurl: Auth.rUrl};
                errTipsDom = that.options.passwordInfo;
                if (Auth.loginNeedVerifyCode) {
                    params.verify_code = $(that.options.imgCodeIpt).val()
                    errTipsDom = that.options.msgCodeInfo;
                }
                submitLoadingText = '正在登录...';
                break;
            case'msgCodeLogin':
                url = '/next/userinfo/loginbymobile';
                params = {mobile: Auth.mobile, verifycode: Auth.msgCode, rurl: Auth.rUrl};
                submitLoadingText = '正在登录...';
                errTipsDom = that.options.msgCodeInfo;
                break;
            case'mobilePasswordRegister':
                url = '/next/userinfo/registwithpasswd';
                params = {mobile: Auth.mobile, passwd: Auth.regPassword, verifycode: Auth.msgCode, rurl: Auth.rUrl};
                submitLoadingText = '正在提交...';
                errTipsDom = that.options.passwordConfirmInfo;
                break;
            case'findPassword':
                url = '/next/userinfo/resetpasswd';
                params = {
                    mobile: Auth.mobile,
                    passwd: Auth.regPassword,
                    verifycode: Auth.msgCode,
                    rurl: encodeURIComponent('https://' + host + '/my/index/find_password_success')
                };
                submitLoadingText = '正在提交...';
                errTipsDom = that.options.passwordConfirmInfo;
                break;
        }
        var errmsg = '';
        var submitOriginText = this.$submitBtn.text();
        this.$submitBtn.off().text(submitLoadingText);
        $.ajax({url: url, type: 'post', dataType: 'json', data: params, cache: false}).done(function (obj) {
            if (obj.errcode === 0) {
                if (cb && $.isFunction(cb.success)) {
                    cb.success(obj);
                } else {
                    var rurl = decodeURIComponent(that.authType == 'findPassword' ? obj.data.rurl : obj.data.LoginRsp.RedirectUrl);
                    location.href = rurl == '' ? '/' : rurl;
                }
            } else {
                errmsg = obj.errmsg || '系统繁忙，请稍候再试'
            }
        }).fail(function (obj) {
            errmsg = netErrMsg
        }).always(function () {
            if (errmsg) {
                that.authType == 'passwordLogin' && that.CheckNeedVerifyCode();
                $(errTipsDom).html(errmsg).removeClass('hide').addClass('show');
                cb && $.isFunction(cb.fail) && cb.fail();
                that.$submitBtn.text(submitOriginText);
                that.bindSubmit(cb);
            }
        })
    };
    AuthValidate.prototype.makeRedirectUrl = function () {
        this.options.rUrlIpt && $(this.options.rUrlIpt).val(Auth.rUrl);
    };
    AuthValidate.prototype.makeLoginPassword = function () {
        var mobile = $(this.options.telephoneIpt).val();
        var passwd = $(this.options.passwordIpt).val();
        passwd = md5.hex_md5(md5.hex_md5(md5.hex_md5(passwd)) + Auth.nonceId + mobile);
        Auth.loginPassword = passwd;
        this.options.md5PwdIpt && $(this.options.md5PwdIpt).val(passwd);
    };
    AuthValidate.prototype.makeRegPassword = function () {
        var passwd = $(this.options.regPasswordIpt).val();
        passwd = md5.hex_md5(md5.hex_md5(passwd));
        Auth.regPassword = passwd;
        this.options.md5RegPwdIpt && $(this.options.md5RegPwdIpt).val(passwd);
    };
    AuthValidate.prototype.isValid = function () {
        return this.validate;
    };
    AuthValidate.prototype.reValidate = function () {
        this.options.telephoneIpt && (this.validate = this.validateTelephone());
        this.options.msgCodeIpt && (this.validate = this.validateMsgCode() ? this.validate : false);
        Auth.loginNeedVerifyCode && this.options.imgCodeIpt && (this.validate = this.validateVerifyCode() ? this.validate : false);
        this.options.passwordIpt && (this.validate = this.validatePassword() ? this.validate : false);
        this.options.regPasswordIpt && (this.validate = this.validateRegPassword() ? this.validate : false);
        this.options.protocolIpt && (this.validate = this.validateProtocol() ? this.validate : false);
        this.options.passwordConfirm && (this.validate = this.validateConfirmPassword() ? this.validate : false);
        this.options.passwordIpt && this.makeLoginPassword();
        this.options.regPasswordIpt && this.makeRegPassword();
        this.validate && this.makeRedirectUrl();
        this.validate && Auth.getNonceId();
    };
    exports.init = function () {
        Auth.create = function (options, type) {
            return new AuthValidate(options, type);
        };
        return Auth;
    }
});
define('', function (require, exports, module) {
    var $ = require('jquery');
    var authValidate = require('md.auth.validate.v2').init();

    function webLogin() {
        var apLogin = {
            authType: 'passwordLogin',
            telephoneIpt: '.ap_form .js_telephone',
            telInfo: '.ap_form .js_telephone_tips',
            passwordIpt: '.ap_form .js_password',
            passwordInfo: '.ap_form .js_password_tips',
            rUrlIpt: '.ap_form .js_rurl_txt',
            md5PwdIpt: '.ap_form .js_password_txt',
            imgCodeIpt: '.js_img_code',
            imgCodeRow: '.ap_form .js_image_code_row',
            imgCodePlace: '.js_img_code_place',
            imgCodeBtn: '.js_reCode',
            msgCodeInfo: '.ap_form .js_verifycode_tips',
            submitBtn: '.ap_form .login_btn'
        };
        var apLoginValidate = authValidate.create(apLogin);
        apLoginValidate.bindSubmit();
        var mobileLogin = {
            authType: 'msgCodeLogin',
            telephoneIpt: '.mobile_form .js_telephone',
            telInfo: '.mobile_form .js_telephone_tips',
            msgCodeIpt: '.mobile_form .js_verifycode',
            msgCodeInfo: '.mobile_form .js_verifycode_tips',
            msgCodeBtn: '.mobile_form .login_get_code',
            imgCodeRow: '.mobile_form .js_image_code_row',
            imgCodeCancelBtn: '.js_image_code_cancel',
            imgCodeConfirmBtn: '.js_image_codeConfirm',
            imgCodeWrap: '.js_img_code_wrap',
            imgCodePlace: '.js_img_code_place',
            imgCodeIpt: '.js_img_code',
            imgCodeBtn: '.js_reCode',
            imgCodeMask: '.js_img_code_mask',
            imgCodeTmpl: '#modImagecodeTmpl',
            rUrlIpt: '.mobile_form .js_rurl_txt',
            submitBtn: '.mobile_form .login_btn'
        };
        var mobileLoginValidate = authValidate.create(mobileLogin);
        mobileLoginValidate.bindSubmit();
        var mobileReg = {
            authType: 'mobilePasswordRegister',
            telephoneIpt: '.reg_form .js_telephone',
            telInfo: '.reg_form .js_telephone_tips',
            msgCodeIpt: '.reg_form .js_verifycode',
            msgCodeInfo: '.reg_form .js_verifycode_tips',
            msgCodeBtn: '.reg_form .login_get_code',
            regPasswordIpt: '.reg_form .js_password',
            regPasswordInfo: '.reg_form .js_password_tips',
            passwordConfirm: '.reg_form .js_password_confirm',
            passwordConfirmInfo: '.reg_form .js_password_confirm_tips',
            imgCodeRow: '.reg_form .js_image_code_row',
            imgCodeCancelBtn: '.js_image_code_cancel',
            imgCodeConfirmBtn: '.js_image_codeConfirm',
            imgCodeWrap: '.js_img_code_wrap',
            imgCodePlace: '.js_img_code_place',
            imgCodeIpt: '.js_img_code',
            imgCodeBtn: '.js_reCode',
            imgCodeMask: '.js_img_code_mask',
            imgCodeTmpl: '#modImagecodeTmpl',
            protocolIpt: '#register_protocol',
            protocolCheckbox: '.js_protocol_checkbox',
            protocolInfo: '.js_protocol_tips',
            rUrlIpt: '.reg_form .js_rurl_txt',
            md5RegPwdIpt: '.reg_form .js_password_txt',
            submitBtn: '.reg_form .login_btn'
        };
        var mobileRegValidate = authValidate.create(mobileReg);
        mobileRegValidate.bindSubmit();
        $('.js_login_wrap').on('keydown', function (e) {
            var k = e.charCode || e.keyCode;
            (k == 13) && $(e.target).closest('form').find('.login_btn').trigger('click');
        });
    }

    function findPassword() {
        var findPassword = {
            authType: 'findPassword',
            telephoneIpt: '.find_pwd_form .js_telephone',
            telInfo: '.find_pwd_form .js_telephone_tips',
            msgCodeIpt: '.find_pwd_form .js_verifycode',
            msgCodeInfo: '.find_pwd_form .js_verifycode_tips',
            msgCodeBtn: '.find_pwd_form .login_get_code',
            regPasswordIpt: '.find_pwd_form .js_password',
            regPasswordInfo: '.find_pwd_form .js_password_tips',
            passwordConfirm: '.find_pwd_form .js_password_confirm',
            passwordConfirmInfo: '.find_pwd_form .js_password_confirm_tips',
            imgCodeRow: '.find_pwd_form .js_image_code_row',
            imgCodeCancelBtn: '.js_image_code_cancel',
            imgCodeConfirmBtn: '.js_image_codeConfirm',
            imgCodeWrap: '.js_img_code_wrap',
            imgCodePlace: '.js_img_code_place',
            imgCodeIpt: '.js_img_code',
            imgCodeBtn: '.js_reCode',
            imgCodeMask: '.js_img_code_mask',
            imgCodeTmpl: '#modImagecodeTmpl',
            md5RegPwdIpt: '.find_pwd_form .js_password_txt',
            submitBtn: '.find_pwd_form .login_btn'
        };
        var findPasswordValidate = authValidate.create(findPassword);
        findPasswordValidate.bindSubmit();
    }

    function togglePlaceholder() {
        var input = document.createElement('input');
        if ('placeholder' in input) {
            $('.login_form_label').hide();
        } else {
            $('.js_login_wrap input, .js_find_pwd_wrap input').each(function (i, item) {
                var $el = $(item);
                $el.val() && $el.closest('.login_form_row').addClass('editing');
            }).on('keyup', function (e) {
                var $el = $(e.target);
                $el.closest('.login_form_row').addClass('editing');
            }).on('blur', function (e) {
                var $el = $(e.target);
                !$el.val() && $el.closest('.login_form_row').removeClass('editing');
            });
        }
    }

    function initThirdLogin() {
        $('.js_login_wrap').on('click', '.login_way_qq i', function () {
            var appName = $.trim($(this).data('appName')) || 'web_qq';
            window.location.href = '/next/userinfo/qqlogin?appname=' + appName + '&rurl=' + authValidate.rUrl;
        }).on('click', '.login_way_wx i', function () {
            var appName = $.trim($(this).data('appName')) || 'web_wx';
            window.location.href = '/next/userinfo/weixinlogin?appname=' + appName + '&rurl=' + authValidate.rUrl;
        });
    }

    function switchForm() {
        $('.js_login_wrap').on('click', '.has_account, .other_login', function () {
            $('.login').removeClass('hide');
            $('.register').addClass('hide');
            $('.login_type').removeClass('login_type2').addClass('login_type1');
        }).on('click', '.reg', function () {
            $('.login').addClass('hide');
            $('.register').removeClass('hide');
        }).on('click', '.msg_login', function () {
            $('.login_type').removeClass('login_type1').addClass('login_type2');
        });
    }

    function bindInit() {
        switchForm();
        initThirdLogin();
        togglePlaceholder();
        $('.js_login_wrap').length && webLogin();
        $('.js_find_pwd_wrap').length && findPassword();
    }

    exports.init = function () {
        bindInit();
    }
});
define('md5', function (require, exports, module) {
    var hexcase = 0;
    var b64pad = "";
    var chrsz = 8;

    function hex_md5(s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }

    function b64_md5(s) {
        return binl2b64(core_md5(str2binl(s), s.length * chrsz));
    }

    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz));
    }

    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data));
    }

    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data));
    }

    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data));
    }

    function md5_vm_test() {
        return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }

    function core_md5(x, len) {
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }

    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        return str;
    }

    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad; else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }

    exports.hex_md5 = hex_md5;
    exports.b64_md5 = b64_md5;
    exports.str_md5 = str_md5;
    exports.hex_hmac_md5 = hex_hmac_md5;
    exports.b64_hmac_md5 = b64_hmac_md5;
    exports.str_hmac_md5 = str_hmac_md5;
});
define('password.validator', function (require, exports, module) {
    function checkPassword(p) {
        var params = {
            password: p.password || "",
            minLength: p.minLength || 8,
            maxLength: p.maxLength || 20,
            level: p.level || 3
        };
        var length = params.password.length;
        var pwdLevel = 0;
        var regPwd = /^[0-9A-Za-z`~!@=#$%^&*()_+<>?:"'{},\.\/\-;\[\]\\|]+$/;
        var errMsg = "";
        var errCode = 0;
        if (/[A-Z]/.test(params.password)) pwdLevel++;
        if (/[a-z]/.test(params.password)) pwdLevel++;
        if (/[0-9]/.test(params.password)) pwdLevel++;
        if (/[`~!@=#$%^&*()_+<>?:"'{},\.\/\-;\[\]\\|]/.test(params.password)) pwdLevel++;
        switch (true) {
            case length < 1:
                errCode = 10000;
                errMsg = "请输入用户密码";
                break;
            case length < params.minLength || length > params.maxLength:
                errCode = 10001;
                errMsg = "密码长度必须在" + params.minLength + "到" + params.maxLength + "位之间";
                break;
            case!regPwd.test(params.password):
                errCode = 10003;
                errMsg = "请输入" + params.minLength + "-" + params.maxLength + "位英文字母、数字或者符号";
                break;
            case pwdLevel < params.level:
                var map = {2: '两', 3: '三', 4: '四'};
                errCode = 10004;
                errMsg = "密码必须包含大小写字母，数字，符号至少" + map[params.level] + "种";
        }
        return {errCode: errCode, errMsg: errMsg, level: pwdLevel}
    }

    exports.check = checkPassword
});
define('url', function (require, exports, module) {
    var _cacheThisModule_;
    module.exports = {
        setHash: function (name) {
            setTimeout(function () {
                location.hash = name;
            }, 0);
        }, getHash: function (url) {
            var u = url || location.hash;
            return u ? u.replace(/.*#/, "") : "";
        }, getHashModelName: function () {
            var hash = this.getHash();
            return (hash ? hash.split("&")[0].split("=")[0] : []);
        }, getHashActionName: function () {
            var hash = this.getHash();
            if (hash == "") return "";
            return (hash ? hash.split("&") : [])[0].split("=")[1];
        }, getHashParam: function (name) {
            var result = this.getHash().match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
            return result != null ? result[2] : "";
        }, getUrlParam: function (name, url) {
            var u = arguments[1] || window.location.search, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                r = u.substr(u.indexOf("\?") + 1).match(reg);
            return r != null ? r[2] : "";
        }, getParams: function () {
            var param = [], hash = this.getHash();
            paramArr = hash ? hash.split("&") : [];
            for (var i = 1, l = paramArr.length; i < l; i++) {
                param.push(paramArr[i]);
            }
            return param;
        }, decodeUrl: function (url) {
            url = decodeURIComponent(url);
            var urlObj = this.parseUrl(url), decodedParam = [];
            $.each(urlObj.params, function (key, value) {
                value = decodeURIComponent(value);
                decodedParam.push(key + "=" + value);
            });
            var urlPrefix = url.split("?")[0];
            return urlPrefix + "?" + decodedParam.join("&");
        }, parseUrl: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {}, seg = a.search.replace(/^\?/, '').split('&'), len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }, redirectUrl: function (url) {
            if (/^http(s?):\/\/([^\/]*\.)?(midea|toshiba-lifestyle)\.(com|cn)(\/|$)/i.test(url)) {
                location.href = url;
            } else {
                location.href = "https://mall.midea.com/";
            }
        }
    };
});
