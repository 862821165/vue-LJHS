<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>权限管理</BreadcrumbItem>
      <BreadcrumbItem>角色权限</BreadcrumbItem>
      <BreadcrumbItem>成员列表</BreadcrumbItem>
    </Breadcrumb>
    <Content>

      <Row :style="{margin:'10px 0'}">
        <i-col span="24">
          <Card :bordered="false">
            <div slot="title">
              <Row>
                <i-col span="18">
                  角色成员筛选
                </i-col>
                <i-col span="6">
                  <i-input v-model="search_value" placeholder="用户名、手机号、邮箱">
                    <Button slot="append" icon="ios-search" @click="search_data"></Button>
                  </i-input>
                </i-col>
              </Row>
            </div>
            <div>
              <Button  v-for="(item,index) in navLists" :type="changeRed == index ? 'dashed' :'text' " @click="changeButton(index)">{{item.text}}</Button>
            </div>
          </Card>
        </i-col>

      </Row>

      <Table height="713" :columns="columns" :data="table_data" @on-selection-change="selected_item"></Table>
      <div style="float: right ; margin: 10px">
        <Page :total="page.page_total"
              :page-size="page.page_size"
              :current="page.page_current"
              :page-size-opts="[14,20,30,40,50]"
              size="small" show-elevator show-sizer
              @on-change="change_page"
              @on-page-size-change="change_page_size"></Page>
      </div>
    </Content>


    <Drawer
      title="重置角色"
      v-model="modal_edit"
      width="420">
      <Form ref="formItem_edit" :model="formItem_edit" :label-width="70">
        <FormItem label="角色" prop="role">
          <Select v-model="formItem_edit.role">
            <Option v-for="(item,index) in columns[5].filters" :value="item.label" :key="item.label">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="isLoading" @click="edit_data('formItem_edit')">确认提交</Button>
        </FormItem>
      </Form>
    </Drawer>


  </Layout>
</template>

