export default {
    state: {
        isCollapse: false, // 控制菜单的展开与收起
        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'Home/Home'
            },
        ], // 面包屑数据
    },
    mutations: {
        // 修改菜单折叠方法
        collapseMenu(state){
            state.isCollapse = !state.isCollapse
        },
        // 更改面包屑数据
        selectMenu(state, val) {
            console.log(val);
            if(val.name !== 'home'){
                const index = state.tabsList.findIndex(item => item.name === val.name)
                if(index === -1){
                    state.tabsList.push(val)
                }
            }
        },
        closeTag(state, item){
            const index = state.tabsList.findIndex(T => T.name === item.name)
            state.tabsList.splice(index, 1)
        }
    }
}