class formTest {
    constructor() {
        this.testFn = {
            phone: {
                reg: /^1[3456789]\d{9}$/,
                msg: "手机号码格式不正确"
            },
            nickName: {
                reg: /^[a-zA-Z0-9_-]{4,16}$/,
                msg: "昵称，4-16位，数字字母下划线"
            },
            password: {
                reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?._]).*$/,
                msg: "密码，6位以上，大小写字母、数字、特殊字符"
            },
            newpassword: {
                reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?._]).*$/,
                msg: "密码，6位以上，大小写字母、数字、特殊字符"
            },
            email: {
                reg: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                msg: "请输入正确邮箱格式"
            },
            yzcode: {
                reg: /^\d{6}$/,
                msg: "请输入6位数验证码"
            }
        }
    }
    //验证表单
    validUserForm(o, self) {
        //o：验证表单数据, 类型：object
        

        for (let key in o) {
            

            if (!this.testFn[key].reg.test(o[key])) {
                

                self.$toast(this.testFn[key].msg);
                return false;
            }
        }
        //表单验证通过
        return true;
    }

}

export default new formTest();