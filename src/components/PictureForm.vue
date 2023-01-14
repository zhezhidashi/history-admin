<template>
    <div>
        <el-dialog
            title="上传图片"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <el-form
                ref="form"
                :model="form" 
                label-width="80px" 
            >
                <el-form-item label="属性">
                    <el-select v-model="form.rel" placeholder="请选择图片对应的属性">
                        <el-option v-for="item in Object.entries(content)" :key="item[0]"
                            :label="item[1].show_name"
                            :value="item[0]"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-upload
                        class="upload-demo"
                        :file-list="fileList"
                        action=""
                        list-type="text"
                        :http-request="upload"
                        :multiple="false"
                        :on-change="onChange"
                    >
                        <el-button slot="trigger" size="small" type="primary">
                            选取文件
                        </el-button>
    
                        <div slot="tip" class="el-upload__tip">只能上传jpg文件</div>
                    </el-upload>
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
import { postForm } from '../api/CommonData'
export default {
    data(){
        return{
            form:{
                rel: ""
            },
            dialogVisible: this.visible,
            fileList: [],
            returnVal: "",
        }
    },
    methods:{
        clearForm(){
            this.form.rel = '',
            this.fileList = []
        },
        handleClose(){
            // this.dialogVisible = false
            this.$emit('finishUpload', {
                code: 1
            })
            this.clearForm()
        },
        submitData(){
            if(this.form.rel === '') return
            console.log("rel: ", this.form.rel);
            this.$emit('finishUpload', {
                code: 0,
                data:{
                    rel: this.form.rel,
                    val: this.returnVal
                }
            })
            this.clearForm()
        },
        upload(f){
            if(this.form.rel === '') return
            console.log(f);

            // const data = {
            //     file_obj: f.file
            // }
            let formData = new FormData();
			formData.append("file_obj", f.file, f.file.name);

            let oriThis = this
            postForm('file/upload/img', formData, (response) => {
                if(response.code === 0){
                    oriThis.$message({
						message: `${f.file.name} 提交成功`,
						type: "success",
					});

                    oriThis.returnVal = 'https://room_dev_client.pacificsilkroad.cn/img-service/' + response.data.full
                }
                else{
                    oriThis.$message({
						message: `${response.msg}`,
						type: "error",
					});
                }
            })
        },
        onChange(files, fileList){
            if(this.form.rel === ''){
                this.$message({
                    message: "请先选择属性",
                    type:"warning"
                })
                fileList.shift()
            }
            if(fileList.length >= 2) {
                fileList.shift()
            }
        }
    },
    watch:{
        visible(newval){
            this.dialogVisible = newval
        }
    },
    // content为模板的strcture
    props:["content", "visible"],

}
</script>