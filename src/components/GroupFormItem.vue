<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="路径">
                    <el-cascader :props="props" v-model="form.path" @change="select"></el-cascader>
                </el-form-item>
                <el-form-item label="权限">
                    <el-checkbox-group v-model="form.permission">
                        <el-checkbox label="增加" name="type"></el-checkbox>
                        <el-checkbox label="删除" name="type"></el-checkbox>
                        <el-checkbox label="查询" name="type"></el-checkbox>
                        <el-checkbox label="修改" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getChildNode} from '../api/CommonData'
import config from '../config'

export default {
    data() {
      return {
        dialogVisible: false,
        form: {
            path: '',
            permission: [],
        },
        props:{
            lazy: true,
            lazyLoad(node, resolve){
                // console.log('node: ',node);
                let res = []
                if(node.level === 0){
                    res.push({
                        value: {
                            path: 'root',
                            showName: '全部数据',
                        },
                        label: '全部数据',
                        leaf: true,
                    })
                    for(let item of config.mainMenu[config.submenuIndex].children){
                        res.push({
                            value: {
                                path: item.dataPath,
                                showName: item.label,
                            },
                            label: item.label,
                            leaf: false,
                            templateId: item.templateId
                        })
                    }
                    resolve(res)
                }
                else{
                    res.push({
                        value: {
                            path: node.value.path,
                            showName: node.label,
                        },
                        label: '选择当前节点',
                        leaf: true,
                    })
                    getChildNode(node.value.path, node.data.templateId, (response) => {
                        // console.log('load: ', response);
                        for(let item of response.data.list){
                            res.push({
                                value: {
                                    path: item.path,
                                    showName: item.content.name,
                                },
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
        showName: '',
        modalType: 0,
      };
    },
    methods: {
        select(a, b){
            console.log("select", a, b);
        },
        handleClose(){
            this.$emit('submitItem', {code:1})
        },
        submitData(){
            console.log('form: ', this.form);
            if(this.form.path === ''){
                this.$message({
                    message: '请选择路径',
                    type: 'error'
                })
                return
            }
            this.form.path = this.form.path.pop()
            const permissionMap = {
                '增加': 'a',
                '删除': 'd',
                '查询': 'r',
                '修改': 'u',
            }
            this.form.permission = this.form.permission.map(item => permissionMap[item])
            this.$emit('submitItem', {
                code: 0,
                data: this.form
            })
        },
    },
    mounted(){
    }, 
    watch:{
        visible(newval){
            this.dialogVisible = newval
        },
        content(newval){
            this.form = newval
        },
    },
    props:["content" ,"visible"]
  };
</script> 