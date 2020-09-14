<template>
  <div id="countManage">
    <van-nav-bar title="账号管理" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <ul>
      <li>
        <span class="fl title">头像</span>
        <div class="fr">
          <van-uploader :after-read="afterRead">
            <div class="fr img-box">
              <img class="auto-img" :src="userData.userImg" alt />
            </div>
          </van-uploader>
        </div>
      </li>
      <li>
        <!-- v-model="value" -->

        <span class="fl title">用户ID</span>
        <div class="no-wrap mes fr">{{userData.userId}}</div>
      </li>
      <li>
        <span class="fl title">手机号</span>
        <div class="no-wrap mes fr">{{userData.phone}}</div>
      </li>
      <li>
        <van-field label="昵称" v-model="userData.nickName" @blur="changeName" />
      </li>
      <li>
        <van-field label="简介" v-model="userData.desc" @blur="changeDesc" />
      </li>
    </ul>
  </div>
</template>

<script>
import "../assets/css/countManage.less";
export default {
  data() {
    return {
      userData: {}
    };
  },
  created() {
    this.findMy();
  },
  methods: {
    // 查看本人信息
    findMy() {
      let params = {
        appkey: this.appkey,
        tokenString: this.$store.state.token
      };
      // findMy
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params
      })
        .then(success => {
          if (success.data.code == "B001") {
            this.userData = success.data.result[0];
            if (this.userData.desc == "") {
              this.userData.desc = "这个人很懒，什么都没留下";
            }
          } else {
          }
        })
        .catch(err => {
          
        });
    },
    // 修改昵称
    changeName() {
      
      let data = {
        appkey: this.appkey,
        tokenString: this.$store.state.token,
        nickName: this.userData.nickName
      };
      this.axios({
        method: "POST",
        url: "/updateNickName",
        data
      })
        .then(success => {
          if (success.data.code == "C001") {
            this.$toast("修改成功");
          }
        })
        .catch(err => {
          
        });
    },
    // 修改描述
    changeDesc() {
      
      let data = {
        appkey: this.appkey,
        tokenString: this.$store.state.token,
        desc: this.userData.desc
      };
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data
      })
        .then(success => {
          if (success.data.code == "D001") {
            this.$toast("修改成功");
          }
        })
        .catch(err => {
          
        });
    },
    // 上传头像
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
          url: "/updateAvatar",
          data
        })
          .then(success => {
            
            this.userData.userImg = success.data.userImg;
            
            this.$forceUpdate();
            this.$toast('更新成功')
          })
          .catch(err => {
            
          });
      } else {
        this.$toast("文件格式错误");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>