import http from "../utils/requests";
import Cookie from 'js-cookie'
import config from '../config'
import store from "@/store";

// const baseURL = '/api'
// const baseURL = 'https://room_dev_admin.pacificsilkroad.cn/api-service/'
const baseURL = 'http://xks.pku.edu.cn:443/api-service/'

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

export const getForm  = (url, callback) => {
    // const token = Cookie.get('mytoken')
    const token = store.state.cookie.token
    // console.log('getForm 的表单: ',url);
    http.request({
        method: "get",
        url: baseURL + url,
        headers: {token: token},
    }).then((response) => {
        // console.log("getForm 的 response: ", response);
        callback(response.data)
    })
}

export const getTemplateInfo = (templateId, callback) => {
    // return a List of children template id
    // console.log("get template info 的 request:", templateId);
    http.request({
        method: "get",
        url: `${baseURL}template/one?main_id=${templateId}`
    }).then(({data: response}) => {
        // console.log("get template info 的 response: ", response);
        callback(response)
    })
}

export const postForm = (url, data, callback) => {
    // const token = Cookie.get('mytoken')
    const token = store.state.cookie.token
    // console.log('postForm 的表单: ',url , data);
    http.request({
        method: "post",
        url: baseURL + url,
        headers: {token: token},
        data: data
    }).then((response) => {
        // console.log("postForm 的 response: ", response);
        callback(response.data)
    })
}

export const getChildTemplate = (templateId, callback) => {
    getTemplateInfo(templateId, (response) => {
        const childTemplate = response.data.children_template_limit
        if(childTemplate.indexOf(0) !== -1) return
        childTemplate.forEach(item => {
            getTemplateInfo(item, (response) => {
                callback(response.data)
            })
        })
    })
}

export const getChildNode = (path, templateId, callback) => {
    getTemplateInfo(templateId, (response) => {
        // console.log(response);
        // response.code = 0
        if(response.code === 0){
            const childTemplate = response.data.children_template_limit
            // console.log('templateid: ', childTemplate);
            if(childTemplate.indexOf(0) !== -1) {
                // console.log('template limit 0');
                callback({
                    code: 0,
                    data:{
                        list: [],
                    }
                })
                return
            }
            childTemplate.forEach(item => {
                const requestData = {
                    "location_id": 99999999,
                    "page_index": 1,
                    "page_size": 1000,
                    "sort_by": "-show_time",
                    "path": path,
                    "deep_range": 1,
                    "filter_rule": {},
                    "order_rule": {
                        "method": "show_time",
                        "order": "+"
                    },
                    "template_id": item
                }
                postForm('data/list', requestData, (response) => {
                    // response.data.list.forEach((item) => {
                    //         callback(item)
                    // })
                    callback(response)
                })
            });
        }
        else{
            alert(response.msg)
            return []
        }
    })
}

export const createTemplate = (fatherTemplate, data, oriThis) => {
    postForm('template/add', data, (response) => {
        if(response.code === 0){
            const newId = response.data.main_id
            const requestData = {
                main_id: fatherTemplate.main_id,
                show_time: fatherTemplate.show_time,
                name: fatherTemplate.name,
                children_template_limit: fatherTemplate.children_template_limit,
                brother_use_limit: fatherTemplate.brother_use_limit
            }
            if(requestData.children_template_limit.indexOf(newId) === -1){
                const indexOf0 = requestData.children_template_limit.indexOf(0)
                if(indexOf0 !== -1) {
                    requestData.children_template_limit.splice(indexOf0, 1, newId)
                }
                else requestData.children_template_limit.push(newId)
            }
            // console.log("in createTmplate: ", requestData);
            postForm('template/update', requestData, (response) => {
                oriThis.updateTableData()
            })
            oriThis.dialogVisible = false
        }
        else{
            oriThis.$message({
                message: response.msg,
                type: "error"
            })
        }
    })
}

export const updateTemplate = (oriTemplate, data, callback) => {
    const requestData = {
        main_id: oriTemplate.main_id,
        show_time: oriTemplate.show_time,
        name: data.name,
        children_template_limit: oriTemplate.children_template_limit,
        brother_use_limit: oriTemplate.brother_use_limit
    }
    postForm('template/update', requestData, (response) => {
        callback(response)
    })
}

export const login = (data, oriThis) => {
    http.request({
        url: baseURL + 'user/login',
        method: 'post',
        data: data,
    }).then((res) => {
        let response = res.data
        if(response.code === 0){
            const menu = config.mainMenu
            // Cookie.set('mytoken', response.data, {secure: true}),
            // console.log('login: ', response);
            
            oriThis.$store.commit('setToken', response.data)
            oriThis.$store.commit('setMenu', menu)
            let state = JSON.stringify(oriThis.$store.state)
            sessionStorage.setItem("store", state == null ? '' : state)

            oriThis.$store.commit('addMenu', oriThis.$router)
            oriThis.$router.push({name: 'home'})
        }
        else{
            oriThis.$message.warning('用户名或密码错误')
        }
    })
}