<template>
    <div>
        <div v-if="filetype === 'picture'">
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
        <div v-if="filetype === 'media'">
            <el-dialog
                title="上传媒体文件"
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
                    <el-form-item label="属性">
                        <el-select v-model="form.rel" placeholder="请选择文件对应的属性">
                            <el-option v-for="item in Object.entries(content)" :key="item[0]"
                                :label="item[1].show_name"
                                :value="item[0]"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="允许游客访问">
                        <el-radio-group v-model="form.allow_visitor">
                          <el-radio label="是"></el-radio>
                          <el-radio label="否"></el-radio>
                        </el-radio-group>
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
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submitData">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { postForm } from '../api/CommonData'
export default {
    data(){
        return{
            form:{
                rel: '',
                allow_visitor: '否',
            },
            dialogVisible: this.visible,
            fileList: [],
            filetype: '',
            returnVal: "",
        }
    },
    methods:{
        clearForm(){
            this.form.rel = '',
            this.form.allow_visitor = '否',
            this.fileList = []
        },
        checkForm(){
            if(this.form.rel === '') return {
                code: 1,
                msg: '请选择属性'
            }
            if(this.form.allow_visitor === '') return {
                code: 2,
                msg: '请选择是否允许游客访问'
            }

            return {
                code: 0,
                msg: '',
            }
        },
        handleClose(){
            // this.dialogVisible = false
            this.$emit('finishUpload', {
                code: 1
            })
            this.clearForm()
        },
        submitData(){
            const valid = this.checkForm()
            if(valid.code !== 0) {
                this.$message({
                    type: 'warning',
                    message: valid.msg
                })
                this.fileList = []
                return
            }
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
            const valid = this.checkForm()
            if(valid.code !== 0) {
                this.$message({
                    type: 'warning',
                    message: valid.msg
                })
                this.fileList = []
                return
            }
            // console.log(f);
            // console.log('form: ', this.form);

            let formData = new FormData();
			formData.append("file_obj", f.file, f.file.name);

            
            var url = 'file/upload/img'
            if(this.type === 'media') {
                url = `file/upload/media_file?allow_visitor=${this.form.allow_visitor === '是' ? 1 : 0}`
            }
            // console.log(url);
            let oriThis = this
            postForm(url, formData, (response) => {
                if(response.code === 0){
                    oriThis.$message({
						message: `${f.file.name} 提交成功`,
						type: "success",
					});
                    if(this.type === 'media') {
                        oriThis.returnVal = response.data.path
                    }
                    if(this.type === 'picture'){
                        oriThis.returnVal = 'https://room_dev_client.pacificsilkroad.cn/img-service/' + response.data.full
                    }
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
        },
        type(newval){
            this.filetype = newval
        }
    },
    // content为模板的strcture
    props:["content", "visible", "type"],

}
</script>