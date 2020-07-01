<template>
  <div id="register">
    <van-nav-bar title="账号注册" left-text="返回" right-text="注册" left-arrowtitle="账号注册"></van-nav-bar>
    <div class="logo">
      <img class="auto-img logo-img" src="../assets/logo.png" alt="机机网" />
    </div>
    <van-form>
      <van-field
        type="text"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        v-model="userName"
        :rules="[{validator:userNameTest,message:'4到16位（字母，数字，下划线，减号）'}]"
      >
        <template #left-icon>
          <i class="fa fa-user-circle-o fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field
        type="text"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        v-model="phoneNumber"
        :rules="[{ validator:phoneTest, message: '手机号码格式不正确' }]"
      >
        <template #left-icon>
          <i class="fa fa-volume-control-phone fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field
        type="text"
        name="验证码"
        label="验证码"
        placeholder="验证码"
        v-model="yzCode"
        :rules="[{ validator:ercodeTest, message: '6位数字验证码'}]"
      >
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button>
        </template>
        <template #left-icon>
          <i class="fa fa-envelope fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>

      <!-- right-icon right-icon="closed-eye"-->
      <van-field
        :type="pwdShowStatus?'text':'password'"
        name="密码"
        label="密码"
        placeholder="密码"
        left-icon="lock"
        v-model="password"
        :rules="[{ validator:passwordTest, message: '最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符' }]"
      >
        <template #right-icon>
          <i
            class="fa fa-fw"
            :class="pwdShowStatus?sClass:hClass"
            aria-hidden="true"
            @click="pwdShow"
          ></i>
        </template>
        <template #left-icon>
          <i class="fa fa-key fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>
      <div style="margin: 20px;">
        <van-button round block type="info" @click="submit" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      phoneNumber: "",
      userName: "",
      yzCode: "",
      pwdShowStatus: false,
      hClass: "fa-eye-slash",
      sClass: "fa-eye",
      mesStatus: {
        userName: false,
        phoneNumber: false,
        yzCode: false,
        password: false
      }
    };
  },
  methods: {
    pwdShow() {
      this.pwdShowStatus = !this.pwdShowStatus;
    },
    phoneTest(val) {
      this.mesStatus.phoneNumber = /^1[3456789]\d{9}$/.test(val);
      return this.mesStatus.phoneNumber;
    },
    userNameTest(val) {
      this.mesStatus.userName = /^[a-zA-Z0-9_-]{4,16}$/.test(val);
      return this.mesStatus.userName;
    },
    passwordTest(val) {
      this.mesStatus.password = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?._]).*$/.test(
        val
      );
      return this.mesStatus.password;
    },
    ercodeTest(val) {
      this.mesStatus.yzCode = /[0-9]{6}/.test(val);
      return this.mesStatus.yzCode;
    },
    submit() {
      // console.log(this.mesStatus);

      console.log("this.axios", this.axios);
      for (let attr in this.mesStatus) {
        if (!this.mesStatus[attr]) {
          console.log("不成功");
          return;
        }
      }
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "提交中"
      });

      let data = {
        phone: this.phoneNumber,
        nickName: this.userName,
        password: this.password
      };
      data.appkey = this.appkey;
      console.log(data);

      this.axios({
        method: "POST",
        url: "/register",
        data
      })
        .then(result => {
          console.log("成功");
          console.log(result);
          this.$toast.clear("toast");
          Toast.success("成功文案");
        })
        .catch(err => {
          console.log("???  ");
          console.log(err);

          this.$toast.clear("toast");

          Toast.fail("失败文案");
        });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__text,
/deep/ .van-icon,
/deep/ .fa {
  color: #ff624b;
}

/deep/ .van-button {
  background-color: #ff624b;
  border-color: #ff624b;
}
/deep/ .van-button--info {
  background-color: #ff624b;
  border-color: #ff624b;
  font-size: 16px;
}
/deep/ .van-field__error-message {
  font-size: 12px;
  color: #e4393c;
}
.logo {
  width: 150px;
  height: 150px;
  margin: 20px auto;
  //   overflow: hidden;
  //   opacity: 0.9999;
}
// .logo-img {
//   filter: drop-shadow(-200px 0px 0rem #e4393c);
//   position: relative;
//   left: 200px;
// }
.auto-img {
  width: 100%;
  vertical-align: bottom;
}
</style>