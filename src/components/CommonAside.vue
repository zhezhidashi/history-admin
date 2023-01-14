<template>
    <el-menu 
      default-active="1-4-1" 
      class="el-menu-vertical-demo" 
      @open="handleOpen" 
      @close="handleClose" 
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
    <h3>{{ isCollapse ? "后台" : "后台管理系统" }}</h3>
      <el-menu-item v-for="item in noChildren" :key="item.dataPath" :index="item.dataPath"
        @click="clickMenu(item)"
      >
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </el-menu-item>

      <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
        <template slot="title">
          <i :class="'el-icon-' + item.icon"></i>
          <span slot="title">{{item.label}}</span>
        </template>
        <el-menu-item-group v-for="subItem in item.children" :key="subItem.dataPath">
          <el-menu-item :index="subItem.path"
            @click="clickMenu(subItem)"
          >
            {{subItem.label}}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
        
    </el-menu>
</template>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
  height: 100vh;
  border: none;
  h3{
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
		margin: 0px;
    font-weight: 400;
  }
}
</style>

<script>
import Cookie from 'js-cookie';
export default {
    data() {
      return {
          
      };
    },
    methods: {
      handleOpen(key, keyPath) {
          console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
          console.log(key, keyPath);
      },
      clickMenu(item){
        // console.log(item.path);
        if(this.$route.path === item.path && item.dataPath === this.$store.state.data.dataPath){
          return
        }
        if(this.$route.path !== item.path){
          this.$router.push(item.path)
        }
        this.$store.commit('setTemplateId', item.templateId)
        this.$store.commit('setDataPath', item.dataPath)
        this.$store.commit('selectMenu', {
          label: item.label,
          templateId: item.templateId,
          dataPath:  item.dataPath
        })
        // this.$store.commit('selectMenu', item)
      }
    },
    computed:{
      noChildren(){
        return this.menu.filter(item => !item.children)
      },
      hasChildren(){
        return this.menu.filter(item => item.children)
      },
      isCollapse(){
        return this.$store.state.tab.isCollapse
      },
      menu(){
        return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu
      }
    },
    mounted(){
      console.log('Menu: ', this.menu);
      console.log('Vue: ', this);
    }
}
</script>