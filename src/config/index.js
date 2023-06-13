const templateId = {
    archivesTemplateId: 1,
    pictureTemplateId: 2,
    eventTemplateId: 21,
    interviewTemplateId: 3,
    ancientBookTemplateId: 4,
    reservationTemplateId: 5,
    feedbackTemplateId: 7,
    feedbackListTemplateId: 6,
    fieldTemplateMask: [
        5, 7, 8, 9
    ],
    nameFieldId: 5,
}

export default {
    submenuIndex: 5,
    nameMap: {
        'root/archives': '档案/手稿',
        'root/picture': '照片/图像',
        'root/interview': '口述/访谈',
        'root/ancient_book': '古籍',
        'root/reservation': '特藏',
        'root': '全部数据'
    },
    mainMenu: [
        {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 's-home',
            url: 'views/Home'
        },
        {
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'views/User/User'
        },
        {
            path: '/user_group',
            name: 'user_group',
            label: '用户组管理',
            icon: 'user-solid',
            url: 'views/User/Group'
        },
        {
            label: '模板列表',
            icon: 's-order',
            url: 'views/TemplateList/TemplateList.vue',
            children:[
                {
                    path: '/template_list/common',
                    name: 'template_list_common',
                    label: '普通模板',
                    url: 'views/TemplateList/TemplateList',
                },
                {
                    path: '/template_list/field',
                    name: 'template_list_field',
                    label: '字段模板',
                    url: 'views/TemplateList/FieldList',
                },
            ],
        },
        {
            label: '模板管理',
            icon: 'share',
            children: [
                {
                    dataPath: 'root/archives',
                    // path: '/node',
                    path: '/template/archives',
                    name: 'archivesT',
                    label: '档案/手稿',
                    // url: 'components/CommonNode',
                    url: 'views/Template/Archives/ArchivesT',
                    templateId: templateId.archivesTemplateId
                },
                {
                    dataPath: 'root/picture',
                    path: '/template/picture',
                    name: 'pictureT',
                    label: '印象',
                    url: 'views/Template/Picture/PictureT',
                    templateId: templateId.pictureTemplateId
                },
                {
                    dataPath: 'root/event',
                    path: '/template/event',
                    name: 'eventT',
                    label: '事纪',
                    url: 'views/Template/Picture/EventT',
                    templateId: templateId.eventTemplateId
                },
                {
                    dataPath: 'root/interview',
                    path: '/template/interview',
                    name: 'interviewT',
                    label: '口述/访谈',
                    url: 'views/Template/Interview/InterviewT',
                    templateId: templateId.interviewTemplateId
                },
                {
                    dataPath: 'root/ancient_book',
                    path: '/template/ancient_book',
                    name: 'ancient_bookT',
                    label: '古籍',
                    url: 'views/Template/Book/BookT',
                    templateId: templateId.ancientBookTemplateId
                },
                {
                    dataPath: 'root/reservation',
                    path: '/template/reservation',
                    name: 'reservationT',
                    label: '特藏',
                    url: 'views/Template/Reservation/ReservationT',
                    templateId: templateId.reservationTemplateId
                },
            ]
        },
        {
            label: '内容管理',
            icon: 's-order',
            children: [
                {
                    dataPath: 'root/archives',
                    // path: '/node',
                    path: '/archives',
                    name: 'archives',
                    label: '档案/手稿',
                    // url: 'components/CommonNode',
                    url: 'views/Archives/Archives',
                    templateId: templateId.archivesTemplateId
                },
                {
                    dataPath: 'root/picture',
                    path: '/picture',
                    name: 'picture',
                    label: '印象',
                    url: 'views/Picture/Picture',
                    templateId: templateId.pictureTemplateId
                },
                {
                    dataPath: 'root/event',
                    path: '/event',
                    name: 'event',
                    label: '事纪',
                    url: 'views/Picture/Event',
                    templateId: templateId.eventTemplateId
                },
                {
                    dataPath: 'root/interview',
                    path: '/interview',
                    name: 'interview',
                    label: '口述/访谈',
                    url: 'views/Interview/Interview',
                    templateId: templateId.interviewTemplateId
                },
                {
                    dataPath: 'root/ancient_book',
                    path: '/ancient_book',
                    name: 'ancient_book',
                    label: '古籍',
                    url: 'views/Book/Book',
                    templateId: templateId.ancientBookTemplateId
                },
                {
                    dataPath: 'root/reservation',
                    path: '/reservation',
                    name: 'reservation',
                    label: '特藏',
                    url: 'views/Reservation/Reservation',
                    templateId: templateId.reservationTemplateId
                },
            ]
        },
        {
            path: '/feedback_list',
            name: 'feedback',
            label: '用户反馈',
            icon: 's-comment',
            url: 'views/Feedback/FeedbackList'
        },
        {
            path: '/recovery',
            name: 'recovery',
            label: '误删恢复',
            icon: 'delete-solid',
            url: 'views/Recovery/Recovery.vue'
        },
    ],
    attributeInfo: [
        {
            showName: '文本',
            pre: 'other',
            dataType: 'str',
        },
        {
            showName: '图片',
            pre: 'img',
            dataType: 'str',
        },
        {
            showName: '视频',
            pre: 'video',
            dataType: 'str',
        },
        {
            showName: '音频',
            pre: 'audio',
            dataType: 'str',
        },
        {
            showName: '整数',
            pre: 'other',
            dataType: 'int',
        },
        {
            showName: '小数',
            pre: 'other',
            dataType: 'float',
        },
    ],
    templateId: templateId
}