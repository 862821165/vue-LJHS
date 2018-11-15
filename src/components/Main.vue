<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1"  @on-select='openLeftMenu'>
          <img  class="layout-logo" src="../assets/images/logo_02.png" alt="" style="margin-right: 40px">

          <MenuItem v-for="(item, index) in topMuenData" :name="item.id" :key="item.item_name">
            <Icon :type="item.icon" />
            {{item.item_name}}
          </MenuItem>

          <div class="layout-nav">

            <Submenu name="1003">
              <template slot="title">
                <Icon type="ios-contact" />
                {{user_Data.username}}
              </template>
              <MenuGroup title="设置">
                <MenuItem name="1004">个人中心</MenuItem>
                <MenuItem name="1005">系统消息</MenuItem>
                <MenuItem name="1006">常见问题</MenuItem>
              </MenuGroup>
              <MenuGroup title="操作">
                <MenuItem name="1007"  to="/login">退出登录</MenuItem>
              </MenuGroup>
            </Submenu>
          </div>


        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-1" theme="light" width="auto" :style="{height:'100%' }" :open-names="['1']" @on-select='getBtnList'>

            <Submenu v-for="(item, index) in leftMenu_data" :key="item.item_name"  :name="item.id">
              <template slot="title">
                <Icon :type="item.icon"></Icon>
                {{item.item_name}}
              </template>
              <MenuItem  v-for="(c_item, c_index) in item.children" :key="c_item.item_name"  :name="c_item.id" :to="c_item.to" >{{c_item.item_name}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>

        <router-view/>

      </Layout>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        user_Data:{username:''},
        topMuenData:[],
        leftMenu_data:[],
      }
    },
    methods: {
      getBtnList(id){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/10/16 21:36
        *=======================================================
        *@function  获取页面按钮
        *=====================================================*/
        this.$http({
          method: 'post',
            url: this.CD_.qj_url+'index/Menu/getBtnList',
          data:{
            menu_id : id,
            user_id : this.user_Data.id
          }
        }).then(function(res){
          var json = res.data ;
          if(json.status){
            if(json.btn_list.indexOf('add') !== -1){
              this.CD_.btn_List.add_btn = true
            }else {
              this.CD_.btn_List.add_btn = false
            }
            if(json.btn_list.indexOf('remove') !== -1){
              this.CD_.btn_List.remove_btn = true
            }else {
              this.CD_.btn_List.remove_btn = false
            }
            if(json.btn_list.indexOf('edit') !== -1){
              this.CD_.btn_List.edit_btn = true
            }else {
              this.CD_.btn_List.edit_btn = false
            }
            if(json.btn_list.indexOf('view') !== -1){
              this.CD_.btn_List.view_btn = true
            }else {
              this.CD_.btn_List.view_btn = false
            }
            if(json.btn_list.indexOf('audit') !== -1){
              this.CD_.btn_List.audit_btn = true
            }else {
              this.CD_.btn_List.audit_btn = false
            }
            if(json.btn_list.indexOf('password') !== -1){
              this.CD_.btn_List.password_btn = true
            }else {
              this.CD_.btn_List.password_btn = false
            }
            if(json.btn_list.indexOf('per') !== -1){
              this.CD_.btn_List.per_btn = true
            }else {
              this.CD_.btn_List.per_btn = false
            }

          }else {
            this.CD_.btn_List.add_btn = false
            this.CD_.btn_List.remove_btn = false
            this.CD_.btn_List.edit_btn = false
            this.CD_.btn_List.view_btn = false
            this.CD_.btn_List.audit_btn = false
            this.CD_.btn_List.password_btn = false
            this.CD_.btn_List.per_btn = false
          }

        }.bind(this)).catch(function(err){
          this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
        }.bind(this))


      },
      topMenu(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/9/14 13:56
        *=======================================================
        *@function  初始化顶部菜单
        *=====================================================*/
        this.$http({
          method: 'post',
          url: this.CD_.qj_url+'index/Menu/getMenu',
          data:{
            user_id: this.user_Data.id,
          }
        }).then(function(res){
          var json = res.data ;
          if(json.status){
            this.topMuenData = json.menu_data ;
            this.openLeftMenu(this.topMuenData[0].id) ;
          }else{
            this.$Loading.error();
          }


        }.bind(this)).catch(function(err){
          this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
        }.bind(this))
      },
      openLeftMenu(id){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/9/14 14:19
        *=======================================================
        *@function  打开侧边菜单
        *=====================================================*/
        if(id < 1000){
          this.$http({
            method: 'post',
            url: this.CD_.qj_url+'index/Menu/getLeftMenu',
            data:{
              id: id,
              user_id: this.user_Data.id,
            }
          }).then(function(res){
            var json = res.data ;
            if(json.status){
              this.leftMenu_data = json.leftMenu_data ;
            }else{
              this.$Loading.error();
            }


          }.bind(this)).catch(function(err){
            this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
          }.bind(this))
        }

      }
    },
    mounted() {
      this.CD_.user_Data = JSON.parse(window.localStorage.getItem('user_Data')) ;
      this.user_Data = this.CD_.user_Data ;
      this.topMenu() ;
    }
  }
</script>

<style scoped>
  .layout {
    background: #f5f7f9;
    position: fixed;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .ivu-layout {
    height: 100%;
  }
  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .ivu-menu-item{
    color: #666;
  }
  .layout-nav {
    width: 180px;
    margin: 0 auto;
    margin-right: -50px;
  }
  .ivu-layout-header {
    padding: 0;
  }
  .ivu-layout-header {
    height: 60px;
    line-height: 60px;
  }

</style>
