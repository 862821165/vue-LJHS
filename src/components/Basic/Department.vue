<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>权限管理</BreadcrumbItem>
      <BreadcrumbItem>部门权限</BreadcrumbItem>
      <BreadcrumbItem>部门管理</BreadcrumbItem>
    </Breadcrumb>
    <Content>

      <Row :style="{margin:'10px 0'}">
        <i-col span="18">
          <ButtonGroup>
            <Button v-if="CD_.btn_List.remove_btn"  icon="md-trash" type="error" @click="remove_modal = true">删除</Button>
          </ButtonGroup>
          <Button v-if="CD_.btn_List.add_btn"   icon="md-person-add" type="success" @click="modal_add = true">添加</Button>
        </i-col>
        <i-col span="6">
          <i-input v-model="search_value" placeholder="部门名称">
            <Button slot="append" icon="ios-search" @click="search_data"></Button>
          </i-input>
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
      title="添加部门"
      v-model="modal_add"
      width="420">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="70">
        <FormItem label="部门名称" prop="name">
          <Input v-model.trim="formItem.name" placeholder="输入部门名"></Input>
        </FormItem>
        <FormItem label="部门备注" prop="description">
          <Input v-model.trim="formItem.description" type="textarea" :rows="4" placeholder="备注" />
        </FormItem>
        <FormItem label="启用状态" >
          <RadioGroup v-model="formItem.state">
            <Radio label="Enable">
              <span>启用</span>
            </Radio>
            <Radio label="Disable">
              <span>禁用</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="isLoading" @click="add_data('formItem')">确认提交</Button>
          <Button @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Drawer
      title="编辑部门"
      v-model="modal_edit"
      width="420">
      <Form ref="formItem_edit" :model="formItem_edit" :rules="ruleValidate_edit" :label-width="70">
        <FormItem label="部门名称" prop="name">
          <Input v-model.trim="formItem_edit.name" placeholder="输入部门名"></Input>
        </FormItem>
        <FormItem label="部门备注" prop="description">
          <Input v-model.trim="formItem_edit.description" type="textarea" :rows="4" placeholder="备注" />
        </FormItem>
        <FormItem label="启用状态" >
          <RadioGroup v-model="formItem_edit.state">
            <Radio label="Enable">
              <span>启用</span>
            </Radio>
            <Radio label="Disable">
              <span>禁用</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="isLoading" @click="edit_data('formItem_edit')">确认提交</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Drawer
      title="部门详情"
      v-model="modal_view"
      width="420">
      <Timeline>
        <TimelineItem>
          <p class="time user_text">基本信息</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                部门名称: {{formItem_view.name}}
              </div>
              <div class="ivu-col ivu-col-span-24">
                描述: {{formItem_view.description}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                成员数量: {{formItem_view.user_number}}
              </div>
            </div>
          </div>
        </TimelineItem>
        <TimelineItem>
          <p class="time user_text">状态</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                添加时间: {{formItem_view.date}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                启用状态: {{formItem_view.state === 'Disable'?'禁用':'启用'}}
              </div>
            </div>
          </div>
        </TimelineItem>
        <TimelineItem>
          <p class="time user_text">部门权限</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div v-for="(item,index) in formItem_view.department_menu_list" class="ivu-col ivu-col-span-8"><Tag color="default">{{item.menu_name}} </Tag></div>
              <div v-for="(item,index) in formItem_view.department_per_list" class="ivu-col ivu-col-span-12"><Tag color="primary">{{item.btn_name}} </Tag></div>
            </div>
          </div>
        </TimelineItem>
      </Timeline>

    </Drawer>

    <!--删除提示-->
    <Modal v-model="remove_modal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>您即将删除这选中的部门，该部门下的用户都将失去部门对应的权限。确认删除吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  :loading="modal_loading"  @click="remove_data">删除</Button>
      </div>
    </Modal>
  </Layout>
</template>

<script>
  export default {
    name: 'Department',
    data() {
      const validateData = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Age cannot be empty'));
        }
        // 请求后台
        this.$http({
          method: 'post',
          url: this.CD_.qj_url + 'index/Department/validateData',
          data: {
            value: value,
            field: rule.field,
          }
        }).then(function (res) {
          var json = res.data;
          if (json.status == 1) {
            return callback();
          } else {
            switch (rule.field) {
              case 'name':
                return callback(new Error('部门名称已存在'));
                break;
            }
          }

        }.bind(this)).catch(function (err) {
          return callback(new Error('输入内容校验失败'));
        }.bind(this))
      };
      return {
        search_value: '',//搜索框内容
        search_select: 'loginname',//搜索的类型
        modal_add: false,//添加弹窗
        modal_edit: false,//添加弹窗
        remove_modal: false,//删除确认窗口
        modal_loading: false,//删除loading
        modal_view: false,//添加弹窗
        selectd_ids: [],//选中的id
        isLoading: false,//提交数据时按钮的loading效果
        page: {
          page_current: 1,//分页显示第几页
          page_total: 40,//分页总条数
          page_size: 14,//每页多少条
        },
        formItem: {
          id: '',
          name: '',
          description: '',
          user_number: 0,
          state: 'Enable'
        },
        formItem_view: {
          id: '',
          name: '',
          description: '',
          user_number: '',
          department_menu_list: [],
          department_per_list: [],
          state: '',
          date: ''
        },
        formItem_edit: {
          id: '',
          name: '',
          description: '',
          user_number: '',
          state: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
            {validator: validateData, trigger: 'blur'}
          ]
        },
        ruleValidate_edit: {
          name: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '部门名称',
            key: 'name'
          },
          {
            title: '描述',
            key: 'description'
          },
          {
            title: '成员数量',
            key: 'user_number'
          },
          {
            title: '启用状态',
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
            width: 195,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px' ,
                    display:this.CD_.btn_List.per_btn?"inline-block":"none",
                  },
                  on: {
                    click: () => {
                      this.DPermissions_href(params.row)
                    }
                  }
                }, '权限设置'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    display:this.CD_.btn_List.view_btn?"inline-block":"none",
                  },
                  on: {
                    click: () => {
                      this.view_user(params.row)
                    }
                  }
                }, '详情')
              ]);
            }
          }
        ],
        table_data: [
          {
            id: 1,
            name: '',
            description: '',
            user_number: '',
            state: ''
          }

        ]
      }
    },
    methods: {
      handleReset (name) {
        //重置表单
        this.$refs[name].resetFields();
      },
      DPermissions_href(data){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/10/15 16:52
        *=======================================================
        *@function  跳转到设置权限
        *=====================================================*/
        this.$router.push({
          path:'./dpermissions',
          query:{
            model_dp:data.name}
        }) ;
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
        this.getDepartment_data();
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
        this.getDepartment_data();
      },
      search_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/11 18:30
        *=======================================================
        *@function  搜索内容
        *=====================================================*/
        this.getDepartment_data();

      },
      remove_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/10/10 15:18
        *=======================================================
        *@function  删除部门
        *=====================================================*/
        if (this.selectd_ids.length > 0) {
          this.modal_loading = true;
          this.$http({
            method: 'post',
            url: this.CD_.qj_url + 'index/Department/removeDepartment',
            data: {
              selectd_ids: this.selectd_ids
            }
          }).then(function (res) {
            var json = res.data;
            if (json.status == 1) {
              this.modal_loading = false ;
              this.remove_modal = false ;
              this.$Notice.success({title: '成功删除部门~~'});
              this.getDepartment_data();
            } else {
              this.$Notice.error({title: '删除部门失败~~'});
            }

          }.bind(this)).catch(function (err) {
            this.$Notice.error({title: '删除部门失败，错误：' + err});
          }.bind(this))
        } else {
          this.$Notice.warning({
            title: '请勾选要删除的部门~~',
          });
        }

      },
      updata_user(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  编辑部门
        *=====================================================*/
        this.formItem_edit.name = data.name;
        this.formItem_edit.description = data.description;
        this.formItem_edit.user_number = data.user_number;
        this.formItem_edit.state = data.state;
        this.formItem_edit.id = data.id;
        this.modal_edit = true;
      },
      view_user(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  查看部门
        *=====================================================*/
        this.formItem_view.name = data.name;
        this.formItem_view.description = data.description;
        this.formItem_view.user_number = data.user_number;
        this.formItem_view.state = data.state;
        this.formItem_view.date = data.date;
        this.formItem_view.department_menu_list = data.department_menu_list;
        this.formItem_view.department_per_list = data.department_per_list;
        this.modal_view = true;
      },
      edit_data(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  编辑部门
        *=====================================================*/
        this.isLoading = true;
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.$Loading.start();
            this.$http({
              method: 'post',
              url: this.CD_.qj_url + 'index/Department/addDepartment',
              data: {
                name: this.formItem_edit.name,
                description: this.formItem_edit.description,
                user_number: this.formItem_edit.user_number,
                state: this.formItem_edit.state,
                id: this.formItem_edit.id
              }
            }).then(function (res) {
              var json = res.data
              if (json.status) {
                this.$Notice.success({title: '成功编辑部门~~~'});
                this.getDepartment_data();
                this.$Loading.finish();
                this.modal_edit = false ;
              } else {
                this.$Notice.error({title: '编辑部门失败~~~'});
                this.$Loading.error();
              }
              this.isLoading = false;
            }.bind(this)).catch(function (err) {
              this.$Notice.error({title: '编辑部门失败，错误：' + err});
              this.$Loading.error();
              this.isLoading = false;
            }.bind(this))
          } else {
            this.$Notice.error({title: '部门信息填写有误'});
            this.isLoading = false;
          }
        })
      },
      add_data(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/10/10 14:28
        *=======================================================
        *@function  添加部门
        *=====================================================*/
        this.isLoading = true;
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.$Loading.start();
            this.$http({
              method: 'post',
              url: this.CD_.qj_url + 'index/Department/addDepartment',
              data: {
                name: this.formItem.name,
                description: this.formItem.description,
                user_number: this.formItem.user_number,
                state: this.formItem.state
              }
            }).then(function (res) {
              var json = res.data
              if (json.status) {
                this.$Notice.success({title: '成功添加部门~~~'});
                this.getDepartment_data();
                this.$Loading.finish();
                this.modal_add = false ;
              } else {
                this.$Notice.error({title: '添加部门失败~~~'});
                this.$Loading.error();
              }
              this.isLoading = false;
            }.bind(this)).catch(function (err) {
              this.$Notice.error({title: '添加部门失败，错误：' + err});
              this.$Loading.error();
              this.isLoading = false;
            }.bind(this))
          } else {
            this.$Notice.error({title: '部门信息填写有误'});
            this.isLoading = false;
          }
        })
      },
      getDepartment_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:36
        *=======================================================
        *@function  获取初始化信息、搜索、分页
        *=====================================================*/
        this.$http({
          method: 'post',
          url: this.CD_.qj_url + 'index/Department/getDepartment',
          data: {
            search_value: this.search_value,
            page_current: this.page.page_current,
            page_size: this.page.page_size
          }
        }).then(function (res) {
          var json = res.data;
          if (json.status) {
            this.table_data = json.Department_data;
            this.page = json.page;
            this.$Loading.finish();
          } else {
            this.$Notice.error({title: '部门不存在~~~'});
            this.$Loading.error();
          }


        }.bind(this)).catch(function (err) {
          this.$Notice.error({title: '初始化数据失败，错误：' + err});
        }.bind(this))
      }

    },
    mounted() {
      this.getDepartment_data();
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
