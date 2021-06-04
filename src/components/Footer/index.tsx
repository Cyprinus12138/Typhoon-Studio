import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2021 东华大学计算机科学与技术学院 张贺"
    links={[
      {
        key: 'Typhoon Studio',
        title: '中国天气网-台风网',
        href: 'http://typhoon.weather.com.cn/',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/',
        blankTarget: true,
      },
      {
        key: 'NSMC',
        title: '风云卫星遥感数据服务网',
        href: 'http://satellite.nsmc.org.cn/PortalSite/Default.aspx',
        blankTarget: true,
      },
    ]}
  />
);
