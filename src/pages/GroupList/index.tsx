import { message, Tree, Menu, Dropdown } from 'antd';
import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';

import type { GroupNode } from './data';
import { queryGroupTree } from './service';
import CreateForm from './components/CreateForm';
import UpdateForm from '@/pages/UserList/components/UpdateForm';


const initTreeDate: GroupNode[] = [
  { title: 'DHU', key: 'None', isManager: false, isLeaf: false },
];


// It's just a simple demo. You can use tree map to optimize update perf.
function updateTreeData(list: GroupNode[], key: React.Key, children: GroupNode[]): GroupNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const GroupManagement: React.FC = () => {
  const [treeData, setTreeData] = useState(initTreeDate);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [modalVisible, setModalVisible] = useState(false);


  function onLoadData({ key, children, level, isManager }: any) {
    return new Promise<void>((resolve) => {
      if (children?.length > 0) {
        resolve();
        return;
      }
      queryGroupTree({
        key, level, isManager,
      }).then(res => {
        const { data: newChildren } = res;
        return setTreeData(origin =>
          updateTreeData(origin, key, newChildren),
        );
      }).catch(() => {
        message.error('更新列表发生错误，请稍后重试！');
        return setTreeData(origin =>
          updateTreeData(origin, key, [{ key: `${key}error`, title: '请稍后尝试刷新', isLeaf: true }]),
        );
      }).finally(() => {
        resolve();
      });
    });
  }

  function refreshNode({ key, level, isManager }: any) {
    return new Promise<void>((resolve) => {
      queryGroupTree({
        key, level, isManager,
      }).then(res => {
        const { data: newChildren } = res;
        return setTreeData(origin =>
          updateTreeData(origin, key, newChildren),
        );
      }).catch(() => {
        message.error('更新列表发生错误，请稍后重试！');
        return setTreeData(origin =>
          updateTreeData(origin, key, [{ key: `${key}error`, title: '请稍后尝试刷新', isLeaf: true }]),
        );
      }).finally(() => {
        resolve();
      });
    });
  }

  function onRightClick({ node }: any) {
    setSelectedGroup(node);
  }

  const menu = (gid: string, isManager?: boolean, isLeaf?: boolean) => {
    return (
      <Menu>
        {isManager &&
        <>
          <Menu.Item>
            <a target='_blank' rel='noopener noreferrer'>
              管理
            </a>
          </Menu.Item>
          {!isLeaf &&
          <Menu.Item>
            <CreateForm parent={gid} />
          </Menu.Item>}
        </>
        }

        <Menu.Item>
          <a target='_blank' rel='noopener noreferrer' onClick={() => {
            refreshNode(selectedGroup);
          }}>
            刷新
          </a>
        </Menu.Item>


        <Menu.Item danger>a danger item</Menu.Item>
      </Menu>
    );
  };


  function renderTitle(node: GroupNode): React.ReactNode {
    return (
      <Dropdown overlay={menu(node.key, node.isManager, node.isLeaf)}
                trigger={['contextMenu']}><span>{node.title}</span></Dropdown>
    );
  }

  return (

    <ProCard title='群组管理' /* extra='2019年9月28日' */ split='vertical' bordered headerBordered>
      <UpdateForm
        onSubmit={async () => {

        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        updateModalVisible={modalVisible}
        values={{}}
      />


      <ProCard title='群组' colSpan='300px'>
        <Tree loadData={onLoadData} treeData={treeData} showLine={true} titleRender={renderTitle}
              onRightClick={onRightClick}
              showIcon={true} />
      </ProCard>
      <ProCard title='流量占用情况'>
        <div style={{ height: 360 }}>右侧内容</div>
      </ProCard>
    </ProCard>


  );
};

export default (): React.ReactNode => {
  return <GroupManagement />;
}
