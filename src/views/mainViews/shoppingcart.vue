<template>
  <div id="shoppingcart">
    <div class="mainContent">
      <div class="content-box radius">
        <div class="radius top" :style="{color:deleteStatus?'#4ec346':'#959595'}">
          <span class="fr" @click="goodsManager">
            <i class="fa" aria-hidden="true" :class="deleteStatus ? 'fa-check':'fa-trash-o'"></i>
            {{deleteStatus ? '完成':'管理'}}
          </span>
        </div>
        <div class="button-box" v-if="loginStatus==false">
          <button class="goLoginBtn" @click="$router.push({name:'Login'})">登录账号</button>
        </div>
        <div class="item-content" v-if="!isEmpty">
          <van-swipe-cell v-for="(item,index) in shoppingCartData" :key="index">
            <div class="item">
              <van-checkbox v-model="item.checked" class="fl" @click="oneSelect"></van-checkbox>
              <div class="item-img fl">
                <img class="auto-img radius" :src="item.small_img" />
              </div>
              <div class="item-right fl">
                <div class="cnName no-wrap">
                  {{item.name}}
                  <span class="rule">{{item.rule}}</span>
                </div>
                <div class="enName no-wrap">{{item.enname}}</div>
                <div class="price no-wrap stepper">
                  ￥
                  <span>{{item.price}}</span>
                  <!-- <span class="plus fr">
                  <van-icon name="plus" />
                  </span>-->
                  <van-stepper
                    min="1"
                    max="99"
                    button-size="19"
                    class="fr"
                    theme="round"
                    v-model="item.count"
                    @change="changeCount(item)"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button square type="danger" text="删除" @click="deleteOne(item, index)" />
            </template>
          </van-swipe-cell>
        </div>
        <van-empty
          class="custom-image"
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="这个人很穷，什么都没买"
          v-if="isEmpty"
        />
      </div>
      <div class="submit radius" v-if="!deleteStatus">
        <van-submit-bar
          :price="getSunPrice"
          button-text="结算"
          :disabled="hasSelect"
          @submit="submit"
        >
          <van-checkbox
            v-model="checked"
            @click="allSelect"
            :disabled="shoppingCartData.length === 0 ? true : false"
          >全选</van-checkbox>
        </van-submit-bar>
      </div>
      <div class="submit radius delete" v-if="deleteStatus">
        <van-submit-bar
          :price="getSunPrice"
          button-text="删除"
          :disabled="hasSelect"
          @submit="deleteMore"
        >
          <van-checkbox
            v-model="checked"
            @click="allSelect"
            :disabled="shoppingCartData.length === 0 ? true : false"
          >全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/shoppingcart.less";
