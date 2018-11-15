<!--
  -@页面功能 ： 注册功能
  -@time : 2018/6/7
  -@备注：
  -->
<template>

  <div class="login">
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="canvas gradient"
    ></vue-particles>

    <div class="contend">
      <Card style="width:400px;margin: 200px auto;background-color: rgba(255, 255, 255, 0.46)">
        <p slot="title">注册</p>
        <a href="javascript:;" @click="to_url()" slot="extra">
          <Icon type="person-add"></Icon>
          登录
        </a>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="loginname">
            <Input type="text" v-model="formInline.loginname" placeholder="请输入登录名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="username">
            <Input type="text" v-model="formInline.username" placeholder="请输入真实姓名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="mobile">
            <Input type="text" v-model="formInline.mobile" placeholder="请输入手机号">
            <Icon type="md-phone-portrait" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="email">
            <Input type="text" v-model="formInline.email" placeholder="请输入邮箱">
            <Icon type="ios-mail" slot="prepend"></Icon>
            </Input>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">注册</Button>
          </FormItem>
        </Form>
      </Card>

    </div>

  </div>
</template>

<script scoped>
  import {jquery} from '../../assets/js/jquery-2.1.1.min.js' ;
  import {color_function} from '../../assets/js/color.js' ;

  export default {
    name: '',

    data() {
      const validateData = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Age cannot be empty'));
        }
        // 请求后台
        this.$http({
          method: 'post',
          url: this.CD_.qj_url+'index/User/validateData',
          data:{
            value: value,
            field: rule.field,
          }
        }).then(function(res){
          var json = res.data ;
          if(json.status == 1){
            return callback();
          }else {
            switch(rule.field)
            {
              case 'loginname':
                return callback(new Error('登录账号已存在'));
                break;
              case 'mobile':
                return callback(new Error('手机号已存在'));
                break;
            }
          }

        }.bind(this)).catch(function(err){
          return callback(new Error('输入内容校验失败'));
        }.bind(this))
      };
      return {
        totalTime:2,
        formInline: {
          loginname: '',
          username: '',
          mobile: '',
          email: '',
          password: ''
        },
        ruleInline: {
          loginname: [
            {required: true, message: '请输入登录名', trigger: 'blur'},
            { validator: validateData, trigger: 'blur' }
          ],
          username: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度最小为6', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { validator: validateData, trigger: 'blur' }
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email',  message: '邮箱格式不正确', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      to_url(){
        /*======================================================
        *@author wf_Huang
        *@Time 2018/8/20 14:56
        *=======================================================
        *@function  跳转地址
        *=====================================================*/
        this.$router.push('/login')
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Loading.start();

            this.$http({
              method: 'post',
              url: this.CD_.qj_url+'index/User/regist',
              data:{
                loginname: this.formInline.loginname,
                username: this.formInline.username,
                mobile: this.formInline.mobile,
                email: this.formInline.email,
                password: this.formInline.password
              }
            }).then(function(res){
              var json = res.data

              if(json.status){
                this.$Message.success('注册成功，即将前往登录~~~');
                let clock = window.setInterval(() => {
                  this.totalTime-- ;
                  if (this.totalTime < 0) {
                    window.clearInterval(clock) ;
                    this.$Loading.finish();
                    this.$router.push('/login') ;
                  }
                },1000)
              }else{
                this.$Message.error(json.msg);
                this.$Loading.error();
              }

            }.bind(this)).catch(function(err){
              this.$Message.error('注册失败，错误：'+ err);
              this.$Loading.error();
            }.bind(this))

          } else {
            this.$Message.error('注册信息有误，请核对再注册~~');
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ivu-card-head {
    border-bottom: 1px solid rgba(233, 234, 236, 0.35);
  }
  .login {

    .ivu-card-bordered {
      border-color: rgba(233, 234, 236, 0.2);
    }
    .canvas {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .contend {

    }
  }
</style>
