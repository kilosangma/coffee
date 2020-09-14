<template>
  <div id="createAddress">
    <van-nav-bar
      :title="!!aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="!!aid ? true : false"
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      :address-info="addressinfo"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";
import "../assets/css/createAddress.less";
export default {
  data() {
    return {
      areaList,
      addressinfo: {
        //收货人
        name: "",
        //手机号
        tel: "",
        //省
        province: "",
        //城市
        city: "",
        //区县
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        //邮编
        postalCode: "",
        //默认地址
        isDefault: false
      },
      aid: "" //地址的id
    };
  },
  computed: {
    tokenString() {
      return this.$store.state.token;
    }
  },
  methods: {
    // 保存地址
    onSave(addressDatas) {
      let mesKey = [
        "addressDetail",
        "name",
        "tel",
        "province",
        "city",
        "county",
        "addressDetail",
        "areaCode",
        "postalCode",
        "isDefault"
      ];
      // 新增地址
      let data = { appkey: this.appkey, tokenString: this.tokenString };

      addressDatas.isDefault = Number(addressDatas.isDefault);
      mesKey.forEach(v => {
        data[v] = addressDatas[v];
      });

      if (!!this.aid) {
        data.aid = this.aid
        let status = false;
        mesKey.forEach(v => {
          if (this.addressinfo[v] !== addressDatas[v]) {
            status = true;
              

            return;
          }
        });
          
        
        this.axios({
          method: "POST",
          url: "/editAddress",
          data
        })
          .then(success => {
              
            if (success.data.code == 30000) {
              this.$toast("编辑地址成功");
              // 进行跳转操作
              // this.$router.push({ name: "Address" });
              this.$router.go(-1)
            } else {
              this.$toast.fail("请先登录");
              this.$router.push({ name: "Login" });
            }
          })
          .catch(err => {
              
          });
        return;
      } else {
        this.axios({
          method: "POST",
          url: "/addAddress",
          data
        })
          .then(success => {
              
            if (success.data.code == 9000) {
              this.$toast("新增地址成功");
              // 进行跳转操作
              this.$router.go(-1)
            } else {
              this.$toast.fail("请先登录");
              this.$router.push({ name: "Login" });
            }
          })
          .catch(err => {
              
          });
      }
    },
    // 删除地址
    onDelete(addressDatas) {
      let data = {
        appkey: this.appkey,
        tokenString: this.tokenString,
        aid: this.aid
      };
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data
      })
        .then(success => {
            
          if (success.data.code == 10000) {
            this.$toast("删除地址成功");
            // 进行跳转操作
            this.$router.go(-1)
          } else {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
            
        });
    },
    // 初始化 
    init() {
      // 获取地址id

      // aid不为空则进行地址查询
      this.aid =
        this.$route.query.aid === undefined ? "" : this.$route.query.aid;
      if (this.aid) {
        this.axios({
          method: "GET",
          url: "/findAddressByAid",
          params: {
            appkey: this.appkey,
            tokenString: this.tokenString,
            aid: this.aid
          }
        })
          .then(success => {
            if (success.data.code == 40000) {
              for (let key in this.addressinfo) {
                if (key == "isDefault") {
                  this.addressinfo[key] =
                    success.data.result[0][key] === 0 ? false : true;
                } else {
                  this.addressinfo[key] = success.data.result[0][key];
                }
              }
            } else {
              this.$toast.fail("请先登录");
              this.$router.push({ name: "Login" });
            }
          })
          .catch(err => {
              
          });
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
</style>