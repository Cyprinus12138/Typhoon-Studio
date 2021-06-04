import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Popover } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';
import PredictionView from '@/components/PredictionView';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * 新建窗口的弹窗
   */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * 分布更新窗口的弹窗
   */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  /**
   * 国际化配置
   */
  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="文件名"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <Popover content={<img src={entity.avatar}/>} title={`台风${entity.code.toString()}`}>
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          </Popover>

        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleCallNo" defaultMessage="台风级别" />,
      dataIndex: 'grade',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${intl.formatMessage({
          id: 'pages.searchTable.cat',
          defaultMessage: ' ',
        })}${val}${intl.formatMessage({
          id: 'pages.searchTable.tenThousand',
          defaultMessage: ' ',
        })}`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="最大中心风速" />,
      dataIndex: 'intensity',
      sorter: true,
      renderText: (val: string) =>
        `${val}${intl.formatMessage({
          id: 'pages.searchTable.mps',
          defaultMessage: ' m/s ',
        })}`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="台风地理位置坐标" />,
      dataIndex: 'lon',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
            <p>
              {`${entity.lat}°N ${entity.lon}°E`}
            </p>

        );
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.titleUpdatedAt" defaultMessage="数据采集时间" />
      ),
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
         //   console.log(record, updateModalVisible);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="详情/风速估计" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '台风遥感云图数据',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <PredictionView visible={updateModalVisible} typhoon={currentRow} onClose={()=> handleUpdateModalVisible(false)}/>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
