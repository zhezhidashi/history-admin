<template>
    <div>
        <el-dialog
            title="模板属性"
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
                <el-form-item label="属性名称" prop="show_name">
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
                <el-form-item label="属性是否必填" prop="require">
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

    </div>
</template>

<script>
import config from '../../config'
export default {
    data(){
        return{
            dialogVisible:false,
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
            attrList:[]
        }
    },
    methods:{
        handleClose(){
            this.$emit('submitAttr', {code:1})
        },
        submitData(){
            this.$refs.form.validate((valid) => {
                if(valid){
                    this.$emit('submitAttr', {
                        code: 0,
                        data: this.form
                    })
                }
            })
        },
    },
    watch:{
        visible(newval){
            this.dialogVisible = newval
        },
        content(newval){
            this.form = newval
        },
    },
    props:["content" ,"visible"],
    mounted() {
        this.attrList = config.attributeInfo
    },
}
</script>