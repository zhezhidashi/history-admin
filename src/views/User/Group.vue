<template>
    <div class="userManage">
        <div class="manageHeader">
            <el-button type="primary" @click="handleAdd"> +新增</el-button>
        </div>
        <GroupFormItem :content="itemData.val"
            :visible="itemData.visible"
            @submitItem="submitItem"
        ></GroupFormItem>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleCloseUser"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.username" placeholder="请输入用户组名"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-cascader :props="props" @change="selectNode"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addItem">添加权限项</el-button>
                <el-button @click="handleCloseUser">取 消</el-button>
                <el-button type="primary" @click="submitUser">确 定</el-button>
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
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    width="500">
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="pager">
            <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="handlePage"
            >
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
import {getForm, postForm, getChildNode} from '../../api/CommonData'
import config from '../../config'
import GroupFormItem from '../../components/GroupFormItem.vue';

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            name: '',
            scope: [],
        },
        props:{
            lazy: true,
            lazyLoad(node, resolve){
                console.log('node: ',node);
                let res = []
                if(node.level === 0){
                    res.push({
                        value: 'root',
                        label: '全部数据',
                        leaf: true,
                    })
                    for(let item of config.mainMenu[config.submenuIndex].children){
                        res.push({
                            value: item.dataPath,
                            label: item.label,
                            leaf: false,
                            templateId: item.templateId
                        })
                    }
                    resolve(res)
                }
                else{
                    res.push({
                        value: node.value,
                        label: '选择当前节点',
                        leaf: true,
                    })
                    getChildNode(node.value, node.data.templateId, (response) => {
                        console.log('load: ', response);
                        for(let item of response.data.list){
                            res.push({
                                value: item.path,
                                label: item.content.name,
                                leaf: false,
                                templateId: item.template_id
                            })
                        }
                        resolve(res)
                    })
                }
                
            }
        },
        itemData:{
            val: {},
            visible: false,
            editIndex: -1,
        },
        tableData: [],
        modalType: 0,
        groupList: [],
      };
    },
    methods: {
        checkUserForm(data){
            if(data.username === '' || data.group === '' || data.password === '') return false
            return true
        },
        selectNode(node){
            console.log('selectNode: ', node);
        },
        submitUser(){
            // console.log(this.form, 'form')
            
        },
        handleCloseUser(){
            this.dialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
            this.form = {
                name: '',
                scope: {},
            }
        },
        handleAddGroup(){},
        handleEdit(row){
            console.log(row);
            this.modalType = 1
            this.form = {
                group: row.group,
                username: row.username,
                main_id: row.main_id,
                password: '',
            }
            this.dialogVisible = true
        },
        handleStatus(row){
            let oriThis = this
            postForm('user/status', {main_id: row.main_id}, (response) => {
                if(response.code === 0){
                    oriThis.getUserList()
                }
                else{
                    this.$message({
                        message: response.msg,
                        type: "error"
                    })
                }
            })
        },
        addItem(){
            this.itemData.val = {
                path: '',
                permission: [],
            },
            this.itemData.visible = true
            this.itemData.editIndex = -1
        },
        submitItem(response){
            console.log('submit item: ', response);
            this.itemData.visible = false
            if(response.code !== 0) return
            if(this.itemData.editIndex !== -1) this.form.scope.push(response.data)
        },
        getGroupList(){
            let oriThis = this
            getForm('user/group/list', (response) => {
                if(response.code === 0){
                    // console.log('user group list: ', response.data);
                    oriThis.tableData = response.data
                }
                else{
                    this.$message({
                        message: response.msg,
                        type: "error"
                    })
                }
            })
        }
    },
    mounted(){
        this.getGroupList()
    }, 
    components:{
        GroupFormItem
    }
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