<script>
  export default {
    name: 'RoleList',
    data() {
      return {
        tyle_name:'text' ,
        navLists:[
          {
            "text":"全部"
          },
          {
            "text":"管理员"
          },
          {
            "text":"超级管理员"
          },
          {
            "text":"临时角色"
          }
        ],
        changeRed: 0,//第几个按钮
        search_value: '',//搜索框内容
        search_select: 'loginname',//搜索的类型
        modal_edit: false,//添加弹窗
        updata_modal: false,//重置密码确认窗口
        modal_loading: false,//删除loading
        selectd_ids: [],//选中的id
        isLoading: false,//提交数据时按钮的loading效果
        page: {
          page_current: 1,//分页显示第几页
          page_total: 40,//分页总条数
          page_size: 14,//每页多少条
        },
        formItem_edit: {
          id: '',
          loginname: '',
          username: '',
          mobile: '',
          email: '',
          add_per: '',
          remove_per: '',
          edit_per: '',
          view_per: '',
          audit_per: '',
          state: '',
          department: '',
          role: ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
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
            title: '角色',
            key: 'role',
            filters: [
              {
                label: '管理员',
                value: 1
              },
              {
                label: '普通用户',
                value: 2
              }, {
                label: 'vip用户',
                value: 3
              },
            ],
            filterMethod(value, row) {
              return row.role.indexOf(value) > -1;
            }
          },
          {
            title: '部门',
            key: 'department',
            filters: [
              {
                label: '管理员',
                value: 1
              },
              {
                label: '普通用户',
                value: 2
              }, {
                label: 'vip用户',
                value: 3
              },
            ],
            filterMethod(value, row) {
              return row.department.indexOf(value) > -1;
            }
          },
          {
            title: '账户启用状态',
            key: 'state',
            render: (h, params) => {
              const row = params.row;
              const color = row.state === 'Disable' ? 'error' : 'success';
              const text = row.state === 'Disable' ? '禁用' : '启用';

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 80,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                    display:this.CD_.btn_List.edit_btn?"inline-block":"none",
                  },
                  on: {
                    click: () => {
                      this.updata_user(params.row)
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        table_data: [
          {
            id: 1,
            loginname: 'John Brown',
            username: '李四',
            mobile: '15179236849',
            email: 'web_hwf@sina.com',
            role: '管理员'
          }

        ]
      }
    },
    methods: {
      changeButton(index){
        this.changeRed = index;
      },
      handleReset (name) {
        //重置表单
        this.$refs[name].resetFields();
      },
      selected_item(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 16:41
        *=======================================================
        *@function  选中内容时触发
        *
        * data 为已选内容
        *=====================================================*/
        this.selectd_ids = data.map(function (item) {
          if (item != null && item != undefined) {
            return item.id
          }
        }).join();//需要删除的id

      },
      change_page(page) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 17:18
        *=======================================================
        *@function  选择页数时触发
        * page  当前选择的页数
        *=====================================================*/
        this.page.page_current = page
        this.getUser_data();
      },
      change_page_size(page_size) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 17:18
        *=======================================================
        *@function  选择每页多少条时触发
        * page_size  当前每页多少条
        *=====================================================*/
        this.page.page_size = page_size
        this.getUser_data();
      },
      search_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 18:30
        *=======================================================
        *@function  搜索内容
        *=====================================================*/
        this.getUser_data();

      },
      updata_user(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  编辑用户
        *=====================================================*/
        this.formItem_edit.loginname = data.loginname;
        this.formItem_edit.username = data.username;
        this.formItem_edit.mobile = parseInt(data.mobile);
        this.formItem_edit.email = data.email;
        this.formItem_edit.role = data.role;
        this.formItem_edit.add_per = data.add_per;
        this.formItem_edit.remove_per = data.remove_per;
        this.formItem_edit.edit_per = data.edit_per;
        this.formItem_edit.view_per = data.view_per;
        this.formItem_edit.audit_per = data.audit_per;
        this.formItem_edit.department = data.department;
        this.formItem_edit.state = data.state
        this.formItem_edit.id = data.id;
        this.modal_edit = true;
      },
      edit_data(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  编辑用户
        *=====================================================*/
        this.isLoading = true;
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.$Loading.start();
            this.$http({
              method: 'post',
              url: this.CD_.qj_url + 'index/User/addUser',
              data: {
                loginname: this.formItem_edit.loginname,
                username: this.formItem_edit.username,
                mobile: this.formItem_edit.mobile,
                email: this.formItem_edit.email,
                department: this.formItem_edit.department,
                remove_per: this.formItem_edit.remove_per,
                edit_per: this.formItem_edit.edit_per,
                view_per: this.formItem_edit.view_per,
                audit_per: this.formItem_edit.audit_per,
                add_per: this.formItem_edit.add_per,
                role: this.formItem_edit.role,
                state: this.formItem_edit.state,
                id: this.formItem_edit.id
              }
            }).then(function (res) {
              var json = res.data
              if (json.status) {
                this.$Notice.success({title: '成功重置用户角色~~~'});
                this.getUser_data();
                this.$Loading.finish();
                this.modal_edit = false ;
              } else {
                this.$Notice.error({title: '重置用户角色失败~~~'});
                this.$Loading.error();
              }
              this.isLoading = false;
            }.bind(this)).catch(function (err) {
              this.$Notice.error({title: '重置用户角色失败，错误：',desc:'错误：'+ err});
              this.$Loading.error();
              this.isLoading = false;
            }.bind(this))
          } else {
            this.$Notice.error({title: '用户信息填写有误'});
            this.isLoading = false;
          }
        })
      },
      getUser_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:36
        *=======================================================
        *@function  获取初始化信息、搜索、分页
        *=====================================================*/
        this.$http({
          method: 'post',
          url: this.CD_.qj_url + 'index/User/getUser',
          data: {
            search_value: this.search_value,
            page_current: this.page.page_current,
            page_size: this.page.page_size
          }
        }).then(function (res) {
          var json = res.data;
          if (json.status) {
            this.table_data = json.user_data;
            this.columns[5].filters = json.role_data;
            this.columns[6].filters = json.department_data;
            this.page = json.page;
            this.$Loading.finish();
          } else {
            this.$Notice.error({title: '用户不存在~~~'});
            this.$Loading.error();
          }


        }.bind(this)).catch(function (err) {
          this.$Notice.error({title: '初始化数据失败，错误：',desc:'错误：'+ err});
        }.bind(this))
      }

    },
    mounted() {
      this.getUser_data();
    }
  }
</script>

<style scoped>
  .user_text{
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85098);
    line-height: 18px;
    display: block;
    margin-bottom: 16px;
  }
  .ivu-col{
    font-size: 14px;
    line-height: 35px;
  }
</style>
