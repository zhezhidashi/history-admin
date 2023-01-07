<template>
    <div class="header-container">
        <div class="l-content">
            <el-button @click="handleMenu" icon="el-icon-menu" size="mini" style="margin-right: 20px"></el-button>
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">
                    {{ item.label }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown trigger="click" @command="handleDropdownClick">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right">
                    <img class="user" src="../assets/images/user.png" alt="">
                  </i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
        </div>
    </div>
    <!-- <header>
        <div class="l-content">l-content</div>
        <div class="r-content"></div>
    </header> -->
</template>

<script>
import { mapState } from 'vuex';
import Cookie from 'js-cookie';

export default {
    data() {
        return {
            
        }
    },
    methods: {
        handleMenu(){
            this.$store.commit('collapseMenu')
        },
        handleDropdownClick(command){
            // 清除Cookie的toke
            if(command === 'logout'){
                Cookie.remove('token')
                Cookie.remove('menu')
                this.$router.push('login')
            }
        }
    },

    computed: {
        ...mapState({
            tags: state => state.tab.tabsList
        }),
    },

    mounted(){
        console.log(this.tags);
    }
}
</script>

<style lang="less" scoped>
.header-container{
    background-color: #333;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .text{
        color: #fff;
        font-size: 14px;
        margin: 0 10px;
    };

    .r-content{
        .user{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        };
    };

    .l-content{
        display: flex;
        align-items: center;
        /deep/.el-breadcrumb__item{
            .el-breadcrumb__inner{
                font-weight: normal;
                color: #888
            };

        };
    }
}
</style>