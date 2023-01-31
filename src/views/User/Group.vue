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
                    <el-input v-if="modalType === 0" 
                        v-model="form.name" placeholder="请输入用户组名"></el-input>
                    <h4 v-if="modalType === 1" style="margin:0 20px"> {{form.name}} </h4>
                </el-form-item>
                <el-form-item v-for="(item, index) of form.scope"
                    :key="item.path.path"
                    :label="index === 0 ? '权限':'' ">
                    <div class="permissionItem">
                        <h4 class="name">{{item.path.showName}}</h4>
                        <el-button type="primary" @click="deleteItem(index)"> 删除</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addItem">添加权限项</el-button>
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
    </div>
</template>

<script>
import {getForm, postForm} from '../../api/CommonData'
import GroupFormItem from '../../components/GroupFormItem.vue';
import config from '../../config'

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            name: '',
            scope: [],
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
            if(data.name === ''){
                return {
                    code: 1,
                    msg: '请输入用户组名称'
                }
            }
            return {code: 0}
        },
        submitUser(){
            // console.log(this.form, 'form')
            const valid = this.checkUserForm(this.form)
            if(valid.code !== 0) {
                this.$message({message: valid.msg, type: 'error'})
                return
            }
            let requestData = {name: this.form.name, scope: {}}
            let url = (this.modalType === 0 ? 'user/group/add' : 'user/group/update')
            for(let item of this.form.scope){
                requestData.scope[item.path.path] = item.permission
            }
            // console.log('requestData: ', requestData);
            let oriThis = this
            postForm(url, requestData, (response) => {
                if(response.code === 0){
                    oriThis.getGroupList()
                    oriThis.dialogVisible = false
                }
                else{
                    this.$message({message: response.msg, type: 'error'})
                }
            })
        },
        handleCloseUser(){
            this.dialogVisible = false
        },
        handleAdd(){
            this.modalType = 0
            this.dialogVisible = true
            this.form = {
                name: '',
                scope: [],
            }
        },
        handleEdit(row){
            // console.log(row);
            this.modalType = 1
            this.form = {
                name: row.name,
                scope: [],
            }
            this.dialogVisible = true
            for(let item of Object.entries(row.scope)){
                if( config.nameMap[item[0]] ){
                    this.form.scope.push({
                        path:{
                            path: item[0],
                            showName: config.nameMap[item[0]],
                        },
                        permission: item[1]
                    })
                }
                else{
                    postForm('data/node', {path: item[0]}, (response) => {
                        if(response.code === 0){
                            this.form.scope.push({
                                path:{
                                    path: response.data.path,
                                    showName: response.data.content.name,
                                },
                                permission: item[1]
                            })
                        }
                        else{
                            this.$message({message: response.msg, type: 'error'})
                        }
                    })
                }
            }
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
            // console.log('submit item: ', response);
            this.itemData.visible = false
            if(response.code !== 0) return
            if(this.itemData.editIndex === -1) this.form.scope.push(response.data)
            // console.log('scope: ', this.itemData.editIndex);
        },
        deleteItem(index){
            this.form.scope.splice(index, 1)
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

    .permissionItem{
        display: flex;
    }
}

.permissionItem{
    display: flex;
    .name{
        margin: 0 20px;
    }
}
</style>