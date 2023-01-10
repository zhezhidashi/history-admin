import http from "../utils/requests";
import Cookie from 'js-cookie'

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
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'User'
        },
        {
            label: '内容管理',
            icon: 's-order',
            children: [
                {
                    path: '/archives',
                    name: 'archives',
                    label: '档案/手稿',
                    icon: 'video-play',
                    url: 'Archives/Archives'
                },
                {
                    path: '/picture',
                    name: 'picture',
                    label: '照片/图像',
                    icon: 'video-play',
                    url: 'Picture/Picture'
                },
                {
                    path: '/book',
                    name: 'book',
                    label: '古籍/特藏',
                    icon: 'video-play',
                    url: 'Book/Book'
                },
                {
                    path: '/interview',
                    name: 'interview',
                    label: '照片/图像',
                    icon: 'video-play',
                    url: 'Interview/Interview'
                },
            ]
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