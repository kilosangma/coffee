<template>
  <div id="order">
    <van-tabs v-model="active" sticky @click="cutPage">
      <van-tab v-for="(item,index) in typeName" :key="index" :title="item">
        <!-- 每一订单 drinkItem -->
        <div v-for="(v,i) in oidData" :key="i" class="content-box radius drinkItem">
          <div class="top">
            <div class="number fl">{{v}}</div>
            <div v-if="itemData[v].status == 1" class="btn fr" @click="confirmReceipt(v,i)">确认收货</div>
            <div v-else class="btn fr" @click="del(v,i)">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
              删除订单
            </div>
          </div>
          <!-- 订单中的每个小项 -->
          <div v-for="(val,idx) in itemData[v].data" :key="idx" class="item">
            <div class="item-img fl">
              <img class="auto-img radius" :src="val.smallImg" />
            </div>
            <div class="item-right fl">
              <div class="cnName no-wrap">
                {{val.name}}
                <div class="price no-wrap stepper fr">
                  ￥
                  <span>{{val.price}}</span>
                </div>
              </div>
              <div class="enName no-wrap">{{val.enname}}</div>
              <div class="rule">
                {{val.rule}}
                <span class="fr">×{{val.count}}</span>
              </div>
            </div>
          </div>

          <div class="bottom">
            <div class="date fl">{{itemData[v].date}}</div>
            <div class="sumPzrice fr">
              共计
              <span>{{itemData[v].count}}</span>
              件商品
              合计:
              <span class="priceNum">
                ￥
                <span>{{itemData[v].price}}</span>
              </span>
            </div>
          </div>
        </div>
      </van-tab>
      <van-empty class="custom-image" description="列表空空" v-if="oidData.length == 0" />

      <div class="button-box" v-if="loginStatus==false">
        <button class="goLoginBtn" @click="$router.push({name:'Login'})">登录账号</button>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import "../../assets/css/order.less";
export default {
  data() {
    return {
      active: 1,
      typeName: ["全部订单", "未完成", "已完成"],
      oidData: [],
      itemData: {},
      loginStatus: true
    };
  },
  created() {
    this.findOrder();
  },
  methods: {
    // 查找订单数据
    findOrder() {
      if (this.getLoginStatus() != null) {
        let params = {
          appkey: this.appkey,
          tokenString: this.tokenString,
          status: this.active
        };
        this.axios({
          method: "GET",
          url: "/findOrder",
          params
        })
          .then(success => {
            // 暂存指针
            let self = this;
            // 清空订单号数组与订单数据对象
            self.oidData = [];
            self.itemData = {};

            success.data.result.forEach(v => {
              // 遍历存储订单号
              if (self.oidData.indexOf(v.oid) == -1) {
                self.oidData.push(v.oid);
              }
            });
            success.data.result.forEach(v => {
              if (self.itemData[v.oid] === undefined) {
                //
                self.itemData[v.oid] = {};
                self.itemData[v.oid].data = [];
                self.itemData[v.oid].count = v.count;
                self.itemData[v.oid].price = parseFloat(v.price) * v.count;
                self.itemData[v.oid].date = v.updatedAt;

                self.itemData[v.oid].data.push(v);
                self.itemData[v.oid].status = v.status;
              } else {
                self.itemData[v.oid].count += v.count;
                self.itemData[v.oid].price += parseFloat(v.price) * v.count;
                self.itemData[v.oid].data.push(v);
              }
            });

            
          })
          .catch(err => {
            
          });
      } else {
        this.loginStatus = false;
      }
    },
    // 切换顶部项
    cutPage(index) {
      this.findOrder();
    },
    // 确认收货
    confirmReceipt(oid, i) {
      let data = { appkey: this.appkey, tokenString: this.tokenString, oid };
      this.axios({
        method: "POST",
        url: "/receive",
        data
      })
        .then(success => {
          if (success.data.code == 80000) {
            if (this.active == 1) {
              this.oidData.splice(i, 1);
              delete this.itemData[oid];
            }
            this.itemData[oid].status = 2;
            
            this.$forceUpdate();
          }
        })
        .catch(err => {
          
        });
    },
    // 删除订单
    del(oid, i) {
      // removeOrder
      let data = { appkey: this.appkey, tokenString: this.tokenString, oid };
      this.axios({
        method: "POST",
        url: "/removeOrder",
        data
      })
        .then(success => {
          

          if (success.data.code == 90000) {
            this.oidData.splice(i, 1);
            delete this.itemData[oid];
          }
        })
        .catch(err => {
          
        });
    },
    // 获取登陆状态
    getLoginStatus() {
      return localStorage.getItem("token");
    }
  },
  computed: {
    tokenString() {
      return this.$store.state.token;
    }
  }
};
</script>

<style lang="less" scoped>
</style>