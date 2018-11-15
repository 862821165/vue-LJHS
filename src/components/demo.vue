<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>用户管理</BreadcrumbItem>
    </Breadcrumb>
    <Content>

      <Row :style="{margin:'10px 0'}">
        <i-col span="18">
          <ButtonGroup>
            <Button  icon="trash-b" type="error" @click="remove_data">删除</Button>
            <Button  icon="compose" type="warning" @click="updata_data">修改</Button>
          </ButtonGroup>
          <Button icon="android-person-add"type="success">添加</Button>
        </i-col>
        <i-col  span="6">
          <i-input v-model="search_value">
          <Select v-model="search_select" slot="prepend" style="width: 80px">
            <Option value="loginname">登录账号</Option>
            <Option value="username">用户名称</Option>
          </Select>
          <Button slot="append" icon="ios-search"  @click="search_data"></Button>
          </i-input>
        </i-col >
      </Row>

      <Table height="713"  :columns="columns" :data="table_data" @on-selection-change="selected_item" ></Table>
      <div style="float: right ; margin: 10px">
        <Page :total="40" size="small" show-elevator show-sizer @on-change="change_page" @on-page-size-change="change_page_size"></Page>
      </div>
    </Content>
  </Layout>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        search_value: '',
        search_select: 'loginname',
        selectd_ids: [],//选中的id
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '登录账号',
            key: 'loginname'
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '电子邮箱',
            key: 'email'
          },
          {
            title: '所属角色组',
            key: 'role',
            filters: [
              {
                label: '管理员',
                value: '管理员'
              },
              {
                label: '普通用户',
                value: '普通用户'
              },{
                label: 'vip用户',
                value: 'vip用户'
              },
            ],
            filterMethod (value, row) {
              return row.role.indexOf(value) > -1;
            }
          },
        ],
        table_data: [
          {
            id:1 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:2 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '普通用户'
          },{
            id:3 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '普通用户'
          },{
            id:4 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: 'vip用户'
          },{
            id:5 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: 'vip用户'
          },{
            id:6 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:7 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:8 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },{
            id:9 ,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          },

        ]
      }
    },
    methods: {
      selected_item(data){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 16:41
        *=======================================================
        *@function  选中内容时触发
        *
        * data 为已选内容
        *=====================================================*/
        this.selectd_ids = data.map(function (item) {if(item != null && item != undefined){return item.id}}).join();//需要删除的id

      },
      change_page(page){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 17:18
        *=======================================================
        *@function  选择页数时触发
        * page  当前选择的页数
        *=====================================================*/
        console.log("当前选择的页数是" + page);
      },
      change_page_size(page_size){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 17:18
        *=======================================================
        *@function  选择每页多少条时触发
        * page_size  当前每页多少条
        *=====================================================*/
        console.log("当前每页多少条" + page_size);
      },
      search_data(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 18:30
        *=======================================================
        *@function  搜索内容
        *=====================================================*/

        console.log(this.search_select);
        console.log(this.search_value);

      },
      remove_data(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 10:09
        *=======================================================
        *@function  删除信息
        *=====================================================*/
        if(this.selectd_ids.length > 0){
          console.log(this.selectd_ids);
        }else {
          this.$Message.error('请勾选要删除的用户~~');
        }

      },
      updata_data(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:11
        *=======================================================
        *@function  修改信息
        *=====================================================*/
        if(this.selectd_ids.length == 1){
          console.log(this.selectd_ids);
        }else {
          this.$Message.error('请勾选一个需要修改信息的用户~~');
        }
      },
      getUser_data(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:36
        *=======================================================
        *@function  获取初始化信息
        *=====================================================*/
        this.$http({
          method: 'get',
          url: '/User/user',
        }).then(function(res){
          var json = res.data ;

          this.table_data = json.user_data ;
          this.table_data = json.user_data ;

        }.bind(this)).catch(function(err){
          this.$Message.error('初始化数据失败，错误：'+ err);
        }.bind(this))
      }

    },
    mounted() {
      this.getUser_data() ;
    }
  }
</script>

<style scoped>

</style>
