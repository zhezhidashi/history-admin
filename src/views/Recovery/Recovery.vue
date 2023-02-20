<template>
	<div class="userManage">
		<div class="commonTable">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                height="100%"
            >
                <el-table-column align="left" width="160" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleRecover(scope.row)">恢复</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content.name"
                    label="名称"
                    width="270">
                </el-table-column>
                <el-table-column
                    prop="content.describe"
                    label="说明"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="update_time"
                    label="更新时间"
                    width="270">
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
import { postForm } from '../../api/CommonData';
export default {
	name: "FeedbackList",
	data() {
		return {
			tableData: [],
			total: 0,
			pageConfig:{
				page: 1,
				limit: 10, 
			},
		};
	},
	methods: {
		handleRecover(row){
			// console.log(row);
            const requestData = {
                path: row.path,
                include_subtree: true
            }
            let oriThis = this
            postForm('data/recover', requestData, (response) => {
                if(response.code === 0){
                    oriThis.getTableData()
                }
                else{
                    oriThis.$message({
                        type: 'info',
                        message: response.msg
                    });
                }
            })
		},
        handleDelete(row){
            this.$confirm('确认永久删除数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const requestData = {
                    path: row.path,
                    include_subtree: true
                }   
                let oriThis = this
                postForm('data/remove', requestData, (response) => {
                    if(response.code === 0){
                        oriThis.getTableData()
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
		handlePage(val){
            console.log(val);
			this.pageConfig.page = val
			this.getTableData()
		},
		getTableData(){
            const url = `data/list/recycle_bin?&page_index=${this.pageConfig.page}&page_size=${this.pageConfig.limit}`
			let oriThis = this
            postForm(url, {}, (response) => {
                if(response.code === 0){
                    oriThis.tableData = response.data.list
					oriThis.total = response.data.total_items
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
		this.getTableData()
	}
};
</script>

<style lang="less" scoped>
.userManage{
    height: 100%;
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