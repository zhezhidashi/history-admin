import http from "../utils/requests";
import Cookie from 'js-cookie'

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