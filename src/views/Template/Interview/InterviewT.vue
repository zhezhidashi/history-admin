<template>
    <div class="container">
        <TemplateNode></TemplateNode>
    </div>
</template>

<script>
import TemplateNode from '@/components/TemplateNode.vue';

export default {
    components: {
        TemplateNode
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