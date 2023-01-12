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
                    prop="content.name"
                    label="档案名称"
                    width="270">
                </el-table-column>
                <el-table-column
                    prop="content.describe"
                    label="说明"
                    width="500">
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
import {getArchivesList, getChildNode} from '../..//api/CommonData.js'
import ArchievesItem from './ArchivesItem.vue';
import config from '../../config'

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
                    this.updateArchivesList()
                })
            }
            else{
                edituser(this.form).then(() => {
                    this.updateArchivesList()
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
            const newRoute = {
                name: 'Archives_item_1',
                path: 'Archives/item_1',
            }
            // newRoute.component = () => import('./ArchivesItem')
            console.log(newRoute);
            // this.$router.addRoute('main', newRoute)
            this.$router.push({name: 'archivesItem'})
        },
        handleDelete(Index, row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteuser({id: row.id}).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.updateArchivesList()
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

            // this.getUserList()
        },
        updateArchivesList(){
            this.total = 2
            const tid = this.$store.state.data.templateId
            console.log('tid: ', this.$store.state.data);
            let oriThis = this
            getChildNode('root/archives', tid, (response) => {
                oriThis.tableData.push(response)
            })
        }
    },
    mounted(){
        this.updateArchivesList()
        
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