<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        
        <PictureForm :content="uploadPictureData.content" :visible="uploadPictureData.visible"
            @finishUpload="finishUpload"
        >
        </PictureForm>
        <el-dialog
            title="选择模板"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
            
        >
            <el-form :inline="true" 
                ref="templateForm"
                :model="templateForm" 
                label-width="80px" 
            >
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
            title="数据"
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
                    <el-input v-if="item[1].data_type === 'str'" v-model="form[item[0]]"></el-input>
                    <el-input v-if="item[1].data_type === 'int'" v-model.number="form[item[0]]"></el-input>
                    <el-input v-if="item[1].data_type === 'float'" v-model="form[item[0]]"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadPicture">上传图片</el-button>
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
                <el-table-column align="left" width="270" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">编辑</el-button>
                        
                        <el-button
                        size="mini"
                        @click="handleDetial(scope.row)">详情</el-button>

                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content.name"
                    label="名称"
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
import PictureForm from './PictureForm.vue';

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
        editData: {},
        uploadPictureData:{
            content: {},
            visible: false,
        }
      };
    },
    methods: {
        getTemplateById(templateId){
            for(let item of this.childTemplate ) {
                if(item.main_id === templateId){
                    return item
                }
            }
        },
        submitTemplate(){
            // console.log('choose template:', this.templateForm.templateId)
            if(!this.templateForm.templateId) return
            this.dialogVisible = false
            this.selectedChildTemplate = this.getTemplateById(this.templateForm.templateId)
            // 利用整体替换使响应式能够识别form的修改
            var tmp = {}
            for(let item of Object.entries(this.selectedChildTemplate.structure)){
                tmp[item[0]] = undefined
            }
            this.form = tmp
            // console.log("form", this.form);
            this.modalType = 0
            this.dataDialogVisible = true
        },
        submitData(){
            // console.log('finished form', this.form);
            if(this.modalType === 0){
                const newName = getNewName()
                let oriThis = this
                postForm('data/add', {
                    path: this.$store.state.data.dataPath + '/' + newName,
                    template_id: this.templateForm.templateId,
                    content: this.form
                }, (response) => {
                    console.log("add data: ", response);
                    if(response.code === 0){
                        console.log(this.$store.state.data.dataPath, this.templateForm.templateId);
                        oriThis.updateTableData()
                        oriThis.dataDialogVisible = false
                    }
                    else{
                        oriThis.$message({
                            message: response.msg,
                            type: "error"
                        })
                    }
                })
            }
            else{
                let oriThis = this
                postForm('data/update', {
                    path: this.editData.path,
                    template_id: this.editData.template_id,
                    content: this.form,
                    show_time: this.editData.show_time
                }, (response) => {
                    // console.log("update date", response);
                    if(response.code === 0){
                        oriThis.updateTableData()
                        oriThis.dataDialogVisible = false
                    }
                    else{
                        oriThis.$message({
                            message: response.msg,
                            type: "error"
                        })
                    }
                })
            }
        },
        handleClose(){
            // this.$refs.form.resetFields()
            this.dialogVisible = false
            this.dataDialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
        },
        handleEdit(row){
            this.selectedChildTemplate = this.getTemplateById(row.template_id)
            // console.log("edit ", row, this.selectedChildTemplate)
            const tmp = {}
            for(let item of Object.entries(this.selectedChildTemplate.structure)){
                tmp[item[0]] = row.content[item[0]]
            }
            this.form = tmp
            this.editData = row
            this.modalType = 1
            this.dataDialogVisible = true
        },
        handleDelete(Index, row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // console.log(row);
                    let oriThis = this
                    postForm('data/delete', {
                        path: row.path,
                        include_subtree: true,
                    }, (response) => {
                        if(response.code === 0){
                            oriThis.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.updateTableData()
                        }
                        else{
                            oriThis.$message({
                                type: 'info',
                                message: response.msg
                            });
                        }
                    })
                    
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleDetial(row){
            this.$store.commit('setDataPath', row.path)
            this.$store.commit('setTemplateId', row.template_id)
            this.$store.commit('addTag', {
                label: row.content.name,
                templateId: row.template_id,
                dataPath: row.path
            })
            location.reload()
        },
        handlePage(pageId){
            // console.log(pageId)
            this.pageConfig.page = pageId

            // this.getUserList()
        },
        uploadPicture(){
            // console.log("upload Pic");
            this.uploadPictureData.content = this.selectedChildTemplate.structure
            this.uploadPictureData.visible = true
        },
        finishUpload(response){
            // console.log('finishUpload');
            this.uploadPictureData.visible = false
            if(response.code !== 0) return
            this.form[response.data.rel] = response.data.val
        },
        updateTableData(){
            this.total = 2
            this.tableData = []
            const tid = this.$store.state.data.templateId
            let oriThis = this
            getChildNode(this.$store.state.data.dataPath, tid, (response) => {
                // console.log("data item",response);
                for(let item of response.data.list){
                    oriThis.tableData.push(item)
                }
            })
        }
    },
    components:{
        PictureForm
    },
    mounted(){
        // console.log('node mounted');
        this.updateTableData()
        this.childTemplate.clear

        let oriThis = this
        getChildTemplate(this.$store.state.data.templateId, (response) => {
            // console.log('add childtemplate ', response);
            oriThis.childTemplate.push(response)
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