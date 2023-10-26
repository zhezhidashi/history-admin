<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
    
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleCloseUser"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="form" label-width="80px" :rules="userRules">
                <el-form-item label="用户组" prop="group">
                    <el-select v-model="form.group" placeholder="请选择用户组">
                        <el-option v-for="item in groupList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="modalType === 0" label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloseUser">取 消</el-button>
                <el-button type="primary" @click="submitUser">确 定</el-button>
            </span>
        </el-dialog>

        <div class="commonTable">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                height="100%"
            >
                <el-table-column align="left" width="180" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">编辑</el-button>
    
                        <el-button
                        size="mini"
                        :type="scope.row.is_alive === 1 ? 'danger': 'primary'"
                        @click="handleStatus(scope.row)">
                            {{scope.row.is_alive === 1 ? '删除': '激活'}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="group"
                    label="用户组"
                    width="300">
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="pager">
            <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="handlePage"
            >
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
import {getForm, postForm} from '../../api/CommonData'

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            group: '',
            username: '',
            password: '',
        },
        userRules:{
            group:[
                { required: true, message: '请选择用户组', trigger: 'blur' },
            ],
            username:[
                { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
            ],
        },
        tableData: [],
        modalType: 0,
        groupList: [],
      };
    },
    methods: {
        checkUserForm(data){
            if(data.username === '' || data.group === '' || data.password === '') return false
            return true
        },
        submitUser(){
            // console.log(this.form, 'form')
            this.$refs.form.validate((valid) => {
                if(!valid) return
                let oriThis = this
                if(this.modalType === 0){
                    postForm('user/add', this.form, (response) => {
                        if(response.code === 0){
                            oriThis.getUserList()
                            oriThis.dialogVisible = false
                        }
                        else{
                            this.$message({
                                message: response.msg,
                                type: "error"
                            })
                        }
                    })
                }
                else{
                    postForm('user/update', this.form, (response) => {
                        if(response.code === 0){
                            oriThis.getUserList()
                            oriThis.dialogVisible = false
                        }
                        else{
                            this.$message({
                                message: response.msg,
                                type: "error"
                            })
                        }
                    })
                }
            })
        },
        handleCloseUser(){
            this.dialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
            this.form = {
                group: '',
                username: '',
                password: '',
            }
        },
        handleAddGroup(){},
        handleEdit(row){
            console.log(row);
            this.modalType = 1
            this.form = {
                group: row.group,
                username: row.username,
                main_id: row.main_id,
                password: '',
            }
            this.dialogVisible = true
        },
        handleStatus(row){
            let oriThis = this
            postForm('user/status', {main_id: row.main_id}, (response) => {
                if(response.code === 0){
                    oriThis.getUserList()
                }
                else{
                    this.$message({
                        message: response.msg,
                        type: "error"
                    })
                }
            })
        },
        getUserList(){
            let oriThis = this
            getForm('user/list', (response) => {
                if(response.code === 0){
                    // console.log('user group list: ', response.data);
                    oriThis.tableData = response.data
                }
                else{
                    this.$message({
                        message: response.msg,
                        type: "error"
                    })
                }
            })
        }
    },
    mounted(){
        this.getUserList()
        let oriThis = this
        getForm('user/group/list', (response) => {
            if(response.code === 0){
                // console.log('user group list: ', response.data);
                oriThis.groupList = response.data
            }
            else{
                this.$message({
                    message: response.msg,
                    type: "error"
                })
            }
        })
    }, 
  };
</script> 

<style lang="less" scoped>
.userManage{
    height: 90%;
    .commonTable{
        height: calc(100% - 25px);
    }
    .pager{
        position: absolute;
        bottom: 10px;
        right: 20px;
    }
}
</style>