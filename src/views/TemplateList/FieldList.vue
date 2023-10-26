<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        <el-dialog
            title="新增字段"
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
                <el-form-item label="字段名称" prop="show_name">
                    <el-input v-model="form.show_name"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="data_type">
                    <el-select v-model="form.data_type">
                        <el-option v-for="(item, index) of attrList"
                            :key="item.showName"
                            :value="index"
                            :label="item.showName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <h4 style="text-align:center">若数据类型为整数,请填写最大最小值,填0为不限</h4>
                <el-form-item label="最小值" prop="min">
                    <el-input v-model.number="form.min"></el-input>
                </el-form-item>
                <el-form-item label="最大值" prop="max">
                    <el-input v-model.number="form.max"></el-input>
                </el-form-item>
                <el-form-item label="字段是否必填" prop="require">
                    <el-select v-model="form.require">
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
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
                    prop="show_name"
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
        form:{
                show_name:"",
                data_type:"",
                max:0,
                min:0,
                require: true
            },
        rules:{
            show_name:[
                {required: true, message:"请输入属性名", trigger:"blur"}
            ],
            data_type:[
                {required: true, message:"请选择数据类型", trigger:"blur"}
            ],
        },
        tableData: [],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
        attrList: [],
      };
    },
    methods: {
        submitData(){
            this.$refs.form.validate((valid) => {
                if(valid){
                    this.form.data_type = this.attrList[this.form.data_type].dataType
                    console.log('finished form', this.form);
                    let oriThis = this
                    if(this.modalType === 0){
                        postForm('field_template/add', this.form, (response) => {
                            if(response.code === 0){
                                oriThis.dialogVisible = false
                                oriThis.updateTableData()
                            }
                            else{
                                oriThis.$message({
                                    message: response.msg,
                                    type: "error"
                                })
                                oriThis.form.data_type = ""
                            }
                        })
                    }
                    else{
                        let oriThis = this
                        postForm('field_template/update', this.form, (response) => {
                            if(response.code !== 0){
                                oriThis.$message({
                                    message: response.msg,
                                    type: "error"
                                })
                                oriThis.form.data_type = ""
                            }
                            else {
                                oriThis.updateTableData()
                                oriThis.dialogVisible = false
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
                show_name:"",
                data_type:"",
                max:0,
                min:0,
                require: true
            }
            this.modalType = 0
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
        },
        handleEdit(row){
            // console.log("edit ", row)
            this.form = {
                main_id: row.main_id,
                show_time: row.update_time,
                show_name: row.show_name,
                data_type: "",
                max: row.max,
                min: row.min,
                require: row.require ? true : false
            }
            this.modalType = 1
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
                postForm('field_template/delete', {main_id: row.main_id}, (response) => {
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
        updateTableData(){
            this.tableData = []
            let oriThis = this
            getForm('field_template/list', (response) => {
                if(response.code === 0) {
                    // console.log('fields: ', response);
                    for(let item of response.data){
                        if(config.templateId.fieldTemplateMask.indexOf(item.main_id) === -1){
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