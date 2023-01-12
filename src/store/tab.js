import Cookie from "js-cookie";

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
        },
        setMenu(state, val){
            state.menu = val
            Cookie.set('menu', JSON.stringify(val))
        },
        addMenu(state, router){
            if(!Cookie.get('menu')) return
            else{
                const menu = JSON.parse(Cookie.get('menu'))
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
}