<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +添加子模板</el-button>
        </div>
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
                label-width="120px" 
            >
                <el-form-item label="子模板">
                    <el-select v-model="form.id" placeholder="请选择模板">
                        <el-option v-for="item of templateList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                        >
                        </el-option>
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
                        @click="handleDetial(scope.row)">详情</el-button>

                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    width="400">
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
import { getTemplateInfo, postForm, getForm} from '../api/CommonData.js'
import config from '../config'

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            id: '',
        },
        templateList:[],
        templateInfo:{},
        tableData: [],
        modalType: 0,
        total: 0,
        pageConfig:{
            page: 1,
            limit: 10, 
        },
      };
    },
    methods: {
        submitData(){
            if(this.form.id !== ''){
                if(this.templateInfo.children_template_limit.indexOf(this.form.id) !== -1){
                    this.$message({
                        type: 'warning',
                        message: '模板已存在'
                    })
                }
                else{
                    const requestData = {
                        main_id: this.templateInfo.main_id,
                        show_time: this.templateInfo.show_time,
                        name: this.templateInfo.name,
                        field_id_list: this.templateInfo.field_id_list,
                        children_template_limit: this.templateInfo.children_template_limit,
                        brother_use_limit: this.templateInfo.brother_use_limit
                    }
                    // console.log(requestData);
                    const index0 = requestData.children_template_limit.indexOf(0)
                    if(index0 !== -1){
                        requestData.children_template_limit.splice(index0, 1)
                    }
                    requestData.children_template_limit.push(this.form.id)
                    // console.log('form', requestData);
                    let oriThis = this
                    postForm('template/update', requestData, (response) => {
                        if(response.code === 0){
                            oriThis.updateTableData()
                            oriThis.dialogVisible = false
                        }
                        else{
                            oriThis.$message({
                                type: 'warning',
                                message: response.msg
                            })
                        }
                    })
                }
            }
            else{
                this.$message({
                    type: 'warning',
                    message: '请选择模板'
                })
            }
        },
        handleClose(){
            this.dialogVisible = false
            this.form.id = ''
        },
        handleAdd(){
            this.form.id = ''
            this.dialogVisible = true
            // console.log('child_template: ', this.childTemplate);
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
        handleDelete(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    const requestData = {
                        main_id: this.templateInfo.main_id,
                        show_time: this.templateInfo.show_time,
                        name: this.templateInfo.name,
                        field_id_list: this.templateInfo.field_id_list,
                        children_template_limit: this.templateInfo.children_template_limit,
                        brother_use_limit: this.templateInfo.brother_use_limit
                    }
                    const index = requestData.children_template_limit.indexOf(row.main_id)
                    requestData.children_template_limit.splice(index, 1)
                    // console.log('form: ', requestData);

                    let oriThis = this
                    postForm('template/update', requestData, (response) => {
                        if(response.code === 0){
                            oriThis.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.updateTableData()
                        }
                        else{
                            oriThis.$message({
                                type: 'warning',
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
        handlePage(pageId){
            // console.log(pageId)
            this.pageConfig.page = pageId
        },
        updateTableData(){
            this.tableData = []
            const tid = this.$store.state.data.templateId
            let oriThis = this
            const url = `template/children/list?template_id=${tid}`
            getForm(url, (response) => {
                if(response.code === 0){
                    this.tableData = response.data
                }
                else{
                    oriThis.$message({
                        type: 'warning',
                        message: response.msg
                    })
                }
            })
        }
    },
    mounted(){
        // console.log('node mounted');
        this.attrList = config.attributeInfo
        this.templateList = []
        let oriThis = this
        getForm('template/list', (response) => {
            if(response.code === 0) {
                const specialTemplate = Object.values(config.templateId)
                for(let item of response.data){
                    if(specialTemplate.indexOf(item.main_id) === -1){
                        oriThis.templateList.push({name: item.name, id: item.main_id})
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
        getTemplateInfo(this.$store.state.data.templateId, (response) => {
            if(response.code === 0){
                this.templateInfo = response.data
            }
            else{
                oriThis.$message({
                    type: 'info',
                    message: response.msg
                });  
            }
        })
        // console.log('this template ', this.$store.state.data.templateId);
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