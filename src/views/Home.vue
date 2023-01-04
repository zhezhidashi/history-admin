<template>
    <el-row>
        <el-col :span="8">
            <el-card class="box-card">
                <div class="user">
                    <img src="../assets/images/user.png" alt="">
                    <div class="userInfo">
                        <p class="name">Admin</p>
                        <p class="access">超级管理员</p>
                    </div>
                </div>
                <!-- <div class="loginInfo"></div> -->
              </el-card>
        </el-col>
        <el-col :span="16"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            
        }
    }
}
</script>

<style lang="less" scoped>
.user{
    display: flex;
    align-items: center;
    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin-right: 40px;
    };
    .userInfo{
        .name{
            font-size: 32px;
            margin: 10px 0;
        };
        .access{
            color: #999;
            margin-top: 0;
        }
    }
}
</style>