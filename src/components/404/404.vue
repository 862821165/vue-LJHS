<template>
    <div class="p404">

      <i class="iconfont icon-404"></i>
      <h2>404</h2>
      <router-link to="/">
        <Button class="btn_success" type="success">返回首页</Button>
      </router-link>

    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
  .p404{
    text-align: center;
    i{
      font-size: 250px;
      margin-bottom: 20px;
    }
    h2{
      font-size: 100px;
      font-weight: bold;
    }
    .btn_success{
      padding: 20px 150px;
    }
  }
</style>
