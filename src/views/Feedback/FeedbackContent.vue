<template>
	<div>
		<el-descriptions
			title="用户留言"
			direction="vertical"
			:column="1"
			border
		>
			<el-descriptions-item label="姓名"
				>{{Name}}</el-descriptions-item
			>
			<el-descriptions-item label="联系方式"
				>{{Contact}}</el-descriptions-item
			>
			<el-descriptions-item label="留言内容"
				>{{Content}}</el-descriptions-item
			>
		</el-descriptions>
	</div>
</template>

<script>
export default {
	name: "FeedbackContent",
	data() {
		return {
			Name: "",
			Contact: "",
			Content: "",
		};
	},
	mounted() {
		this.Name = this.$route.query.Name;
		this.Contact = this.$route.query.Contact;
		this.Content = this.$route.query.Content;
	},
};
</script>

<style scoped>
</style>