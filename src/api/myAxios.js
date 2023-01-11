import http from "../utils/requests";
import Cookie from 'js-cookie'
import config from '../config'

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
