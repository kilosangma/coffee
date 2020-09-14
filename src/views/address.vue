<template>
  <div id="address">
    <van-nav-bar title="收货地址" left-text="返回" left-arrow  @click-left="$router.go(-1)"/>
    <van-address-list :list="list" default-tag-text="默认地址" @add="onAdd" @edit="onEdit" />
    <van-empty
          class="custom-image"
          description="快添加一个地址吧~"
          v-if="list.length == 0"
        />
  </div>
</template>

<script>
import "../assets/css/address.less";
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    // 去新增页面
    onAdd() {
      this.$toast("新增地址");
      this.$router.push({ name: "CreateAddress" });
    },
    // 去编辑页
    onEdit(item, index) {
      this.$toast("编辑地址:" + index);

      this.$router.push({ name: "CreateAddress", query: { aid: item.aid } });
    },
    // 查看地址
    findAddress() {
      this.axios({
        method: "GET",
        url: "findAddress",
        params: {
          appkey: this.appkey,
          tokenString:this.tokenString
          // tokenString:
          //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiY29mZmUxNTkzNTgyNDQwNDE1IiwiaWF0IjoxNTk0MTA3MjgxLCJleHAiOjE1OTY2OTkyODF9.ftrBB3b3Gga4Mr9A4mbkHiJShYtwZVNfuUtM0ZW9foE"
        }
      })
        .then(success => {
          if (success.data.code == 20000) {
            let self = this;
            success.data.result.forEach(v => {
              let item = {};
              item.aid = v.aid;
              item.name = v.name;
              item.tel = v.tel;
              item.address = v.province + v.city + v.county + v.addressDetail;
              item.isDefault = v.isDefault == 1;
              self.list.push(item);
            });
          } else {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    tokenString() {
      return this.$store.state.token;
    }
  },
  created() {
    this.findAddress();
  }
};
</script>

<style lang="less" scoped>
</style>