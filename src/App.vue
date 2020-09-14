<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>

export default {
  
  created(){
    // 获取localstorage中的值
    let token = localStorage.getItem("token");
    if(token){
      this.$store.commit("subToken",token)
    }
    // else{
    //   // 若无token则返回登陆页面
    //   this.$router.push({name:'Login'})
    // }
    
  }
}
</script>
<style lang="less">
//
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
