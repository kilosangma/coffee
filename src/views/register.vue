<template>
  <div id="register">
    <van-nav-bar title="账号注册" left-text="关闭" right-text="登录" left-arrow @click-left="$router.push({name:'Menu'})" @click-right="toLogin"></van-nav-bar>
    <div class="logo">
      <img class="auto-img logo-img" src="../assets/logo.png" alt="机机网" />
    </div>
    <van-form>
      <van-field type="text" name="用户名" label="用户名" placeholder="用户名" v-model="userInfo.nickName">
        <template #left-icon>
          <i class="fa fa-user-circle-o fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field type="text" name="手机号" label="手机号" placeholder="手机号" v-model="userInfo.phone">
        <template #left-icon>
          <i class="fa fa-volume-control-phone fa-fw" aria-hidden="true"></i>
        </template>
      </van-field>

      <!-- right-icon right-icon="closed-eye"-->
      <van-field
        :type="pwdShowStatus?'text':'password'"
        name="密码"
        label="密码"
        placeholder="密码"
        left-icon="lock"
        v-model="userInfo.password"
      >
        <template #right-icon>
          <i
            class="fa fa-fw"
            :class="pwdShowStatus?'fa-eye':'fa-eye-slash'"
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
import formTest from "../assets/js/formTest";

import '../assets/css/login_register.less'
export default {
  data() {
    return {
      userInfo: {
        password: "",
        phone: "",
        nickName: ""
      },
      pwdShowStatus: false
    };
  },
  methods: {
    pwdShow() {
      this.pwdShowStatus = !this.pwdShowStatus;
    },

    submit() {
      let status = formTest.validUserForm(this.userInfo, this);
      if (status) {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "提交中"
        });

        let data = Object.assign({}, this.userInfo);
        data.appkey = this.appkey;
        this.axios({
          method: "POST",
          url: "/register",
          data
        })
          .then(result => {
            
            this.$toast.clear("toast");
            if (result.data.code == 100) {
              this.$toast.success("注册成功");
              this.$router.push({name:'Login'})
            } else {
              this.$toast.fail(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear("toast");
            this.$toast.fail("内部错误");
          });
      } else {
      }
    },
    toLogin(){
      this.$router.push({name:"Login"})
    }
  }
};
</script>
