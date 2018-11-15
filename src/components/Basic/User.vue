<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>基础数据</BreadcrumbItem>
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>用户列表</BreadcrumbItem>
    </Breadcrumb>
    <Content>

      <Row :style="{margin:'10px 0'}">
        <i-col span="18">
          <ButtonGroup>
            <Button v-if="CD_.btn_List.remove_btn" icon="md-trash" type="error" @click="remove_modal = true">删除</Button>
            <Button v-if="CD_.btn_List.password_btn"  icon="md-key" type="warning" @click="updata_modal = true">重置密码</Button>
          </ButtonGroup>
          <Button v-if="CD_.btn_List.add_btn"  icon="md-person-add" type="success" @click="modal_add = true">添加</Button>
        </i-col>
        <i-col span="6">
          <i-input v-model="search_value" placeholder="用户名、手机号、邮箱">
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
      title="添加用户"
      v-model="modal_add"
      width="420">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="70">
        <FormItem label="登录账号" prop="loginname">
          <Input v-model.trim="formItem.loginname" placeholder="输入登录账号"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model.trim="formItem.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model.number="formItem.mobile" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="电子邮箱" prop="email">
          <Input v-model.trim="formItem.email" placeholder="输入电子邮箱"></Input>
        </FormItem>
        <FormItem label="角色" prop="role">
          <Select v-model="formItem.role">
            <Option v-for="(item,index) in columns[5].filters" :value="item.value" :key="item.label">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select v-model="formItem.department">
            <Option v-for="(item,index) in columns[6].filters" :value="item.label" :key="item.label">{{item.label}}
            </Option>
          </Select>
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
      title="编辑用户"
      v-model="modal_edit"
      width="420">
      <Form ref="formItem_edit" :model="formItem_edit" :rules="ruleValidate_edit" :label-width="70">
        <FormItem label="登录账号" prop="loginname">
          <Input v-model.trim="formItem_edit.loginname" placeholder="输入登录账号"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model.trim="formItem_edit.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model.number="formItem_edit.mobile" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="电子邮箱" prop="email">
          <Input v-model.trim="formItem_edit.email" placeholder="输入电子邮箱"></Input>
        </FormItem>
        <FormItem label="角色" prop="role">
          <Select v-model="formItem_edit.role">
            <Option v-for="(item,index) in columns[5].filters" :value="item.label" :key="item.label">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select v-model="formItem_edit.department">
            <Option v-for="(item,index) in columns[6].filters" :value="item.label" :key="item.label">{{item.label}}
            </Option>
          </Select>
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
      title="用户详情"
      v-model="modal_view"
      width="420">
      <Timeline>
        <TimelineItem>
          <p class="time user_text">基本信息</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                登录账号: {{formItem_view.loginname}}
              </div>
              <div class="ivu-col ivu-col-span-24">
                用户名称: {{formItem_view.username}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                手机号: {{formItem_view.mobile}}
              </div>
              <div class="ivu-col ivu-col-span-24">
                电子邮箱: {{formItem_view.email}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                角色: {{formItem_view.role}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                部门: {{formItem_view.department}}
              </div>
            </div>
          </div>
        </TimelineItem>
        <TimelineItem>
          <p class="time user_text">状态</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                注册时间: {{formItem_view.date}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-24">
                是否激活: {{formItem_view.token == null?'未激活':'已激活'}}
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
          <p class="time user_text">
            用户权限
            <Tooltip max-width="200" content="用户权限的级别高的可以操作同一级别或者低级别的用户内容" placement="top">
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-12">
                添加级别: {{formItem_view.add_per}}
              </div>
              <div class="ivu-col ivu-col-span-12">
                删除级别: {{formItem_view.remove_per}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-12">
                审核级别: {{formItem_view.audit_per}}
              </div>
              <div class="ivu-col ivu-col-span-12">
                查看级别: {{formItem_view.view_per}}
              </div>
            </div>
            <div class="ivu-row">
              <div class="ivu-col ivu-col-span-12">
                编辑/变更级别: {{formItem_view.edit_per}}
              </div>
            </div>
          </div>
        </TimelineItem>
        <TimelineItem>
          <p class="time user_text">角色权限</p>
          <div class="demo-drawer-profile">
            <div class="ivu-row">
              <div v-for="(item,index) in formItem_view.role_menu_list" class="ivu-col ivu-col-span-8"><Tag color="default">{{item.menu_name}} </Tag></div>
              <div v-for="(item,index) in formItem_view.role_per_list" class="ivu-col ivu-col-span-12"><Tag color="primary">{{item.btn_name}} </Tag></div>
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
        <p>您即将删除这选中的用户.</p>
        <p>确认删除吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  :loading="modal_loading"  @click="remove_data">删除</Button>
      </div>
    </Modal>

    <!--重置提示-->
    <Modal v-model="updata_modal" width="360">
      <p slot="header" style="color:#FF9900;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>重置密码确认</span>
      </p>
      <div style="text-align:center">
        <p>您即将重置这选中的用户密码为 888888.</p>
        <p>确认重置吗?</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long  :loading="modal_loading"  @click="updata_data">重置密码</Button>
      </div>
    </Modal>

  </Layout>
</template>

<script>
  export default {
    name: 'User',
    data() {
      const validateData = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Age cannot be empty'));
        }
        // 请求后台
        this.$http({
          method: 'post',
          url: this.CD_.qj_url + 'index/User/validateData',
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
              case 'loginname':
                return callback(new Error('登录账号已存在'));
                break;
              case 'mobile':
                return callback(new Error('手机号已存在'));
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
        updata_modal: false,//重置密码确认窗口
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
          loginname: '',
          username: '',
          mobile: '',
          email: '',
          add_per: '',
          remove_per: '',
          edit_per: '',
          view_per: '',
          audit_per: '',
          state: 'Enable',
          department: '',
          role: ''
        },
        formItem_view: {
          id: '',
          loginname: '',
          username: '',
          mobile: '',
          email: '',
          role: '',
          date: '',
          token: '',
          add_per: '',
          remove_per: '',
          edit_per: '',
          view_per: '',
          audit_per: '',
          role_per_list: [],
          role_menu_list: [],
          department_menu_list: [],
          department_per_list: [],
          state: '',
          department: '',
          time_out: '',
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
        ruleValidate: {
          loginname: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {validator: validateData, trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          mobile: [
            {required: true, type: 'number', message: '手机号填写不正确', trigger: 'blur'},
            {validator: validateData, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式有误', trigger: 'blur'}
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          department: [
            {required: true, message: '请选择部门', trigger: 'change'}
          ],
        },
        ruleValidate_edit: {
          loginname: [
            {required: true, message: '请输入登录账号', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          mobile: [
            {required: true, type: 'number', message: '手机号填写不正确', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式有误', trigger: 'blur'}
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          department: [
            {required: true, message: '请选择部门', trigger: 'change'}
          ],
        },
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
          },{
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
            width: 125,
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
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
      remove_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 10:09
        *=======================================================
        *@function  删除信息
        *=====================================================*/
        if (this.selectd_ids.length > 0) {
          this.modal_loading = true;
          this.$http({
            method: 'post',
            url: this.CD_.qj_url + 'index/User/removeUser',
            data: {
              selectd_ids: this.selectd_ids
            }
          }).then(function (res) {
            var json = res.data;
            if (json.status == 1) {
              this.modal_loading = false ;
              this.remove_modal = false ;
              this.$Notice.success({title: '成功删除用户~~'});
              this.getUser_data();
            } else {
              this.$Notice.error({title: '删除用户失败~~'});
            }

          }.bind(this)).catch(function (err) {
            this.$Notice.error({title: '删除用户失败，错误：' + err});
          }.bind(this))
        } else {
          this.$Notice.warning({
            title: '请勾选要删除的用户~~',
          });
        }

      },
      updata_data() {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:11
        *=======================================================
        *@function  重置密码信息 ‘888888’
        *=====================================================*/
        if (this.selectd_ids.length > 0) {
          this.$http({
            method: 'post',
            url: this.CD_.qj_url + 'index/User/updataUser',
            data: {
              selectd_ids: this.selectd_ids
            }
          }).then(function (res) {
            var json = res.data;
            if (json.status == 1) {
              this.updata_modal = false ;
              this.$Notice.success({title: '成功重置密码用户，密码未默认‘888888’~~'});
              this.getUser_data();
            } else {
              this.$Notice.error({title: '重置密码失败~~'});
            }

          }.bind(this)).catch(function (err) {
            this.$Notice.error({title: '重置密码失败，错误：' + err});
          }.bind(this))
        } else {
          this.$Notice.warning({
            title: '请勾选要重置密码的的用户~~',
          });
        }
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
      view_user(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  查看用户
        *=====================================================*/
        this.formItem_view.loginname = data.loginname;
        this.formItem_view.username = data.username;
        this.formItem_view.mobile = data.mobile;
        this.formItem_view.email = data.email;
        this.formItem_view.department = data.department;
        this.formItem_view.role = data.role;
        this.formItem_view.add_per = data.add_per;
        this.formItem_view.remove_per = data.remove_per;
        this.formItem_view.edit_per = data.edit_per;
        this.formItem_view.view_per = data.view_per;
        this.formItem_view.audit_per = data.audit_per;
        this.formItem_view.id = data.id;
        this.formItem_view.date = data.date;
        this.formItem_view.state = data.state;
        this.formItem_view.token = data.token;
        this.formItem_view.time_out = data.time_out;
        this.formItem_view.role_per_list = data.role_per_list;
        this.formItem_view.role_menu_list = data.role_menu_list;
        this.formItem_view.department_menu_list = data.department_menu_list;
        this.formItem_view.department_per_list = data.department_per_list;
        this.modal_view = true;
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
                this.$Notice.success({title: '成功编辑用户~~~'});
                this.getUser_data();
                this.$Loading.finish();
                this.modal_edit = false ;
              } else {
                this.$Notice.error({title: '编辑用户失败~~~'});
                this.$Loading.error();
              }
              this.isLoading = false;
            }.bind(this)).catch(function (err) {
              this.$Notice.error({title: '编辑用户失败，错误：' + err});
              this.$Loading.error();
              this.isLoading = false;
            }.bind(this))
          } else {
            this.$Notice.error({title: '用户信息填写有误'});
            this.isLoading = false;
          }
        })
      },
      add_data(data) {
        /*======================================================
        *@author wf_Huang
        *@Time 2018/6/12 11:55
        *=======================================================
        *@function  添加用户
        *=====================================================*/
        this.isLoading = true;
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.$Loading.start();
            this.$http({
              method: 'post',
              url: this.CD_.qj_url + 'index/User/addUser',
              data: {
                loginname: this.formItem.loginname,
                username: this.formItem.username,
                mobile: this.formItem.mobile,
                email: this.formItem.email,
                remove_per: this.formItem.remove_per,
                edit_per: this.formItem.edit_per,
                view_per: this.formItem.view_per,
                audit_per: this.formItem.audit_per,
                add_per: this.formItem.add_per,
                department: this.formItem.department,
                state: this.formItem.state,
                role: this.formItem.role
              }
            }).then(function (res) {
              var json = res.data
              if (json.status) {
                this.$Notice.success({title: '成功添加用户~~~'});
                this.getUser_data();
                this.$Loading.finish();
                this.modal_add = false ;
              } else {
                this.$Notice.error({title: '添加用户失败~~~'});
                this.$Loading.error();
              }
              this.isLoading = false;
            }.bind(this)).catch(function (err) {
              this.$Notice.error({title: '添加用户失败，错误：' + err});
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
          this.$Notice.error({title: '初始化数据失败，错误：' + err});
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
