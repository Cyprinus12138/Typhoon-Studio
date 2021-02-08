import React, { useCallback, useEffect, useState } from 'react';
import {
  StepsForm,
  ProFormText, ProFormTextArea, ProFormSelect,
} from '@ant-design/pro-form';

import { Button, message, Modal, Transfer } from 'antd';
import { queryGroupMember, createGroup } from '../service';
import type { GroupMemberData, UserTransferRecord } from '../data';
import { UserOutlined } from '@ant-design/icons';


interface CreateFormProps {
  parent: string,
  onCancel?: () => void;
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [managerSelectData, setManagerSelectData] = useState([]);
  const [memberTransferData, setMemberTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [newGid, setNewGid] = useState<string>('');
  const [form_0] = StepsForm.useForm();
  const [form_1] = StepsForm.useForm();
  const [form_2] = StepsForm.useForm();


  const fetchUserForGroup = useCallback(() => {
    queryGroupMember({ getParent: true, group: newGid }).then((users) => {
      const targetKeySet: any[] = [];
      const transfer = users.data.map((user: GroupMemberData) => {
        if (user.targetKey) targetKeySet.push(user.uid);
        return {
          title: user.real_name,
          key: user.uid,
          disabled: user.super_manager ,
          isManager: user.isManager,
        };
      });
      setMemberTransferData(transfer);
      setTargetKeys(targetKeySet);
    });
  }, [newGid]);

  const fetchUserForManager = useCallback((/* value: string */) => {
    queryGroupMember({ getParent: false, group: props.parent }).then((users) => {
      const res = users.data.map((user: GroupMemberData) => ({
        title: user.real_name,
        label: <span>{(user.isManager) && <UserOutlined />}{user.real_name}</span>,
        value: user.uid,
      }));
      setManagerSelectData(res);
    });

  }, [props.parent]);


  useEffect(() => {
    if (visible)
      fetchUserForManager();
    setCurrent(0);
  }, [fetchUserForManager, visible]);

  useEffect(() => {
    if ((current === 0) && visible) // To avoid useless fetch after form complete.
      fetchUserForManager();
    if (current === 1)
      fetchUserForGroup();
  }, [current, fetchUserForGroup, fetchUserForManager, visible]);

  const customSubmitter = (
    <div className='steps-action'>
      {current === 0 && (
        <Button type='primary' onClick={() => {
          form_0.submit();
        }}>
          Next
        </Button>
      )}
      {current === 1 && (
        <Button type='primary' onClick={() => {
          form_1.submit();
        }}>
          Next
        </Button>
      )}{current === 2 && (
      <Button type='primary' onClick={() => {
        form_2.submit();
      }}>
        Next
      </Button>
    )}
    </div>
  );

  return (
    <>
      <a onClick={() => {
        setVisible(true);
      }}>新建</a>


      <StepsForm
        onFinish={async () => {
          await waitTime(1000);
          setVisible(false);
          message.success('提交成功');
        }}
        current={current}
        onCurrentChange={(_) => {
          setCurrent(_);
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom) => {
          return (
            <Modal
              title='分步表单'
              width={800}
              onCancel={() => setVisible(false)}
              visible={visible}
              footer={customSubmitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >

        <StepsForm.StepForm // First step start.
          title='新建群组'
          form={form_0}
          onFinish={async (values) => {
            try {
              const { gid } = await createGroup({
                identifier: values.identifier,
                manager: values.manager,
                description: values.description,
                parent: props.parent,
              });
              setNewGid(gid);
              message.success('提交成功');
              return true;
            } catch (e) {
              message.error('创建失败，请检查后重试！');
              return false;
            }
          }}
        >
          <ProFormText
            width='md'
            name='identifier'
            label='群组名称'
            tooltip='最长为 255 位'
            placeholder='请输入名称'
          />
          <ProFormSelect
            label='负责人'
            name='manager'
            options={managerSelectData}
            showSearch
            width='md'
          />
          <ProFormTextArea width='md' name='description' label='描述' />
        </StepsForm.StepForm>


        <StepsForm.StepForm // Second step.
          form={form_1}
          title='新建群组'
          onFinish={async () => {
            await waitTime(2000);
            message.success('提交成功');
            return true;
          }}
        >

          <Transfer
            dataSource={memberTransferData}
            targetKeys={targetKeys}
            showSearch
            render={(value: UserTransferRecord) => (
              <span>{(value.isManager) && <UserOutlined />}{value.title}</span>
            )}
            onChange={(t => setTargetKeys(t))}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>

  );
};

export default CreateForm;
