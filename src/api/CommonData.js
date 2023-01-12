import http from "../utils/requests";
import Cookie from 'js-cookie'
import axios from "axios";
import config from '../config'

const baseURL = '/api'

export const getArchivesList = () => {
    return {
        count: 1,
        data: [
            {
                name: '档案1',
                detail: '辅助信息',
            },
        ]
    }
}

export const getArchivesItemList = () => {
    return {
        count: 2,
        data: [
            {
                name: '信件',
                detail: '辅助信息',
            },
            {
                name: '书稿',
                detail: '辅助信息',
            },
        ]
    }
}

export const getTemplateInfo = (templateId, callback) => {
    // return a List of children template id
    http.request({
        method: "get",
        url: `api/template/one?main_id=${templateId}`
    }).then(({data: response}) => {
        callback(response)
    })
}

export const postForm = (url, data, callback) => {
    const token = Cookie.get('token')
    // console.log('post: ', data);
    http.request({
        method: "post",
        url: baseURL + url,
        headers: {token: token},
        data: data
    }).then(({data: response}) => {
        callback(response)
    })
}

export const getChildNode = (path, templateId, callback) => {
    getTemplateInfo(templateId, (response) => {
        console.log(response);
        response.code = 0
        if(response.code === 0){
            const childTemplate = response.data.children_template_limit
            // console.log('templateid: ', childTemplate);
            childTemplate.forEach(item => {
                const requestData = {
                    "location_id": 99999999,
                    "page_index": 1,
                    "page_size": 15,
                    "sort_by": "-show_time",
                    "path": path,
                    "deep_range": 0,
                    "filter_rule": {},
                    "order_rule": {
                        "method": "show_time",
                        "order": "+"
                    },
                    "template_id": item
                }
                console.log('request: ', requestData);
                postForm('/data/list', requestData, (response) => {
                    console.log(response);
                    response.data.list.forEach((item) => {
                        postForm('/data/node', {'path': item.path}, (response) => {
                            // console.log(response);
                            callback(response.data)
                        })
                    })
                })
            });
        }
        else{
            alert(response.msg)
            return []
        }
    })
}

export const login = (data, oriThis) => {
    http.request({
        url: '/api/user/login',
        method: 'post',
        data: data,
    }).then(({data: response}) => {
        if(response.code === 0){
            const menu = config.mainMenu
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