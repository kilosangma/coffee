<template>
  <div id="mind">
    <div class="top" :style="{backgroundImage:'url(' + userData.userBg + ')'}">
      <div v-if="loginStatus">
        <div class="changBgc">
          <!-- == undefined ? '../../assets/images/timg.jpg' : userData.userBg 
          <li  :style="'background-image:url(require('./../assets/banner_top2.png'))'"></li>
          -->
          <div class="fr">
            <van-uploader :after-read="afterRead">
              <span class="fr">更换背景</span>
            </van-uploader>
          </div>
        </div>
        <div class="self">
          <div class="picture fl">
            <div class="img-box">
              <img class="auto-img" :src="userData.userImg" />
            </div>
          </div>
          <div class="mes fl">
            <div class="nickyname">{{userData.nickName != undefined ? userData.nickName : '未登陆'}}</div>
            <div
              class="sign"
            >{{userData.desc != undefined ? userData.desc == '' ? '这个人很懒，什么都没留下' : userData.desc : '未登陆'}}</div>
          </div>
        </div>
      </div>
      <div class="unloginbox" v-if="loginStatus==false">
        <div class="button-box" >
          <button class="goLoginBtn" @click="$router.push({name:'Login'})">登录账号</button>
        </div>
      </div>
    </div>
    <ul class="btn-list" v-if="loginStatus">
      <li @click="$router.push({name:'CountManage'})">
        账号管理
        <i class="fa fa-angle-right fr" aria-hidden="true"></i>
      </li>
      <li @click="$router.push({name:'Address'})">
        地址管理
        <i class="fa fa-angle-right fr" aria-hidden="true"></i>
      </li>
      <li @click="$router.push({name:'MyCollect'})">
        我的收藏
        <i class="fa fa-angle-right fr" aria-hidden="true"></i>
      </li>
      <li @click="$router.push({name:'SeureCenter'})">
        安全中心
        <i class="fa fa-angle-right fr" aria-hidden="true"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import "../../assets/css/mind.less";
export default {
  data() {
    return {
      userData: {},
      defaultBg: "../../assets/images/timg.jpg",
      loginStatus: true
    };
  },
  methods: {
    // 上传图片
    afterRead(file) {
      if (file.file.type.startsWith("image")) {
        let imgType = file.file.type.split("/")[1];
        let serverBase64Img = file.content.split(",")[1];
        let data = {
          appkey: this.appkey,
          tokenString: this.$store.state.token,
          imgType,
          serverBase64Img
        };
        this.axios({
          method: "POST",
          url: "/updateUserBg",
          data
        })
          .then(success => {
            
            this.userData.userBg = success.data.userBg;
            
            this.$toast("修改成功");
          })
          .catch(err => {
            
          });
      } else {
        this.$toast("文件格式错误");
      }
    },
    // http://www.kangliuyong.com:10002/findMy
    
    // 获取用户基本信息
    findMy() {
      let params = {
        appkey: this.appkey,
        tokenString: this.$store.state.token
      };
      // findMy
      this.axios({
        method: "GET",
        url: "/findMy",
        params
      })
        .then(success => {
          
          if (success.data.code == "A001") {
            this.userData = success.data.result[0];
          } else {
          }
        })
        .catch(err => {
          
        });
    },
    // 获取登录状态
    getLoginStatus() {
      return localStorage.getItem("token");
    }
  },
  created() {
    if (this.getLoginStatus() != null) {
      this.findMy();
    } else {
      this.loginStatus = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>