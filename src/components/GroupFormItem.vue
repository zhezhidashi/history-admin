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
                    <el-cascader :props="props" 
                    v-model="form.path"
                    :key="cascaderRebuild"
                    ></el-cascader>
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
import {postForm} from '../api/CommonData'
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
                    const requestData = {
                        "location_id": 99999999,
                        "page_index": 1,
                        "page_size": 999,
                        "sort_by": "-show_time",
                        "path": node.value.path,
                        "deep_range": 1,
                        "filter_rule": {},
                        "order_rule": {
                            "method": "show_time",
                            "order": "+"
                        },
                        "template_id": 0
                    }
                    postForm('data/list', requestData, (response) => {
                        if(response.code === 0){
                            for(let item of response.data.list){
                                res.push({
                                    value: {
                                        path: item.path,
                                        showName: item.content[config.templateId.nameFieldId.toString()],
                                    },
                                    label: item.content[config.templateId.nameFieldId.toString()],
                                    leaf: false,
                                    templateId: item.template_id
                                })
                            }
                            resolve(res)
                        }
                        else{
                            this.$message({
                                type: 'warning',
                                message: response.msg
                            })
                        }
                    })
                }
                
            }
        },
        showName: '',
        modalType: 0,
        cascaderRebuild: 0,
      };
    },
    methods: {
        handleClose(){
            this.$emit('submitItem', {code:1})
        },
        submitData(){
            // console.log('form: ', this.form);
            if(this.form.path === ''){
                this.$message({
                    message: '请选择路径',
                    type: 'error'
                })
                return
            }
            if(this.form.path.length === 0){
                this.$emit('submitItem', {
                    code: 1,
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
            this.cascaderRebuild ^= 1 // 更改cascader的key使其重新渲染
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