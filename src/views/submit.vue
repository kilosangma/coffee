<template>
  <div id="submit">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <div class="content-box radius address" @click="showAddList">
      <div class="tips" v-if="aid==''">请选择收货地址</div>
      <div class="addressMes" v-if="aid!=''">
        <div class="mes">
          <span class="no-wrap">{{aidNowData.address}}</span>
        </div>
        <div class="person">
          <span>{{aidNowData.name}}</span>
          <span>{{aidNowData.tel}}</span>
        </div>
      </div>
    </div>
    <div class="content-box radius drinkItem">
      <div class="item" v-for="(item,index) in goodsData" :key="index">
        <div class="item-img fl">
          <img class="auto-img radius" :src="item.small_img" />
        </div>
        <div class="item-right fl">
          <div class="cnName no-wrap">
            {{item.name}}
            <div class="price no-wrap stepper fr">
              ￥
              <span>{{item.price}}</span>
            </div>
          </div>
          <div class="enName no-wrap">{{item.enname}}</div>
          <div class="rule">
            {{item.rule}}
            <span class="fr">×{{item.count}}</span>
          </div>
        </div>
      </div>
      <div class="sumPzrice fr">
        共计
        <span>3</span>
        件商品
        合计:
        <span class="priceNum">
          ￥
          <span>{{sum}}</span>
        </span>
      </div>
    </div>
    <van-submit-bar :price="sum * 100" button-text="提交订单" @submit="submitList"/>
    <div class="addressList">
      <van-popup v-model="show" position="bottom" round closeable :style="{ height: '30%' }">
        <div class="title" @click="toAddress">
          <i class="fa fa-gears" aria-hidden="true"></i>
          <span>管理</span>
        </div>
        <div class="content" v-if="addressData.length != 0">
          <div
            @click="cutAddress(item)"
            class="item"
            v-for="(item,index) in addressData"
            :key="index"
          >
            <div class="item__name">
              {{item.name}} {{item.tel}}
              <span class="tag" v-if="item.isDefault == 1">默认地址</span>
            </div>
            <div class="item__address">{{item.address}}</div>
          </div>
        </div>
        <div class="addMoreAddress" v-if="addressData.length == 0">
          <van-button type="default" @click="$router.push({name:'CreateAddress'})">新增地址</van-button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/css/submit.less";
import { mapState } from "vuex";
export default {
  data() {
    return {
      aid: "", // 用于存放选中的地址的id
      aidNowData: "",
      goodsData: [], // 用于存放需购买的商品信息
      addressData: [], // 用于存放地址信息
      sum: 0,
      show: false
    };
  },
  computed: {
    tokenString() {
      return this.$store.state.token;
    }
  },
  created() {
    this.findAddress(); // 获取用户的地址
    this.commitShopcart(); // 获取结算页面商品信息
  },
  methods: {
    // 获取用户的地址
    findAddress() {
      this.axios({
        method: "GET",
        url: "findAddress",
        params: {
          appkey: this.appkey,
          tokenString: this.tokenString
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
              item.isDefault = v.isDefault;
              self.addressData.push(item);
              if (v.isDefault == 1) {
                self.aid = v.aid;
                self.aidNowData = Object.assign({}, item);
              }
            });
          } else {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {});
    },
    // 获取结算页面商品信息
    commitShopcart() {
      this.sids = this.$route.query.sids; // 从参数中获取sid
      let params = { appkey: this.appkey, tokenString: this.tokenString };
      params.sids = this.sids;

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params
      })
        .then(success => {
          if (!success.data.code == 50000) {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          } else {
            // 如果无商品
            if (success.data.result.length == 0) {
              this.$router.push({ name: "shoppingCart" });
            } else {
              let self = this;
              this.goodsData = success.data.result.concat([]); // 存储商品数值到data
              this.goodsData.forEach(v => {
                self.sum += parseFloat(v.price) * v.count;
              });
            }
          }
        })
        .catch(err => {
          this.$toast.fail("内部错误");
        });
    },
    // 显示地址选择弹出框
    showAddList() {
      this.show = true;
    },
    // 跳转到地址管理页面
    toAddress() {
      this.$router.push({ name: "Address" });
    },
    // 切换地址
    cutAddress(item) {
      this.aid = item.aid;
      this.aidNowData = Object.assign({}, item);
      this.show = false;
    },
    // 提交订单
    submitList() {
      if (this.aid != "") {
        let data = {
          appkey: this.appkey,
          tokenString: this.tokenString,
          sids: this.sids
        };
        data.phone = this.aidNowData.tel;
        data.address = this.aidNowData.address;
        data.receiver = this.aidNowData.name;
        this.axios({
          method:'POST',
          url:"/pay",
          data
        }).then(success=>{
          
          if(success.data.code == '60000'){
            this.$toast.success('支付成功');
            this.$router.push({name:'Order'})
          }else{
            this.$toast.fail('支付失败');
          }
        }).catch(err=>{
            this.$toast.fail('支付失败');
        })
      }else{
        this.$toast.fail('亲亲，请选择地址');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>