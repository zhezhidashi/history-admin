import http from "../utils/requests";
import Cookie from 'js-cookie'

const baseURL = 'room_dev_client.pacificsilkroad.cn'

export const getusers = (params) => {
    return http.get('/api/getusers', params)
}

export const createuser = (data) => {
    return http.post('/api/createuser', data)
}

export const deleteuser = (data) => {
    return http.post('/api/deluser', data)
}

export const edituser = (data) => {
    return http.post('/api/edituser', data)
}

export const getMenu = () => {
    return [
        {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 's-home',
            url: 'Home'
        },
        {
            path: '/mall',
            name: 'mall',
            label: '商品管理',
            icon: 'video-play',
            url: 'Mall'
        },
        {
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'User'
        },
        {
          label: '其他',
          icon: 'location',
          children: [
              {
                  path: '/page1',
                  name: 'page1',
                  label: '页面1',
                  icon: 'setting',
                  url: 'PageOne'
                },
                {
                    path: '/page2',
                    name: 'page2',
                    label: '页面2',
                    icon: 'setting',
                    url: 'PageTwo'
                }
            ]
        }
    ]
}

export const login = (data, oriThis) => {
    http.request({
        url: '/user/login',
        method: 'post',
        data: data,
    }).then(({data: response}) => {
        if(response.code === 0){
            const menu = getMenu()
            console.log('login-response: ', response);
            Cookie.set('token', response.data),
            oriThis.$store.commit('setMenu', menu)
            oriThis.$store.commit('addMenu', oriThis.$router)
            oriThis.$router.push({name: 'home'})
        }
        else{
            oriThis.$message.warning('用户名或密码错误')
        }
    })
}