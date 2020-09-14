<template>
  <div id="forgetpwd">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <van-form>
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
      <van-field type="text" name="邮箱" label="邮箱" placeholder="邮箱" v-model="userInfo.email">
        <template #left-icon>
          <i class="fa fa-envelope fa-fw" aria-hidden="true"></i>
        </template>
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="sendEmail"
            :disabled="disabledStatus"
          >{{btnTetx}}</van-button>
        </template>
      </van-field>
      <van-field type="text" name="验证码" label="验证码" placeholder="验证码" v-model="userInfo.yzcode">
        <template #left-icon>
          <i class="fa fa-barcode fa-fw" aria-hidden="true"></i>
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
import "../assets/css/forgetpwd.less";
export default {
  data() {
    return {
      userInfo: {
        password: "",
        phone: "",
        yzcode: "",
        email: ""
      },
      btnTetx: "发送验证码",
      pwdShowStatus: false,
      disabledStatus: false
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
        let data = { appkey: this.appkey, validCode: this.userInfo.yzcode };

        this.axios({
          method: "POST",
          url: "/checkValidCode",
          data
        })
          .then(result => {

            if (result.data.code == "K001") {
              let {phone,password} = this.userInfo;
              let data2 = {appkey:this.appkey,phone,password}
              this.axios({
                method: "POST",
                url: "/retrievePassword",
                data:data2
              }).then(success=>{
                console.log(success);
                
                this.$toast.clear("toast");
                if(success.data.code == "L001"){
                  this.$toast.success("找回密码成功");
                  this.$router.push({name:'Login'})
                }else{
                  this.$toast.fail(result.data.msg);
                }
              }).catch(err=>{
                this.$toast.clear("toast");
              })
            } else {
              this.$toast.clear("toast");
              this.$toast.fail(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear("toast");
          });
      } else {
      }
    },
    sendEmail() {
      let o = { email: this.userInfo.email };
      let status = formTest.validUserForm(o, this);
      if (status) {
        let data = { appkey: this.appkey, email: this.userInfo.email };

        this.axios({
          method: "POST",
          url: "emailValidCode",
          data
        })
          .then(success => {
            
            this.disabledStatus = true;
            let sum = 60;
            this.btnTetx = sum + "s";
            let timer = setInterval(() => {
              if (sum == 0) {
                clearInterval(timer);
                this.disabledStatus = false;
                this.btnTetx = "发送验证码";
              } else {
                sum--;
                this.btnTetx = sum + "s";
              }
            }, 1000);
          })
          .catch(err => {
            
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>