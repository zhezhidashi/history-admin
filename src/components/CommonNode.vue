<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        
        <FileForm :content="uploadFileData.content" :visible="uploadFileData.visible"
            :type="uploadFileData.type"
            @finishUpload="finishUpload"
        >
        </FileForm>
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
            width="70%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item v-for="item of selectedChildTemplate.field_id_list"
                    :key="item"
                    :label="selectedChildTemplate.structure[item.toString()].show_name"
                >
                    <el-input v-if="selectedChildTemplate.structure[item.toString()].data_type === 'str'" v-model="form[item]"></el-input>
                    <el-input v-if="selectedChildTemplate.structure[item.toString()].data_type === 'int'" v-model.number="form[item]"></el-input>
                    <el-input v-if="selectedChildTemplate.structure[item.toString()].data_type === 'float'" v-model="form[item]"></el-input>
                </el-form-item>
                <el-form-item label="权限控制模式">
                    <el-radio v-model="visitMode" :label="1">覆盖模式</el-radio>
                    <el-radio v-model="visitMode" :label="2">继承模式</el-radio>
                </el-form-item>
                <el-form-item label="允许访问的用户组">
                    <el-radio v-model="groupIsAll" :label="1">全部</el-radio>
                    <el-radio v-model="groupIsAll" :label="2">部分</el-radio>
                </el-form-item>
                <el-form-item v-if="groupIsAll == 2" label="选择用户组">
                    <el-transfer v-model="allowGroup" :data="groupList"
                        :titles="['可选用户组', '已选择']"
                        target-order="origin"
                    ></el-transfer>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadFile('picture')">上传图片</el-button>
                <el-button type="primary" @click="uploadFile('media')">上传媒体文件</el-button>
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
                <el-table-column align="left" width="300" label="操作">
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

                        <el-button
                        v-if="scope.$index !== 0"
                        size="mini"
                        type="primary"
                        @click="handleMove(scope.$index)">上移</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content[5]"
                    label="名称"
                    width="270">
                </el-table-column>
                <el-table-column
                    prop="update_time"
                    label="更新时间"
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
import {getChildTemplate, getForm, postForm} from '../api/CommonData.js'
import {getNewName} from '../utils/name'
import FileForm from './FileForm.vue';
import config from '../config'

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
        visitMode: 1,
        allowGroup: [],
        groupList: [],
        groupIsAll: 1,

        tableData: [],
        childTemplate: [],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
        editData: {},
        uploadFileData:{
            content: {},
            visible: false,
            type:''
        },
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
            // console.log(this.selectedChildTemplate);
            this.form = {}
            this.visitMode = 2
            this.modalType = 0
            this.dataDialogVisible = true
        },
        submitData(){
            console.log(this.form);
            for(let item of Object.entries(this.selectedChildTemplate.structure)){
                if(this.form[item[0]] !== '') {
                    if(item[1].data_type === 'float') this.form[item[0]] = parseFloat(this.form[item[0]])
                    continue
                }
                if(item[1].data_type === 'str') this.form[item[0]] = ""
                else if(item[1].data_type === 'int') this.form[item[0]] = 1e9
                else if(item[1].data_type === 'float') this.form[item[0]] = parseFloat('1000000000.0')
            }
            // console.log('finished form', this.form);
            if(this.modalType === 0){
                const newName = getNewName()
                let oriThis = this
                postForm('data/add', {
                    path: this.$store.state.data.dataPath + '/' + newName,
                    template_id: this.templateForm.templateId,
                    content: this.form,
                    visit_mode: this.visitMode,
                    allow_group: (this.groupIsAll == 1) ? ['all'] : this.allowGroup,
                }, (response) => {
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
            else{
                let oriThis = this
                postForm('data/update', {
                    path: this.editData.path,
                    template_id: this.editData.template_id,
                    content: this.form,
                    show_time: this.editData.show_time,
                    visit_mode: this.visitMode,
                    allow_group: (this.groupIsAll == 1) ? ['all'] : this.allowGroup,
                }, (response) => {
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
            this.groupIsAll = 1
            this.allowGroup = []
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
        },
        handleEdit(row){
            this.selectedChildTemplate = this.getTemplateById(row.template_id)
            // console.log("edit ", row, this.selectedChildTemplate)
            const tmp = {}
            for(let item of this.selectedChildTemplate.field_id_list){
                tmp[item] = row.content[item.toString()]
            }
            this.form = tmp
            this.editData = row
            this.visitMode = row.visit_mode
            this.groupIsAll = row.allow_group[0] === 'all' ? 1 : 2
            this.allowGroup = this.groupIsAll === 1 ? [] : row.allow_group
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
                label: row.content[config.templateId.nameFieldId],
                templateId: row.template_id,
                dataPath: row.path
            })
            location.reload()
        },
        handleMove(Index){
            // console.log("Move", this.tableData[Index-1], this.tableData[Index])
            const t1 = this.tableData[Index-1].show_time
            const t2 = this.tableData[Index].show_time
            const requestData1 = {
                path: this.tableData[Index-1].path,
                template_id: this.tableData[Index-1].template_id,
                content: this.tableData[Index-1].content,
                show_time: t2
            }
            const requestData2 = {
                path: this.tableData[Index].path,
                template_id: this.tableData[Index].template_id,
                content: this.tableData[Index].content,
                show_time: t1
            }
            let oriThis = this
            postForm('data/update', requestData1, (response) => {
                if(response.code === 0){
                    postForm('data/update', requestData2, (response) => {
                        oriThis.updateTableData()
                    })
                }
                else{
                    oriThis.$message({
                        type: 'info',
                        message: response.msg
                    });
                }
            })
        },
        handlePage(pageId){
            // console.log(pageId)
            this.pageConfig.page = pageId
            this.updateTableData()
        },
        uploadFile(type){
            this.uploadFileData.content = this.selectedChildTemplate.structure
            this.uploadFileData.visible = true
            this.uploadFileData.type = type
        },
        finishUpload(response){
            // console.log('finishUpload');
            this.uploadFileData.visible = false
            if(response.code !== 0) return
            this.form[response.data.rel] = response.data.val
        },
        updateTableData(){
            const requestData = {
                "location_id": 99999999,
                "page_index": this.pageConfig.page,
                "page_size": this.pageConfig.limit,
                "sort_by": "-show_time",
                "path": this.$store.state.data.dataPath,
                "deep_range": 1,
                "filter_rule": {},
                "order_rule": {
                    "method": "show_time",
                    "order": "+"
                },
                "template_id_list": []
            }
            let oriThis = this
            postForm('data/list', requestData, (response) => {
                if(response.code === 0){
                    oriThis.tableData = response.data.list
                    oriThis.total = response.data.total_items
                }
                else{
                    oriThis.$message({
                        type: 'info',
                        message: response.msg
                    });
                }
            })
        }
    },
    components:{
        FileForm
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
        this.groupList = []
        getForm('user/group/list', (response) => {
            if(response.code === 0){
                for(let item of response.data){
                    oriThis.groupList.push({
                        key: item.name,
                        label: item.name,
                    })
                }
            }
            else{
                oriThis.$message({
                    type: 'error',
                    message: response.msg
                });
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