const templateId = {
    archivesTemplateId: 8,
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
                    path: '/node',
                    name: 'archives',
                    label: '档案/手稿',
                    icon: 'video-play',
                    url: 'components/CommonNode',
                    templateId: templateId.archivesTemplateId
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