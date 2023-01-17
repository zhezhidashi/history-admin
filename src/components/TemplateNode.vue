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
            title="新增模板"
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
                    :label="item.show_name + `(${item.data_type === 'str'? '文本': '整数'})`"
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

                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import {getChildTemplate, getChildNode, postForm} from '../api/CommonData.js'
import {getNewName} from '../utils/name'
import TemplateAttrForm from './TemplateAttrForm.vue';

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
        submitData(){
            this.$refs.form.validate((valid) => {
                if(valid){
                    console.log('finished form', this.form);
                    if(this.modalType === 0){
                        console.log(this.form.templateAttribute);
                    }
                    else{
                        
                    }
                    // this.dialogVisible = flase
                }
            })
        },
        handleClose(){
            this.dialogVisible = false
            this.form = {name: "", templateAttribute:[]}
        },
        handleAdd(){
            this.form.name = ""
            this.modalType = 0
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
        },
        handleEdit(row){
            console.log("edit ", row)
            var tmp = []
            for(let item of Object.entries(row.structure)){
                if(item[0] !== 'describe' && item[0] !== 'name'){
                    tmp.push(item[1])
                }
            }
            this.form = {name: row.name, templateAttribute: tmp}
            this.modalType = 1
            this.dialogVisible = true
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
            console.log('finishUploadAttr', response.data);
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
                console.log('add childtemplate ', response);
                oriThis.tableData.push(response)
            })
        }
    },
    components:{
        TemplateAttrForm
    },
    mounted(){
        console.log('node mounted');
        this.updateTableData()
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