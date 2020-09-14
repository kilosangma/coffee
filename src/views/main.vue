<template>
  <div id="main">
    <div class="content">
      <router-view></router-view>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="(item,index) in icon" :key="index" @click="cutPage(item)">
        <span>{{item.title}}</span>
        <template #icon>
          <i class="fa fa-fw" aria-hidden="true" :class="item.icon"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import "../assets/css/base.less";
export default {
  data() {
    return {
      active: 0,
      icon: [
        {
          name: "Menu",
          icon: "fa-coffee btn",
          title: "菜单",
          checked: true
        },
        {
          name: "Order",
          icon: "fa-reorder btn",
          title: "订单",
          checked: false
        },
        {
          name: "shoppingCart",
          icon: "fa-shopping-cart btn",
          title: "购物车",
          checked: false
        },
        {
          name: "Mind",
          icon: "fa-user btn",
          title: "我的",
          checked: false
        }
      ]
    };
  },
  methods: {
    // 切换底部按钮
    cutPage(item) {
      if (item.checked) {
        return;
      } else {
        this.icon.forEach(v => {
          if (v.checked) {
            v.checked = false;
            return;
          }
        });
        item.checked = true;
        this.$router.push({ name: item.name });
      }
    }
  },
  created() {
    let str = location.hash;
    
    let strArr = str.split("/");
    str = strArr[strArr.length - 1];
    this.icon.forEach((v,i,a)=> {
      if(v.name.toLowerCase() == str.toLowerCase()){
          v.checked = true;
          this.active = i
      }else{
          v.checked = false;
      }
    });
    
  },
  mounted() {
    
  }
};
</script>
<style lang="less" scoped>
#main {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: calc(~"100% - 50px");
  background-color: #f5f5f5;
}
.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
// .btn{
//   color:#646566
// }
.btn:not(.van-tabbar-item--active) i {
  color: #646566;
}
</style>