import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login'
import Cookie from 'js-cookie'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name:'main',
        component: Main,
        redirect: '/home',
        children: [
        ]
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    }
]

const router = new VueRouter({
    routes
})

// 添加全局前置导航守卫
router.beforeEach((to, from ,next) => {
    const token = Cookie.get('token')
    if(!token && to.name !== 'login') {
        next({name: 'login'})
    }
    else if(token && to.name === 'login'){
        next({name: 'home'})
    }
    else{
        next()
    }
})

export default router