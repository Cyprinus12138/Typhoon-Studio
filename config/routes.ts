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
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
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
    name: 'groupList',
    icon: 'smile',
    path: '/grouplist',
    component: './GroupList',
  },
  {
    component: './404',
  },
];
