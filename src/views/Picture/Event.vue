<template>
    <div class="container">
        <CommonNode></CommonNode>
    </div>
</template>

<script>
import CommonNode from '../../components/CommonNode.vue'

export default {
    components: {
        CommonNode
    },
    data() {
      return {};
    },
  };
</script> 

<style lang="less" scoped>
.container{
    height: 100%;
}
</style>