<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
    
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form :inline="true" ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                        <el-option label="男" value="male"></el-option>
                        <el-option label="女" value="female"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="家庭住址" prop="addr">
                    <el-input v-model="form.addr" placeholder=""></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
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
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="password"
                    label="password"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="id">
                </el-table-column>
            </el-table>
        </div>
        <div class="pager">
            <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="handlePage"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {getusers, createuser, edituser, deleteuser} from '../api/myAxios'

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            username: '',
            password: '',
        },
        tableData: [

        ],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
      };
    },
    methods: {
        submit(){
            // console.log(this.form, 'form')
            if(this.modalType === 0){
                createuser(this.form).then(() => {
                    this.getUserList()
                })
            }
            else{
                edituser(this.form).then(() => {
                    this.getUserList()
                })
            }
            this.handleClose()
        },
        handleClose(){
            this.$refs.form.resetFields()
            this.dialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
        },
        handleEdit(row){
            // console.log(index, row);
            this.modalType = 1
            this.dialogVisible = true
            // 深拷贝
            this.form = JSON.parse(JSON.stringify(row))
        },
        handleDelete(Index, row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteuser({id: row.id}).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getUserList()
                    });
                    
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handlePage(pageId){
            // console.log(pageId)
            this.pageConfig.page = pageId

            this.getUserList()
        },
        getUserList(){
            getusers({params: this.pageConfig}).then(({data}) => {
                console.log('data', data);
                this.tableData = data.list
                this.total = data.count || 0
            })
        }
    },
    mounted(){
        this.getUserList()
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