<template>
    <div class="tags">
        <el-tag
            v-for=" (item, index) in tags"
            :key="item.path"
            :effect="$store.state.tab.showingIndex === index ? 'dark' : 'plain'"
            size="small"
            @click="changeTag(item, index)"
            @close="closeTag(item, index)"
        >
            {{item.label}}
        </el-tag>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CommonTag',
    data() {
      return {
      };
    },
    methods: {
        changeTag(item, index){
            this.$store.commit('setTemplateId', item.templateId)
            this.$store.commit('setDataPath', item.dataPath)
            this.$store.commit('setIndex', index)
            location.reload()
        },
        closeTag(item, index){
            this.$store.commit('closeTag', item)  
            const length = this.tags.length
            if(this.$route.name === item.name){
                // 删除当前展示界面
                if(index === length){
                    this.$router.push(this.tags[index - 1].path)
                }
                else{
                    this.$router.push(this.tags[index].path)
                }
            }
        },
    }, 
    computed: {
        ...mapState({
            tags: state => state.tab.tabsList
        })
    },
}
</script>

<style lang="less" scoped>
.tags{
    padding: 10px 20px;
    .el-tag{
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>