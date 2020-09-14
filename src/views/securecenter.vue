<template>
  <div id="securecenter">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      right-text="退出登录"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="goLogin"
    />
    <div class="content">
      <button @click="dropThePopup(true)">修改密码</button>
      <button @click="dropThePopup(false)">注销账号</button>
    </div>
    <van-popup v-model="show" round position="bottom" :style="{ height: '30%' }">
      <van-form @submit="resetPwd" v-if="pwd==true">
        <van-field v-model="oldPwd" name="旧密码" label="旧密码" placeholder="旧密码" />
        <van-field v-model="newPwd" name="新密码" label="新密码" placeholder="新密码" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
      <van-form @submit="delCount" v-if="pwd==false">
        <van-field v-model="myPwd" name="输入密码" label="输入密码" placeholder="输入密码" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import "../assets/css/securecenter.less";
import formTest from "../assets/js/formTest";
export default {
  data() {
    return {
      show: false,
      oldPwd: "",
      newPwd: "",
      myPwd: "",
      pwd: true
    };
  },
  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
      localStorage.clear();
      this.$store.commit('clearToken')
    },
    // 底部弹出框
    dropThePopup(status) {
      this.show = true;
      this.pwd = status;
    },
    resetPwd() {
      let status = formTest.validUserForm(
        { password: this.oldPwd, newpassword: this.newPwd },
        this
      );
      if (status) {
        let data = {
          appkey: this.appkey,
          tokenString: this.$store.state.token,
          password: this.newPwd,
          oldPassword: this.oldPwd
        };
        this.axios({
          method: "POST",
          url: "/updatePassword",
          data
        })
          .then(success => {
            
            if (success.data.code == "E001") {
              this.$toast("修改成功");
              this.goLogin();
            } else {
              this.$toast(success.data.msg);
            }
            this.show = false;
          })
          .catch(err => {
            
            this.show = false;
          });
      }
    },
    delCount() {
      let status = formTest.validUserForm({ password: this.myPwd }, this);
      if (status) {
        let data = {
          appkey: this.appkey,
          tokenString: this.$store.state.token
        };
        this.axios({
          method: "POST",
          url: "/destroyAccount",
          data
        })
          .then(success => {
            
            if (success.data.code == "G001") {
              this.$toast("注销成功");
              this.goLogin();
            } else {
              this.$toast(success.data.msg);
            }
            this.show = false;
          })
          .catch(err => {
            
            this.show = false;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-form {
  margin-top: 30px;
}
</style>