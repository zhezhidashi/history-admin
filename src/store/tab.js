import Cookie from "js-cookie";

export default {
    state: {
        isCollapse: false, // 控制菜单的展开与收起
        tabsList: [
        ], // 面包屑数据
        showingIndex: 0,
        menu: [],
    },
    mutations: {
        // 修改菜单折叠方法
        collapseMenu(state){
            state.isCollapse = !state.isCollapse
        },
        // 更改面包屑数据
        selectMenu(state, val) {
            // console.log(val);
            state.tabsList = [val]
            state.showingIndex = 0
        },
        addTag(state, val){
            state.tabsList = state.tabsList.slice(0, state.showingIndex+1)
            state.tabsList.push(val)
            state.showingIndex += 1
        },
        setIndex(state, val){
            state.showingIndex = val
        },
        closeTag(state, item){
            const index = state.tabsList.findIndex(T => T.label === item.label)
            state.tabsList.splice(index, 1)
        },
        setMenu(state, val){
            state.menu = val
        },
        addMenu(state, router){
            const menu = state.menu
            const menuArray = []
            menu.forEach(item => {
                if(item.children){
                    item.children = item.children.map(item => {
                        item.component = () => import(`../${item.url}`)
                        return item
                    })
                    menuArray.push(...item.children)
                }
                else{
                    item.component = () => import(`../${item.url}`)
                    menuArray.push(item)
                }
            });
            console.log('menuArray: ', menuArray);

            menuArray.forEach(item => {
                router.addRoute('main', item)
            });
        }
    }
}