<template>
    <div>
        <el-form ref="form" label-width="7vw" :model="form" :rules="rules" class="loginContainer" :inline="true">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item class="loginSubmit">
                <el-button type="primary" @click="submit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {getMenu} from '../api/myAxios'
import {login} from '../api/CommonData'
import Cookie from 'js-cookie'

function getMenuCallback(oriThis, data) {
    oriThis.$store.commit('setMenu', data)
    oriThis.$router.push('/home')
}

export default {
    data(){
        return {
            form: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        submit(){
            let oriThis = this

            this.$refs.form.validate((valid) => {
                if(valid){
                    login(this.form,  this)
                }
            })
            
        }
    }
}
</script>

<style lang="less" scoped>
.loginContainer{
    width: 30vw;
    border: 1px solid #eaeaea;
    margin: 25vh auto;
    padding: 2vh 2vw;
    border-radius: 5%;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;
    .el-input{
        width: 15vw;
    };
    .loginTitle{
        text-align: center;
        margin-bottom: 20px;
        color: #505458;
    };
    .loginSubmit{
        margin: 10px 10vw;
    }
}
</style>