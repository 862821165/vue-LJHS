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
              <p slot="title">登录</p>
              <a href="javascript:;" @click="to_url()" slot="extra">
                  <Icon type="person-add"></Icon>
                  注册
              </a>
              <Form ref="formInline" :model="formInline" :rules="ruleInline">
                  <FormItem prop="user">
                      <Input type="text" v-model="formInline.user" placeholder="请输入用户名">
                          <Icon type="ios-person-outline" slot="prepend"></Icon>
                      </Input>
                  </FormItem>
                  <FormItem prop="password">
                      <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                           <Icon type="ios-lock-outline" slot="prepend"></Icon>
                      </Input>
                  </FormItem>
                  <FormItem>
                      <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
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
      return {
        totalTime:2,
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度最小为6', trigger: 'blur'}
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
        this.$router.push('/regist')
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Loading.start();

            this.$http({
              method: 'post',
              url: this.CD_.qj_url+'index/User/login',
              data:{
                loginname : this.formInline.user ,
                password : this.formInline.password ,
              }
            }).then(function(res){
              var json = res.data ;
              if(json.status){

                this.CD_.user_Data = json.data ;
                window.localStorage.setItem('user_Data',JSON.stringify(json.data)) ;

                this.$Message.success('登录成功，欢迎回来管理员~~~');
                this.$store.commit('ADD_COUNT', json.token);

                let clock = window.setInterval(() => {
                  this.totalTime-- ;
                  if (this.totalTime < 0) {
                    window.clearInterval(clock) ;
                    this.$Loading.finish();
                    this.$router.push('/') ;
                  }
                },1000)
              }else{
                this.$Message.error(json.msg);
                this.$Loading.error();
              }

            }.bind(this)).catch(function(err){
              this.$Message.error('登录失败，错误：'+ err);
              this.$Loading.error();
            }.bind(this))

          } else {
            this.$Message.error('请填写完整的登录信息~~');
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
