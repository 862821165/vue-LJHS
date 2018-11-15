import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Login'
import Regist from '@/components/Login/Regist'
import P404 from '@/components/404/404'
import Loading from '@/components/404/Loading'
import Main from '@/components/Main'
import User from '@/components/Basic/User' //用户
import Role from '@/components/Basic/Role' //角色
import Department from '@/components/Basic/Department'  //部门
import RPermissions from '@/components/Basic/RPermissions'  //角色权限设置
import DPermissions from '@/components/Basic/DPermissions'  //部门权限设置
import RoleList from '@/components/Basic/RoleList'  //角色成员列表

Vue.use(Router)

export default new Router({
  mode: 'hash',//history
  routes: [
    {
      path: '/login',//登录页
      name: 'Login',
      component: Login
    },
    {
      path: '/regist',//注册页
      name: 'Regist',
      component: Regist
    },
    {
      path: '/',//首页
      name: 'Main',
      component: Main,
      redirect: '/Loading',//默认子路由
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          path: 'user',//用户管理
          component: User,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'role',//角色管理
          component: Role,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'department',//部门
          component: Department,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'rpermissions',//角色权限设置
          component: RPermissions,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'dpermissions',//部门权限设置
          component: DPermissions,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'rolelist',//角色成员列表
          component: RoleList,
          meta: {
            requireAuth: true,
          },
        },
        {
          path: 'Loading',//等待页面
          component: Loading,
          meta: {
            requireAuth: true,
          },
        }
      ]
    },
    { path: '*', component: P404 }
  ]
})


