import http from "../utils/requests";

export const getusers = (params) => {
    return http.get('/getusers', params)
}

export const createuser = (data) => {
    return http.post('/createuser', data)
}

export const deleteuser = (data) => {
    return http.post('/deluser', data)
}

export const edituser = (data) => {
    return http.post('/edituser', data)
}