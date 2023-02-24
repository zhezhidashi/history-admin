const templateId = {
    archivesTemplateId: 8,
    pictureTemplateId: 12,
    interviewTemplateId: 13,
    ancientBookTemplateId: 14,
    reservationTemplateId: 15,
    feedbackTemplateId: 39,
    feedbackListTemplateId: 40,
    attrListTemplateId: 41,
}

export default {
    submenuIndex: 3,
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
                    label: '照片/图像',
                    url: 'views/Picture/Picture',
                    templateId: templateId.pictureTemplateId
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
                label: '照片/图像',
                url: 'views/Template/Picture/PictureT',
                templateId: templateId.pictureTemplateId
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
        {
            path: '/template_list',
            name: 'template_list',
            label: '模板列表',
            icon: 's-order',
            url: 'views/TemplateList/TemplateList.vue'
        },
    ],
    attributeInfo: [
        {
            showName: '标题',
            pre: 'title',
            dataType: 'str',
        },
        {
            showName: '简介/描述',
            pre: 'intro',
            dataType: 'str',
        },
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