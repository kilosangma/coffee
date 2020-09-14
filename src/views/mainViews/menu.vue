
<template>
  <div id="menu">
    <van-swipe class="radius" :autoplay="3000" :style="{height:148.25+'px',overflow:'hidden'}">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" class="auto-img" />
      </van-swipe-item>
    </van-swipe>
    <div class="menu_bottom">
      <div class="side-bar">
        <div
          v-for="(item,index) in drinkType"
          :key="index"
          class="item radius fl"
          :class="{active:item.checked}"
          @click="toggleSide(item,index)"
        >{{item.typeDesc}}</div>
      </div>
      <div class="menu-content radius">
        <div class="title">
          <div class="title-font no-wrap">{{drinkData.title}}</div>
          <div class="line"></div>
        </div>
        <div v-for="(item,index) in drinkData.value" :key="index" class="item" @click="goDetails(item)">
          <div class="item-img fl">
            <img
              class="auto-img radius"
              v-lazy="item.smallImg"
            />
          </div>
          <div class="item-right fl">
            <div class="cnName no-wrap">{{item.name}}</div>
            <div class="enName no-wrap">{{item.enname}}</div>
            <div class="price no-wrap">
              ￥
              <span>{{item.price}}</span>
              <span class="plus fr"><van-icon name="plus" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/menu.less";
import { createNamespacedHelpers } from "vuex";
const { mapState: MMS } = createNamespacedHelpers("menuModules");
export default {
  data() {
    return {
      images: [],
      drinkType: [{ type: "isHot", typeDesc: "热门推荐", checked: true }],
      drinkData: {}
    };
  },
  created() {
    this.getAdvImage();
    this.getDirnkType();
    this.getNowData();
  },
  methods: {
    // 获取轮播图数据
    getAdvImage() {
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(data => {
          data.data.result.forEach(v => {
            this.images.push(v.bannerImg);
          });
        })
        .catch(err => {
          
        });
    },
    // 获取类型数据
    getDirnkType() {
      let arr = this.$store.state.menuModules.drinkType;

      if (arr.length != 0) {
        this.drinkType = arr;
        
      } else {
        this.axios({
          method: "GET",
          url: "/type",
          params: {
            appkey: this.appkey
          }
        })
          .then(data => {
            data.data.result.forEach((v, i) => {
              this.drinkType.push({
                type: v.type,
                typeDesc: v.typeDesc,
                checked: false
              });
            });
            this.$store.commit("menuModules/changeDrinkType", this.drinkType);
            // 

            
          })
          .catch(err => {
            
          });
      }
    },
    // 切换类型
    toggleSide(item, index) {
      if (item.checked) {
        return;
      } else {
        // 切换激活项
        this.drinkType.forEach((v, i) => {
          if ((v.checked = true)) {
            v.checked = false;
            return;
          }
        });
        item.checked = true;
        // 
        this.getDrinkData(index)
        
      }
    },
    // 获取饮品数据
    getDrinkData(index){
      let item = this.drinkType[index];
      let drinkArr = this.$store.state.menuModules["drinkData"][item.type];
        if (drinkArr !== undefined) {
          this.drinkData = drinkArr;

          // 
        } else {
          let params = { appkey: this.appkey };
          if (item.type == "isHot") {
            params.key = "isHot";
            params.value = 1;
          } else {
            params.key = "type";
            params.value = item.type;
          }
          this.axios({
            method: "GET",
            url: "/typeProducts",
            params
          })
            .then(data => {
              let obj = {
                key: item.type,
                value: data.data.result,
                title: item.typeDesc
              };
              // 
              this.$store.commit("menuModules/changeDrinkData", obj);
              this.drinkData = obj;

              // 
            })
            .catch(err => {
              
            });
        }
    },
    // 获得当前激活的饮品数据
    getNowData(index){
      let self = this
      this.drinkType.forEach((v,i)=>{
        if(v.checked == true){
          // 
          self.getDrinkData(i)
          return;
        }
      })
    },
    // 跳转到详情页面
    goDetails(item){
      // 
      this.$router.push({name:"Details",query:{pid:item.pid}})
    }
  }
};
</script>

<style lang="less" scoped>
</style>