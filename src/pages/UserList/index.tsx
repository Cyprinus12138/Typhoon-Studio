import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { queryUser, updateUser, addUser, freezeUser, unfreezeUser } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
    await updateUser({
      realName: fields.realName,
      uid: fields.uid,
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
const handleUnfreeze = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在解冻');
  if (!selectedRows) return true;
  try {
    await unfreezeUser({
      uid: selectedRows.map((row) => row.uid),
    });
    hide();
    message.success('解冻成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('解冻失败，请重试');
    return false;
  }
};

/**
 *  冻结节点
 * @param selectedRows
 */
const handleFreeze = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在冻结');
  if (!selectedRows) return true;
  try {
    await freezeUser({
      uid: selectedRows.map((row) => row.uid),
    });
    hide();
    message.success('冻结成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('冻结失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',  // TODO： Intl
      dataIndex: 'realName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '姓名为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '学/工号',
      dataIndex: 'uid',
      // sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '学/工号为必填项',
          },
        ],
      },
    },
    // TODO Add group list.
    {
      title: '签名',
      search: false,
      dataIndex: 'signature',
      hideInForm: true,
      valueType: 'textarea',
    },
    {
      title: '状态',
      search: false,
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      valueEnum: {
        0: { text: '离线', status: 'Default' }, // TODO To fix: can not be -1.
        1: { text: '运行中', status: 'Processing' },
        2: { text: '在线', status: 'Success' },
        9: { text: '冻结', status: 'Error' },
      },
    },
    {
      title: '上次登录时间',
      dataIndex: 'loginAt',
      // sorter: true,
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '9') {
          return <Input {...rest} placeholder='请输入异常原因！' />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type='vertical' />
          {parseInt(record.status, 10) === 9 ?
            <a onClick={async () => {
              await handleUnfreeze([record]);
              actionRef.current?.reloadAndRest?.();
            }}>解冻</a>
            :
            <a onClick={async () => {
              await handleFreeze([record]);
              actionRef.current?.reloadAndRest?.();
            }}>冻结</a>}

        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle='系统用户'
        actionRef={actionRef}
        rowKey='uid'
        search={{labelWidth: 120}}   // {false}
        toolBarRender={() => [
          <Button type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 添加
          </Button>,
        ]}
        request={(params, sorter, filter) => queryUser({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button type='primary' danger
                  onClick={async () => {
                    await handleFreeze(selectedRowsState);
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }}
          >
            批量冻结
          </Button>
          <Button type='primary' onClick={async () => {
            await handleUnfreeze(selectedRowsState);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}>批量解冻</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey='key'
          type='form'
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.realName && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.realName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.realName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
