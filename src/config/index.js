const templateId = {
    archivesTemplateId: 8,
    pictureTemplateId: 12,
    interviewTemplateId: 13,
    ancientBookTemplateId: 14,
    reservationTemplateId: 15,
}

export default {
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
            url: 'views/User'
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
          icon: 'location',
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
        }
    ]
}