<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>权限管理</BreadcrumbItem>
      <BreadcrumbItem>角色权限</BreadcrumbItem>
      <BreadcrumbItem>权限设置</BreadcrumbItem>
    </Breadcrumb>
    <Card :bordered="false">
      <Select v-model="model_role" @on-change="change_select" clearable filterable style="width:300px" placeholder="请先选择需要设置权限的角色">
        <Option v-for="item in cityList" :value="item.value"  :key="item.value">{{item.label}}</Option>
      </Select>
      <Button  v-if="CD_.btn_List.add_btn" type="success" style="float: right" @click="seve_menu" :disabled="spinShow">保存权限设置</Button>
    </Card>
    <div class="demo-spin-article"  style="position: relative;margin-top: 15px">
      <Row  :gutter="15">
        <Col span="8">
        <Card >
          <p slot="title">其选择该角色可以访问的菜单</p>
          <Tree :data="MuenData" show-checkbox multiple @on-check-change="checkAll" ref="tree"></Tree>
        </Card>
        </Col>
        <Col span="16" >
        <Card  dis-hover>
          <p slot="title">已选菜单功能选择
            <Checkbox
              style="float: right"
              :indeterminate="indeterminate"
              :value="checkBtnAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox></p>

          <Row  :gutter="15">
            <Col span="12" v-for="(item,index) in check_list" :key="item.item_name+index" style="margin-top: 10px">
              <Card :bordered="true">
                <div slot="title">{{item.item_name}}</div>
                <div>
                  <CheckboxGroup v-model="item.select_btn">
                    <Checkbox v-for="(children_item,children_index) in item.children" :key="children_item.btn_name+children_index"  :label="children_item.btn_name"></Checkbox>
                  </CheckboxGroup>
                </div>
              </Card>
            </Col>
          </Row>

        </Card>
        </Col>
      </Row>
      <Spin fix  v-if="spinShow">请先选择需要设置权限的角色</Spin>
    </div>

  </Layout>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
              spinShow: true,
              indeterminate: false,
              checkBtnAll: false,
              cityList: [
                {
                  value: '技术部',
                  label: '技术部'
                }
              ],
              model_role: "",
              check_muen:[] ,
              btn_muen:[

              ],
              MuenData:[
                {
                  title: '基础数据',
                  children: [
                    {
                      title: '用户管理',
                      children: [
                        {
                          title: '用户列表'
                        }
                      ]
                    }
                  ]
                }
              ],
              check_ids:'', //选中的菜单,
              check_list:[] //选中的菜单的功能
            }
        },
        methods: {
          handleCheckAll () {
            //全选
            if (this.indeterminate) {
              this.checkBtnAll = false;
            } else {
              this.checkBtnAll = !this.checkBtnAll;
            }
            this.indeterminate = false;

            if (this.checkBtnAll) { //全部选中

              for(var i = 0 ; i< this.check_list.length ; i++){
                for(var j = 0 ; j< this.check_list[i].children.length ; j++){
                  this.check_list[i].select_btn.push(this.check_list[i].children[j].btn_name) ;
                }
              }

            } else { //全部取消
              for(var i = 0 ; i< this.check_list.length ; i++){
                this.check_list[i].select_btn = [] ;
              }
            }
          },
          change_select(value){
            if (value === undefined){
              this.spinShow = true ;
            }else {
              this.spinShow = false ;
            }
            //重新拉取菜单数据
            this.getMenu() ;
          },
          checkAll(data) {
            //已选择的菜单
            if(data){
              this.check_muen = data ;
            }else {
              this.check_muen = this.$refs.tree.getCheckedNodes() ;
            }

            this.check_ids = this.check_muen.map(function (item) {
              return item.id
            }).join();//需要删除的id

            //获取权限菜单
            this.$http({
              method: 'post',
              url: this.CD_.qj_url+'index/Menu/getbtnMenu',
              data:{
                ids : this.check_ids,
                model_role : this.model_role
              }
            }).then(function(res){
              var json = res.data ;
              if(json.status){
                this.check_list = json.check_list ;
              }else{
//                this.$Notice.error({title: '请选择可以访问的菜单'});
                this.check_list = [] ;
              }
            }.bind(this)).catch(function(err){
              this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
            }.bind(this))
          },
          seve_menu(){
            /*======================================================
            *@author wf_Huang
            *@Time 2018/10/11 11:39
            *=======================================================
            *@function  保存角色权限设置
            *=====================================================*/
            var check_list = this.check_list.map(function (item) {

              return item.select_btn.length > 0 ? item.select_btn: '' ;
            }).join();//需要显示的ID

            //保存角色权限设置
            this.$http({
              method: 'post',
              url: this.CD_.qj_url+'index/Menu/seve_menu',
              data:{
                check_ids : this.check_ids,
                check_list : check_list,
                model_role : this.model_role,
              }
            }).then(function(res){
              var json = res.data ;
              if(json.status){
                this.$Notice.success({title: '权限设置成功'});
              }else{
                this.$Notice.error({title: '保存权限设置失败，请重试'});
              }
            }.bind(this)).catch(function(err){
              this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
            }.bind(this))
          },
          getMenu(){
            /*======================================================
            *@author wf_Huang
            *@Time 2018/9/14 13:56
            *=======================================================
            *@function  获取权限菜单
            *=====================================================*/
            this.$http({
              method: 'post',
              url: this.CD_.qj_url+'index/Menu/setMenucaidan',
              data:{
                model_role : this.model_role,
              }
            }).then(function(res){
              var json = res.data ;
              if(json.status){

                this.MuenData = json.menu_data ;

                //拉取菜单成功获取对应按钮选项
                var _this = this ;
                setTimeout(function () {
                  _this.checkAll();
                },1000) ;

              }else{
                this.$Notice.error({title: res.msg});
              }
            }.bind(this)).catch(function(err){
              this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
            }.bind(this))
          },
          getSelsctRole(){
            /*======================================================
             *@author wf_Huang
             *@Time 2018/10/11 9:19
             *=======================================================
             *@function  获取角色的下拉数据
             *=====================================================*/
            this.$http({
              method: 'get',
              url: this.CD_.qj_url+'index/Role/getSelsctRole'
            }).then(function(res){
              var json = res.data ;
              if(json.status){
                this.cityList = json.role_data ;

                //取得传递的参数
                var _this = this ;
                setTimeout(function () {
                  _this.model_role = _this.$route.query.model_role ;
                  if(_this.model_role !== undefined){
                    _this.spinShow = false ;
                    _this.getMenu()
                  }
                },1000) ;
              }else{
                this.$Notice.error({title: res.msg});
              }

            }.bind(this)).catch(function(err){
              this.$Notice.error({title: '操作失败',desc:'错误：'+ err});
            }.bind(this))
          }
        },
        mounted() {
          this.getSelsctRole() ;


        }
    }
</script>

<style scoped>

</style>
