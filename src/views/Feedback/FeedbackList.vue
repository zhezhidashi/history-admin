<template>
	<div class="userManage">
		<div class="commonTable">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                height="100%"
            >
                <el-table-column align="left" width="80" label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleDetial(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content.name"
                    label="姓名"
                    width="100">
                </el-table-column>
				<el-table-column
                    prop="content.contact"
                    label="联系方式"
                    width="270">
                </el-table-column>
                <el-table-column
					prop="content.content"
					label="留言内容"
					width="500">
				</el-table-column>
				<el-table-column
					prop="show_time"
					label="留言时间"
					width="250">
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
import config from '../../config'
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
		handleDetial(row){
			this.$router.push({
				path: "/feedback_content",
				query: {
					Name: row.content.name,
					Contact: row.content.contact,
					Content: row.content.content,
				},
			});
		},
		handlePage(val){
			this.pageConfig.page = val
			this.getTableData()
		},
		getTableData(){
			const requestData = {
				"location_id": 99999999,
				"page_index": this.pageConfig.page,
				"page_size": this.pageConfig.limit,
				"sort_by": "-show_time",
				"path": "root/feedback_list",
				"deep_range": 1,
				"filter_rule": {},
				"order_rule": {
					"method": "show_time",
					"order": "+"
				},
				"template_id": config.templateId.feedbackTemplateId
			}

			let oriThis = this
			postForm('data/list', requestData, (response) => {
				if(response.code === 0){
					oriThis.tableData = response.data.list
					oriThis.total = response.data.total_items
				}
				else{
					oriThis.$message({
						type: 'info',
                        message: response.msg
					})
				}
			})
		}
	},
	mounted(){
		this.getTableData()
		// this.tableData.push({content: {
		// 	name: 'Margatroid',
		// 	contact: 'xxx',
		// 	content: 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbcccccccccccccccccccccccccc',
		// 	time: '123'
		// }})
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