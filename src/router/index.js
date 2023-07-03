import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login'
import Manual from '../views/Manual/Manual'
import Cookie from 'js-cookie'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name:'main',
        component: Main,
        redirect: '/home',
        children: [
            {
                path: '/manual',
                name: 'manual',
                component: Manual
            },
            {
                path: '/feedback_content',
                name: 'feedback_content',
                component: () => import('../views/Feedback/FeedbackContent.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
]

const router = new VueRouter({
    routes
})

// 添加全局前置导航守卫
router.beforeEach((to, from ,next) => {
    // const token = Cookie.get('mytoken')
    const storet = JSON.parse(sessionStorage.getItem("store"));
    const token = storet.cookie.token
    // console.log('in guard: ', token);
    // console.log(from.name, to.name);
    if(token === '' && to.name !== 'login' && from.name !== 'login') {
        next({name: 'login'})
    }
    else if(token !== '' && to.name === 'login' && from.name !== 'home'){
        next({name: 'home'})
    }
    else{
        next()
    }
})

export default router