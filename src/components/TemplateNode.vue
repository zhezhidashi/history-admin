<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        <TemplateAttrForm :content="attributeData.val"
            :visible="attributeData.visible"
            @submitAttr="submitAttr"
        ></TemplateAttrForm>
        <el-dialog
            title="模板"
            :visible.sync="dialogVisible"
            width="50%"
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
                <h4 style="text-align:center">模板属性(默认属性：名称 说明)</h4>
                <el-form-item v-for="(item, index) of form.templateAttribute"
                    :key="item.show_name"
                    :label="item.show_name + `(${attrList[item.data_type].showName})`"
                >
                    <el-button v-if="modalType === 0" type="primary" @click="editAttr(index)"> 编辑</el-button>
                    <el-button v-if="modalType === 0" type="primary" @click="deleteAttr(index)"> 删除</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="modalType === 0" type="primary" @click="addAttribute">新增属性</el-button>
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
                <el-table-column align="left" width="500" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">编辑</el-button>
                        
                        <el-button
                        size="mini"
                        @click="handleDetial(scope.row)">详情</el-button>

                        <!-- <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
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
import {getChildTemplate, getTemplateInfo, postForm,} from '../api/CommonData.js'
import { updateTemplate, createTemplate } from '../api/CommonData.js';
import TemplateAttrForm from './TemplateAttrForm.vue';
import config from '../config'

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
            templateAttribute:[],
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
        editData: {},
        uploadPictureData:{
            content: {},
            visible: false,
        },
        attrList: [],
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
                    // console.log('finished form', this.form);
                    if(this.modalType === 0){
                        // console.log(this.form.templateAttribute);
                        var requestData = {
                            name: this.form.name, 
                            structure: {},
                            children_template_limit: [0],
                            brother_use_limit: 0

                        }
                        requestData.structure.name = {
                            show_name: "名称",
                            data_type: "str",
                            min: 0,
                            max: 0,
                            require: true
                        }
                        requestData.structure.describe = {
                            show_name: "说明",
                            data_type: "str",
                            min: 0,
                            max: 0,
                            require: true
                        }
                        const length = this.form.templateAttribute.length
                        for(let i=0; i<length; ++i){
                            const attrName = this.attrList[this.form.templateAttribute[i].data_type].pre + '&attr' + i
                            const tmp = {
                                show_name: this.form.templateAttribute[i].show_name,
                                data_type: this.attrList[this.form.templateAttribute[i].data_type].dataType,
                                min: this.form.templateAttribute[i].min,
                                max: this.form.templateAttribute[i].max,
                                require: this.form.templateAttribute[i].require
                            }
                            requestData.structure[attrName] = tmp
                        }
                        // console.log('template data: ', requestData);
                        // console.log('father template: ', this.templateInfo);
                        
                        createTemplate(this.templateInfo, requestData, this)
                    }
                    else{
                        let oriThis = this
                        const requestData = {
                            name: this.form.name,
                        }
                        updateTemplate(this.editTemplate, requestData, (response) => {
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
            this.form = {name: "", templateAttribute:[]}
        },
        handleAdd(){
            this.form.name = ""
            this.form.templateAttribute = []
            this.modalType = 0
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
        },
        handleEdit(row){
            console.log("edit ", row)
            var tmp = []
            for(let item of Object.entries(row.structure)){
                if(item[0] !== 'describe' && item[0] !== 'name'){
                    tmp.push({
                        show_name: item[1].show_name,
                        min: item[1].min,
                        max: item[1].max,
                        require: require,
                        data_type: this.getDataType(item[0], item[1])
                    })
                }
            }
            this.form = {name: row.name, templateAttribute: tmp}
            this.modalType = 1
            this.editTemplate = row
            this.dialogVisible = true
        },
        handleDelete(Index, row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleDetial(row){
            this.$store.commit('setTemplateId', row.main_id)
            this.$store.commit('addTag', {
                label: row.name,
                templateId: row.main_id,
                dataPath: ""
            })
            location.reload()
        },
        handlePage(pageId){
            // console.log(pageId)
            this.pageConfig.page = pageId
            
            // this.getUserList()
        },
        addAttribute(){
            this.attributeData.val = {
                show_name:"",
                data_type:"",
                max:0,
                min:0,
                require: true,
            }

            // console.log("addAttr");
            this.attributeData.visible = true
            this.attributeData.editIndex = -1
        },
        submitAttr(response){
            this.attributeData.visible = false
            if(response.code !== 0) return
            // console.log('finishUploadAttr', response.data);
            if(this.attributeData.editIndex === -1) this.form.templateAttribute.push(response.data)
            else this.form.templateAttribute.splice(this.attributeData.editIndex, 1, response.data)
        },
        deleteAttr(index){
            this.form.templateAttribute.splice(index, 1)
        },
        editAttr(index){
            this.attributeData.val = this.form.templateAttribute[index]
            this.attributeData.visible = true
            this.attributeData.editIndex = index
        },
        updateTableData(){
            this.total = 2
            this.tableData = []
            const tid = this.$store.state.data.templateId
            let oriThis = this
            getChildTemplate(tid, (response) => {
                // console.log('add childtemplate ', response);
                oriThis.tableData.push(response)
            })
            getTemplateInfo(tid, (response) => {
                // console.log("templateInfo: ", response);
                this.templateInfo = response.data
            })
        }
    },
    components:{
        TemplateAttrForm
    },
    mounted(){
        // console.log('node mounted');
        this.updateTableData()
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