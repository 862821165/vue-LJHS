<template>
    <div class="sider">
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu active-name="1-1" theme="light" width="auto" :style="{height:'100%' }" :open-names="['1']">
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              基础数据
            </template>
            <router-link to="/user"><MenuItem name="1-1">用户管理</MenuItem></router-link>
            <router-link to="/role"><MenuItem name="1-2">角色管理</MenuItem></router-link>
            <router-link to="/permissions"><MenuItem name="1-3">权限管理</MenuItem></router-link>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              Item 2
            </template>
            <MenuItem name="2-1">Option 1</MenuItem>
            <MenuItem name="2-2">Option 2</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-analytics"></Icon>
              Item 3
            </template>
            <MenuItem name="3-1">Option 1</MenuItem>
            <MenuItem name="3-2">Option 2</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>
