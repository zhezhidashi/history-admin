<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        <el-dialog
            title="新建模板"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form
                ref="form"
                :model="form" 
                :rules="rules"
                label-width="120px" 
            >
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="新增字段">
                    <el-transfer v-model="form.fieldList" :data="fieldList"
                        :titles="['可选字段', '已选字段']"
                        target-order="push"
                    ></el-transfer>
                </el-form-item>
                <!-- <div>
                    <h3 style="text-align:center">模板字段(默认字段：名称)</h3>
                </div> -->
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
                <el-table-column align="left" width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">编辑</el-button>

                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    width="360">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    width="400">
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
import {postForm, getForm} from '../../api/CommonData.js'
import config from '../../config'

export default {
    data() {
      return {
        dialogVisible: false,
        attributeData:{
            val:{},
            visible:false,
            editIndex: -1,
        },
        form: {
            fieldList: [],
            name:"",
        },
        rules:{
            name:[
                {required: true, message:"请输入模板名称", trigger: 'blur'}
            ]
        },
        templateInfo:{},
        editTemplate:{},
        tableData: [],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
        attrList: [],
        fieldList: [],
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
        getDataType(attrName, content){
            const length = this.attrList.length
            for(let i=0; i<length; ++i){
                const substrindex = attrName.indexOf(this.attrList[i].pre)
                if(substrindex !== -1) return i
            }
            if(content.data_type === 'str') return 2
            if(content.data_type === 'int') return 6
            if(content.data_type === 'float') return 7
        },
        submitData(){
            this.$refs.form.validate((valid) => {
                if(valid){
                    if(this.modalType === 0){
                        // console.log(this.form.templateAttribute);
                        var requestData = {
                            name: this.form.name, 
                            field_id_list: this.form.fieldList,
                            children_template_limit: [0],
                            brother_use_limit: 0

                        }
                        let oriThis = this
                        postForm('template/add', requestData, (response) => {
                            if(response.code === 0){
                                oriThis.updateTableData()
                                oriThis.dialogVisible = false
                            }
                            else{
                                oriThis.$message({
                                    type: 'error',
                                    message: response.msg
                                })
                            }
                        })
                    }
                    else{
                        let oriThis = this
                        const requestData = {
                            name: this.form.name,
                            main_id: this.editTemplate.main_id,
                            show_time: this.editTemplate.show_time,
                            field_id_list: this.form.fieldList,
                            children_template_limit: this.editTemplate.children_template_limit,
                            brother_use_limit: this.editTemplate.brother_use_limit,
                        }
                        // console.log(requestData);
                        postForm('template/update', requestData, (response) => {
                            if(response.code !== 0){
                                this.$message({
                                    message: response.msg,
                                    type: "error"
                                })
                            }
                            else {
                                oriThis.updateTableData()
                                this.dialogVisible = false
                            }
                        })
                    }
                }
            })
        },
        handleClose(){
            this.dialogVisible = false
        },
        handleAdd(){
            this.form = {
                name: "",
                fieldList: [config.templateId.nameFieldId],
            }
            this.modalType = 0
            this.dialogVisible = true
        },
        handleEdit(row){
            // console.log("edit ", row)
            this.form = {name: row.name, fieldList: []}
            this.form.fieldList = row.field_id_list
            this.modalType = 1
            this.editTemplate = row
            this.dialogVisible = true
        },
        handleDelete(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log('aaa', row, this.templateInfo);
                let oriThis = this
                postForm('template/delete', {main_id: row.main_id}, (response) => {
                    if(response.code === 0){
                        oriThis.updateTableData()
                        oriThis.dialogVisible = false
                    }
                    else{
                        oriThis.$message({
                            message: response.msg,
                            type: "error"
                        })
                    }
                })
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
        },
        deleteField(index){
            this.form.fieldList.splice(index, 1)
        },
        moveField(index){
            this.form.fieldList[index-1] = this.form.fieldList.splice(index,1,this.form.fieldList[index-1])[0]
        },
        getFieldList(){
            let oriThis = this
            this.fieldList = [
                {
                    key: config.templateId.nameFieldId,
                    label: '节点名称',
                    disabled: true,
                }
            ]
            getForm('field_template/list', (response) => {
                if(response.code === 0) {
                    for(let item of response.data){
                        if(config.templateId.fieldTemplateMask.indexOf(item.main_id) === -1){
                            oriThis.fieldList.push({
                                key: item.main_id,
                                label: item.show_name,
                                disabled: false,
                            })
                        }
                    }
                }
                else{
                    oriThis.$message({
                        type: 'info',
                        message: response.msg
                    });  
                }
            })
        },
        updateTableData(){
            this.tableData = []
            let oriThis = this
            getForm('template/list', (response) => {
                if(response.code === 0) {
                    const specialTemplate = Object.values(config.templateId)
                    for(let item of response.data){
                        if(specialTemplate.indexOf(item.main_id) === -1){
                            oriThis.tableData.push(item)
                        }
                    }
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
    mounted(){
        // console.log('node mounted');
        this.updateTableData()
        this.getFieldList()
        this.attrList = config.attributeInfo
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