export default {
  data() {
    return {
      isEmpty: false, //购物车是否为空
      deleteStatus: false, // 是否进入删除页面
      checked: false, // 是否全选
      shoppingCartData: [], // 购物车数据集合
      hasSelect: true, // 是否有商品被选中 true表示没有被选中
      loginStatus: true
    };
  },
  created() {
    if (this.getLoginStatus() != null) {
      this.findAllShopcart();
    } else {
      this.loginStatus = false;
    }
  },
  mounted() {},
  methods: {
    // 切换编辑或下单 购物车管理
    goodsManager() {
      this.deleteStatus = !this.deleteStatus;
    },
    // 查找购物车数据
    findAllShopcart() {
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString: this.tokenString
          //   tokenString:
          //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiY29mZmUxNTkzNTgyNDQwNDE1IiwiaWF0IjoxNTkzODQyMDg5LCJleHAiOjE1OTY0MzQwODl9.QNbx3E2mE1f7iWdTjm69Ut2FOp2Bxc27SBreArcllmE"
        }
      })
        .then(success => {
          if (success.data.code == 5000) {
            //
            success.data.result.forEach(v => {
              v.checked = false;
              this.shoppingCartData.push(v);
            });
          }
          this.emptyOrNot();
        })
        .catch(err => {});
    },
    // 单选
    oneSelect() {
      let count1 = 0;
      let count2 = 0;
      for (let i = 0; i < this.shoppingCartData.length; i++) {
        if (!this.shoppingCartData[i].checked) {
          this.checked = false;
          break;
        }
        count1++;
      }
      for (let i = 0; i < this.shoppingCartData.length; i++) {
        if (this.shoppingCartData[i].checked) {
          this.hasSelect = false;
          break;
        }
        count2++;
      }
      if (count1++ == this.shoppingCartData.length) {
        this.checked = true;
      }
      if (count2++ == this.shoppingCartData.length) {
        this.hasSelect = true;
      }
    },
    // 多选
    allSelect() {
      // this.checked = !this.checked;
      let self = this;
      this.shoppingCartData.forEach(v => {
        v.checked = self.checked;
      });
      this.hasSelect = !self.checked;
    },
    // 修改商品数量
    changeCount(item) {
      let data = { appkey: this.appkey, tokenString: this.tokenString };
      data.sid = item.sid;
      data.count = item.count;
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data
      })
        .then(success => {
          if (!success.data.code == 6000) {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.fail("内部错误");
        });
    },
    // 删除一个商品
    deleteOne(item, index) {
      let data = { appkey: this.appkey, tokenString: this.tokenString };
      data.sids = JSON.stringify([item.sid]);
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data
      })
        .then(success => {
          if (!success.data.code == 6000) {
            this.$toast.fail("请先登录");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast.success("删除成功");
            this.shoppingCartData.splice(index, 1);
            this.emptyOrNot();
          }
        })
        .catch(err => {
          this.$toast.fail("内部错误");
        });
    },
    // 删除多个商品
    deleteMore() {
      this.$dialog
        .confirm({
          title: "删除确认",
          message: "嘤嘤嘤，真的不要人家了吗？"
        })
        .then(() => {
          let data = { appkey: this.appkey, tokenString: this.tokenString };
          let index = [];
          let sids = [];
          this.shoppingCartData.forEach((v, i) => {
            if (v.checked) {
              sids.push(v.sid);
              index.push(i);
            }
          });
          data.sids = JSON.stringify(sids);

          this.axios({
            method: "POST",
            url: "/deleteShopcart",
            data
          })
            .then(success => {
              if (!success.data.code == 6000) {
                this.$toast.fail("请先登录");
                this.$router.push({ name: "Login" });
              } else {
                this.$toast.success("删除成功");
                let self = this;
                // 将数组下标倒序 从后向前面删除 这样就不会影响下标
                index.sort(function(a, b) {
                  return b - a;
                });
                index.forEach(function(index) {
                  self.shoppingCartData.splice(index, 1);
                });

                // 判断是否为空
                this.emptyOrNot();
              }
            })
            .catch(err => {
              this.$toast.fail("内部错误");
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 购物车是否为空
    emptyOrNot() {
      if (this.shoppingCartData.length == 0) {
        this.isEmpty = true;
        this.hasSelect = false;
        this.checked = false;
        this.deleteStatus = false;
      } else {
        this.isEmpty = false;
      }
    },
    // 提交
    submit() {
      let sids = [];
      this.shoppingCartData.forEach((v, i) => {
        if (v.checked) {
          sids.push(v.sid);
        }
      });
      sids = JSON.stringify(sids);
      this.$router.push({ name: "Submit", query: { sids } });
      //  this.$router.push({name:"Details",query:{pid:item.pid}})
    },
    // 登录状态获取
    getLoginStatus() {
      return localStorage.getItem("token");
    }
  },
  computed: {
    // 获取总价格
    getSunPrice() {
      let sum = 0;
      this.shoppingCartData.forEach(v => {
        if (v.checked) {
          sum += parseFloat(v.price) * v.count;
        }
      });
      return sum * 100;
    },
    // 获取当前token
    tokenString() {
      return this.$store.state.token;
    }
  }
};
</script>

<style lang="less" scoped>
.button-box{
  margin-top:50px
}
</style>