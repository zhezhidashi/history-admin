<template>
    <div class="header-container">
        <div class="l-content">
            <el-button @click="handleMenu" icon="el-icon-menu" size="mini"></el-button>
            <!-- 面包屑 -->
            <span class="text">首页</span>
        </div>
        <div class="r-content">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right">
                    <img class="user" src="../assets/images/user.png" alt="">
                  </i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>退出</el-dropdown-item>
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
export default {
    data() {
        return {
            
        }
    },
    methods: {
        handleMenu(){
            this.$store.commit('collapseMenu')
        }
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
}
</style>