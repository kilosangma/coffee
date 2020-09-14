<template>
  <div id="mycollect">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <div class="collect-cotent">
        <div class="item" v-for="(item,index) in likeData" :key="index">
            <div class="img-box">
                <img class="auto-img" :src="item.smallImg">
            </div>
            <div class="name">{{item.name}}</div>
            <div>
                <div class="price fl">￥{{item.price}}</div>
                <i @click='cancleCollect(item,index)' class="fa fa-trash-o fr" aria-hidden="true"></i>
            </div>
        </div>
        <van-empty
          class="custom-image"
          description="亲暂无收藏哦~"
          v-if="likeData.length == 0"
        />
    </div>
  </div>
</template>

<script>
import  '../assets/css/mycollect.less'
export default {
    data(){
        return{
            likeData:[]
        }
    },
    created(){
        this.getColletData();
    },
    methods:{
        getColletData(){
            let params = {tokenString:this.tokenString,appkey:this.appkey}
            this.axios({
                method:'GET',
                url:'/findAllLike',
                params
            }).then(success=>{
                if(success.data.code == 2000){
                    this.likeData = success.data.result.concat([]);
                }
                
                
            }).catch(err=>{
                
            })
        },
        cancleCollect(item,index){
             let data = {tokenString:this.tokenString,appkey:this.appkey,pid:item.pid}
            this.axios({
                method:'POST',
                url:'/notlike',
                data
            }).then(success=>{
                
                if(success.data.code == 900){
                    this.likeData.splice(index,1);
                    this.$toast("取消成功")
                }
            }).catch(err=>{
                
            })
            
        },
        
    },
    computed:{
        tokenString(){
            return this.$store.state.token
        }
    }
};
</script>

<style lang="scss" scoped>
</style>