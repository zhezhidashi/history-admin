<template>
    <div class="container">
        <div class="Title">
            操作说明
        </div>
        <div class="Text" style="font-weight: bold">
			需要强调，添加“××简介”文段时，如果存在分段，一定要在段落末尾添加"$$$"符号。比如（已用红框圈出）：
		</div>
        <img src="../../assets/images/Manual/OperationIntroduction01.png">
        <div class="Text">
            网页可能存在Bug，发现后请及时与开发人员联系，谢谢！
        </div>
        <div class="Header1"> 1. 内容管理</div>
        <div class="Text">
            内容管理部分采用与电脑文件系统类似的树结构，每个内容条目有“编辑”，“详情”，“删除”,“上移”，四种操作。<br>
            "编辑"按键可以查看该条目所包含的属性内容和进行修改。 <br>
            "详情"按键可以进入该条目的子条目(类似打开一个文件夹)。 <br>
            "删除"按键会删除该条目以及其内部的所有条目。 <br>
            "上移"按键会将该条目上移一位，用于调整条目顺序。 <br>
        </div>
        <div class="Header2">(1) 新建条目</div>
        <div class="Text">
            点击页面上方新建可新建一个条目，需要先从当前节点的模板中选择一个子模板，然后填写模板对应的属性。 <br>
            每个模板必定含有"节点名称"字段，此字段一般仅用于admin内展示，管理员可根据自己的管理需要填写，请注意区分其与客户端展示的内容。
        </div>
        <div class="Header2">(2) 上传图片/视频/音频</div>
        <div class="Text">
            图片/视频/音频作为条目的一个属性上传，可在新建条目的对话框下方点击"上传xx"进行上传。 <br>
            上传图片必须为 .jpg 格式。图片上传完成后,会跳转回新建条目的对话框。上传过程请不要刷新页面，否则会丢失信息。<br>
            上传完成后对应属性输入框内会出现对应的网址，若需要可自行保存，注意避免误操作的修改导致找不到资源。 <br>
            注：服务器网速较慢，上传后请耐心等待。长时间没有上传成功后请重新上传。强烈建议白天使用网站，晚上网速问题可能更严重。<br>
        </div>
        <div class="Header1"> 2. 模板列表</div>
        <div class="Header2"> (1) 字段模板</div>
        <div class="Text"> 
            此页面用于管理单个字段，设置单个字段的名称，数据类型等。 <br>
            例如，姓名，时间，标题等字段在此处建立字段模板，再在普通模板处选择成为模板属性。
        </div>
        <div class="Header2"> (2) 普通模板</div>
        <div class="Text">
            此页面展示所有的非字段模板，以及进行模板的新建、删除和修改。 <br>
            新建模板时点击对话框下方的“新增字段”可以添加一个字段。 <br>
            注意:如内容管理部分所述，模板会自动添加"节点名称"字段用于admin展示。
            <!-- <br>
            <div class="Header2"> 关于模板属性</div>
            为了支持搜索功能以及增加模板的复用性，我们建议尽可能的将一个字段单独建立成模板。<br>
            <span style="font-weight:bold"> 例如，想要建立一个模板表示"信件"，可以建立一个"信件"模板，
                再建立"时间","信件内容","作者"等模板，每个模板仅包含一个属性表示字段内容，
                再将这些模板设置为"信件"模板的子模板。</span> <br> -->
        </div>
        <div class="Header1"> 3. 模板管理</div>
        <div class="Text">
            模板管理页面用于管理模板之间的关系，结构和操作与内容管理类似。 <br>
            "添加子模板"功能为选择一个"模板列表/普通模板"中存在的模板，将其设置为当前模板的子模板。 <br>
        </div>
        <div class="Header1"> 4. 用户与用户组管理</div>
        <div class="Text">
            在用户组管理部分，新建用户组时需要配置其权限。 <br>
            在选择路径和权限后，<span style="font-weight:bold">权限对路径内部的节点生效，而对路径节点本身不生效</span>（当然"全部数据"除外，效果为其字面义）
            <br>
            删除用户组时存在两种删除模式："清除"与"合并"。
            两者都将删除该用户组，"清除"模式下该用户组下已有的用户权限不变；"合并"模式下该用户组的用户将转移至选择的合并用户组。
        </div>
        <div class="Header1"> 5. 其他</div>
        <div class="Text">
            在“内容管理”和“模板管理”处点击“详情”进入内部节点时，仅更新了页面展示的内容而没有改变网址(可以看到浏览器显示的url不变) <br>
            因此在这两个部分<span style="font-weight:bold">建议谨慎使用浏览器的后退键</span>以免跳转至其他页面，若想返回上一个条目可以点击页面上方的tag <br>
            <img src="../../assets/images/Manual/tags.png" style="height:100px">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style lang="less" scoped>
.container{
    height: 0;
}
.Title{
    display: flex;
	justify-content: center;
	font-size: 28px;
	font-weight: bold;
	padding: 10px;
}
.Header1 {
	font-size: 24px;
	font-weight: bold;
	padding: 8px;
}
.Header2 {
	font-size: 20px;
	font-weight: bold;
	padding: 6px;
}
.Text {
	font-size: 16px;
	padding: 4px;
	line-height: 200%;
}
</style>