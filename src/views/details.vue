<template>
  <div class="detail">
    <div class="nav_top" :style="{backgroundColor:'rgba(255,255,255,'+opc+')'}" ref="top">
      <div
        class="btn fr"
        :style="{backgroundColor: 'rgba(0,0,0,'+Math.abs(1-opc > 0.4 ? 0.4 : 1-opc )+')',color:opc < .9 ? 'white':'black'}"
        @click="$router.go(-1)"
      >
        <van-icon name="cross" />
      </div>
      <span :style="{color:'rgba(0,0,0,'+opc+')'}">商品详情</span>
      <div
        class="btn fl"
        :style="{backgroundColor: 'rgba(0,0,0,'+Math.abs(1-opc > 0.4 ? 0.4 : 1-opc )+')',color:isLike ? '#ff624b' : opc < .9 ? 'white':'black'}"
        @click="like"
      >
        <van-icon :name="isLike ? 'like' : 'like-o'" />
      </div>
    </div>
    <div class="detail-img">
      <img :src="img" class="auto-img" />
    </div>
    <div class="content-box radius title">
      <div class="cnName">{{cnName}}</div>
      <div class="enName">{{enName}}</div>
    </div>
    <div class="content-box radius coffee-mes">
      <div class="item" v-for="(items,index) in typeData" :key="index">
        <div class="title fl">{{items.type}}</div>
        <div class="select fl">
          <div
            v-for="(v,i) in items.value"
            :key="i"
            class="select-item fl"
            :class="{active:v.checked}"
            @click="selectType(items,v)"
          >{{v.mes}}</div>
        </div>
      </div>
    </div>

    <div class="content-box radius coffee-desc">
      <div class="title">商品描述</div>
      <div class="p" v-for="(item,index) in desc" :key="index">{{item}}</div>
    </div>

    <div class="content-box radius stepper">
      <div class="price fl">
        ￥
        <span>{{price}}</span>
      </div>
      <van-stepper min="1" max="99" button-size="19" class="fr" theme="round" v-model="buyCount" />
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="count" @click="toshopcart" />

      <van-goods-action-button
        type="danger"
        text="加入购物车"
        color="#ff624"
        @click="addToShoppingCart"
      />
      <van-goods-action-button type="danger" text="立即购买" color="rgba(255,98,75,.7)" @click="addToShoppingCart($event,true)"/>
    </van-goods-action>
    <!-- <div class="bottom">已经到底部了哟~</div> -->
  </div>
</template>

<script>
import "../assets/css/details.less";
import { mapState } from "vuex";
export default {
  data() {
    return {
      pid: "", // 商品id
      opc: 0, // 透明度
      isLike: false, // 是否收藏
      typeData: [], // 温度 糖分等类型值
      cnName: "", // 中文名
      enName: "", // 英文名
      price: "", // 价格
      desc: [], // 商品描述
      count: "", // 购物车商品种类数
      buyCount: 1, // 预购买数
      img: "" // 图片路径
    };
  },
  computed: {
    ...mapState(["token"])
  },
  created() {
    this.getDetailsMes();
    this.getLikeStatus();
    this.getShopCartStatus();
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandle);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollHandle); // 在离开时取消滚动事件监听
  },
  methods: {
    // 滚动事件
    scrollHandle(e) {
      let scHeight = document.documentElement.scrollTop;
      let topHeight = this.$refs.top.clientHeight * 1.5;
      if (scHeight > topHeight) {
        this.opc = 1;
      } else {
        this.opc = 1;
        this.opc = scHeight / topHeight;
      }
    },
    // 获取详细商品信息
    getDetailsMes() {
      this.pid = this.$route.query.pid;

      // let pid = "latte004";
      let params = { appkey: this.appkey, pid: this.pid };
      this.axios({
        method: "GET",
        url: "/productDetail",
        params
      })
        .then(theData => {
          if (theData.data.code == 600) {
            if (theData.data.result.length == 0) {
              this.$toast.fail("查无此商品");
              this.$router.push({ name: "Menu" });
            } else {
              let data = theData.data.result[0];
              let type = ["tem", "sugar", "milk", "cream"];
              let self = this;
              type.forEach((v, i) => {
                if (data[v] != "") {
                  let arr = [];
                  let str = data[v].split("/");
                  str.forEach((v, i) => {
                    arr.push({ mes: v, checked: i == 0 ? true : false });
                  });
                  self.typeData.push({ type: data[v + "_desc"], value: arr });
                }
              });
              this.cnName = data.name;
              this.enName = data.enname;
              this.price = data.price;
              this.desc = data.desc.split(/\n/);
              this.img = data.large_img;
            }
          } else {
            this.$toast.fail("查无此商品");
            this.$router.push({ name: "Menu" });
          }
        })
        .catch(err => {
          this.$toast.fail("查无此商品");
          this.$router.push({ name: "Menu" });
        });
    },
    // 获取收藏信息
    getLikeStatus() {
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: this.token
        }
      })
        .then(success => {
          if (success.data.code == 1000) {
            this.isLike = success.data.result.length > 0;
          }
        })
        .catch(err => {
          this.$toast.fail("内部错误");
        });
    },
    // 获取购物车信息
    getShopCartStatus() {
      let token = this.token;
      if (token != "") {
        let params = { appkey: this.appkey, tokenString: token };
        this.axios({
          method: "GET",
          url: "/findAllShopcart",
          params
        })
          .then(success => {
            if (success.data.code == 5000) {
              this.count =
                success.data.result.length > 0
                  ? success.data.result.length
                  : "";
            }
          })
          .catch(err => {
            
          });
      }
    },
    // 收藏事件
    like() {
      this.axios({
        method: "POST",
        url: this.isLike ? "/notlike" : "/like",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: this.token
        }
      })
        .then(success => {
          if (success.data.code == 800 || success.data.code == 900) {
            this.isLike = !this.isLike;
            this.$toast.success(this.isLike ? "已收藏" : "已取消收藏");
          } else {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.fail("内部错误");
        });
    },
    // 选择规格事件
    selectType(item, v) {
      if (v.checked != true) {
        let self = this;
        this.typeData.forEach(v1 => {
          if (v1.type == item.type) {
            v1.value.forEach(v2 => {
              if (v2.mes == v.mes) {
                v2.checked = true;
              } else {
                v2.checked = false;
              }
            });
            return;
          }
        });
      }
    },
    // 加入购物车事件
    addToShoppingCart(e, buyNow) {
      

      if (this.token == "") {
        this.$toast.fail("请先登录");
        this.$router.push({ name: "Login" });
      } else {
        let data = {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: this.token,
          count: this.buyCount
        };
        let typeMes = [];
        this.typeData.forEach(v => {
          v.value.forEach(v2 => {
            if (v2.checked) {
              typeMes.push(v2.mes);
              return;
            }
          });
        });
        data.rule = typeMes.join("/");

        this.axios({
          method: "POST",
          url: "/addShopcart",
          data
        })
          .then(success => {
            if (success.data.code == 3000) {
              if (!buyNow) {
                this.$toast.success("加入成功！");
                if (success.data.status == 1) {
                  this.count++;
                }
              } else{
                  // 立即购买
                  
                  let sids = JSON.stringify([success.data.sid]);
                  this.$router.push({name:'Submit',query:{sids}})
                }
            } else {
              this.$toast.fail("请先登录！");
              this.$router.push({ name: "Login" });
            }
          })
          .catch(err => {
            this.$toast.fail("内部错误");
          });
      }
    },
    toshopcart() {
      this.$router.push({ name: "shoppingCart" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>