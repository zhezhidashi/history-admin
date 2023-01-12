<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
    
        <el-dialog
            title="选择模板"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form :inline="true" ref="templateForm" :model="form" label-width="80px">
                <el-form-item label="模板">
                    <el-select v-model="templateForm.templateId" placeholder="请选择模板">
                        <!-- <el-option label="区域一" value="shanghai"></el-option> -->
                        <el-option v-for="child in childTemplate" :key="child.main_id"
                            :label="child.name"
                            :value="child.main_id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitTemplate">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="新增数据"
            :visible.sync="dataDialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item v-for="item of Object.entries(this.selectedChildTemplate.structure)"
                    :key="item[0]"
                    :label="item[1].show_name"
                >
                    <el-input v-model="form[item[0]]"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitData">确 定</el-button>
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
import {getChildTemplate, getChildNode, postForm} from '../api/CommonData.js'
import {getNewName} from '../utils/name'

export default {
    data() {
      return {
        dialogVisible: false,
        dataDialogVisible: false,
        templateForm: {
            templateId: undefined
        },
        selectedChildTemplate: {
            structure: {}
        },
        form: {
        },
        tableData: [],
        childTemplate: [],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
      };
    },
    methods: {
        submitTemplate(){
            console.log('choose template:', this.templateForm.templateId)
            this.dialogVisible = false
            for(let item of this.childTemplate ) {
                if(item.main_id === this.templateForm.templateId){
                    this.selectedChildTemplate = item
                    break
                }
            }
            // 利用整体替换使响应式能够识别form的修改
            var tmp = {}
            for(let item of Object.entries(this.selectedChildTemplate.structure)){
                tmp[item[0]] = undefined
            }
            this.form = tmp
            // console.log("form", this.form);
            this.dataDialogVisible = true
        },
        submitData(){
            console.log('finished form', this.form);
            const newName = getNewName()
            let oriThis = this
            postForm('data/add', {
                path: this.$store.state.data.dataPath + '/' + newName,
                template_id: this.templateForm.templateId,
                content: this.form
            }, (response) => {
                console.log("add data: ", response);
                oriThis.updateTableData()
                oriThis.dataDialogVisible = false
            })
        },
        handleClose(){
            // this.$refs.form.resetFields()
            this.dialogVisible = false
            this.dataDialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
            console.log('child_template: ', this.childTemplate);
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
                        this.updateTableData()
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
        updateTableData(){
            this.total = 2
            this.tableData = []
            const tid = this.$store.state.data.templateId
            // console.log('tid: ', this.$store.state.data)
            let oriThis = this
            getChildNode(this.$store.state.data.dataPath, tid, (response) => {
                // console.log("data item",response);
                oriThis.tableData.push(response)
            })
        }
    },
    mounted(){
        console.log('node mounted');
        this.updateTableData()
        this.childTemplate.clear

        let oriThis = this
        getChildTemplate(this.$store.state.data.templateId, (response) => {
            // console.log('add childtemplate ', response);
            oriThis.childTemplate.push(response)
        })
        console.log(getNewName());
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