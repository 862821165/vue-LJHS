// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import locale from 'iview/dist/locale/zh-CN';
import VueParticles from 'vue-particles';
import axios from 'axios' ;
import Vuex from 'vuex' ; //引入状态管理

import C_data from './components/Common/ComData' //公共文件

Vue.use(VueParticles) ;
Vue.use(iView, { locale });
Vue.config.productionTip = false ;
Vue.prototype.$http = axios ;
Vue.use(Vuex) ;

Vue.prototype.CD_ = C_data ; //挂载到全局文件中

const ADD_COUNT = 'ADD_COUNT'; // 用常量代替事件类型，使得代码更清晰
const REMOVE_COUNT = 'REMOVE_COUNT';
//注册状态管理全局参数
var store = new Vuex.Store({
  state:{
    token:'',
    userID:''
  },
  mutations: {
    //写法与getters相类似
    //组件想要对于vuex 中的数据进行的处理
    //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
    //内部操作必须在此刻完成(同步)
    [ADD_COUNT] (state, token) { // 第一个参数为 state 用于变更状态 登录
      sessionStorage.setItem("token", token);
      state.token = token;
    },
    [REMOVE_COUNT] (state, token) { // 退出登录
      sessionStorage.removeItem("token", token);
      state.token = token;
    },
  }
});

//给所有请求头部加上token
axios.interceptors.request.use(
  config => {
    //在所有请求头部添加token值
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);
//返回参数时的拦截
axios.interceptors.response.use(
  response => {
    if(response.data.status == 90002 || response.data.status == 90003){

      iView.Notice.error({title: '请求验证未通过',desc:response.data.msg,duration: 5});
      router.replace({ //跳转到登录页面
        path: '/login',
        query: { redirect: router.history.current.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }

    return response;
  },
  error => {
    if (error.response) {
      return Promise.reject(error.response.data) //返回接口返回的错误信息
    }
  }
);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();//loadong 效果

  //进入登录页面的时候清除 token
  if(to.path === '/login' ){
    sessionStorage.removeItem("token", '');
    sessionStorage.removeItem("user_Data", '');
  }

  store.state.token = sessionStorage.getItem('token');//获取本地存储的token

  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token !== "" && store.state.token !== null) {  // 通过vuex state获取当前的token是否存在
      next();
    }else {
      next({
        path: '/login',
        query: {redirect: from.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }

  }else {
    next();
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish();
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //注册组件
  components: { App },
  template: '<App/>'
}) ;



