export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'downloadTaskList',
    icon: 'crown',
    path: '/downloadtasklist',
    component: './DownloadTaskList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: 'userList',
    icon: 'smile',
    path: '/userlist',
    component: './UserList',
  },

  {
    name: 'groupList',
    icon: 'smile',
    path: '/grouplist',
    component: './GroupList',
  },
  {
    name: 'account',
    icon: 'smile',
    path: '/account',
    routes: [
      {
        name: 'profile',
        icon: 'smile',
        path: '/account/center',
        component: './Account/AccountCenter',
      },
      {
        name: 'setting',
        icon: 'smile',
        path: '/account/settings',
        component: './Account/AccountSettings',
      },
    ],
  },
  {
    component: './404',
  },
];
