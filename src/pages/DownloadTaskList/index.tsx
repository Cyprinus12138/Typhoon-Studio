import type { FC } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Dropdown,
  List,
  Menu,
  Modal,
  Progress,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageContainer } from '@ant-design/pro-layout';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import type { StateType } from './model';
import type { BasicListItemDataType } from './data.d';
import styles from './style.less';


type DownloadTaskListProps = {
  downloadTaskList: StateType;
  dispatch: Dispatch;
  loading: boolean;
};


const ListContent = ({
                       data: { owner, createdAt, percent, status },
                     }: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>开始时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress percent={100} status={status} strokeWidth={6} style={{ width: 180 }} strokeColor={(status === 'active') ? {
        '0%': '#108ee9',
        '100%': '#87d068',
      } : null} showInfo={status !== 'active'}/>
    </div>
  </div>
);

export const DownloadTaskList: FC<DownloadTaskListProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    downloadTaskList: { list },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'downloadTaskList/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 10,
    total: 18,
  };


  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'downloadTaskList/submit',
      payload: { id },
    });
  };

  const editAndDelete = (key: string | number, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };


  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    // setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'downloadTaskList/submit',
      payload: values,
    });
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title='下载列表'
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >

            <List
              size='large'
              rowKey='id'
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key='edit'
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      详情
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape='square' size='large' />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
     downloadTaskList,
     loading,
   }: {
    downloadTaskList: StateType;
    loading: {
      models: Record<string, boolean>;
    };
  }) => ({
    downloadTaskList,
    loading: loading.models.downloadTaskList,
  }),
)(DownloadTaskList);
