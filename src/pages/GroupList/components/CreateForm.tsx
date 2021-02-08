import React, { useEffect, useState } from 'react';
import {
  StepsForm,
  ProFormText, ProFormTextArea, ProFormSelect,
} from '@ant-design/pro-form';

import { message, Modal, Transfer } from 'antd';
// import type { SelectValue } from 'antd/lib/select';
import { queryGroupMember, createGroup } from '../service';
import type { GroupMemberData } from '../data';
import { UserOutlined } from '@ant-design/icons';

// const { Option } = Select;

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
  // const { modalVisible, onCancel } = props;
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const fetchUserForManager = async (/* value: string */) => {
    const users = await queryGroupMember({ getParent: false, group: props.parent });
    const res = users.data.map((user: GroupMemberData) => ({
      title: user.real_name,
      label: <span>{(user.role === 'MANAGER') && <UserOutlined />}{user.real_name}</span>,
      value: user.uid,
      isManager: user.role === 'MANAGER',
    }));
    setData(res);
  };

  useEffect(() => {
    if (visible)
      fetchUserForManager();
    setCurrent(0);
  }, [visible]);

  useEffect(() => {
    if (current === 0)
      fetchUserForManager();
    if (current === 1)
      ;
  }, [current]);


  return (
    <>
      <a onClick={() => {
        setVisible(true);
      }}>新建</a>


      <StepsForm
        onFinish={async (values) => {
          console.log(values);
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
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title='分步表单'
              width={800}
              onCancel={() => setVisible(false)}
              visible={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >

        <StepsForm.StepForm // First step start.
          title='新建群组'
          onFinish={async (values) => {
            try {
              await createGroup({
                identifier: values.identifier,
                manager: values.manager,
                description: values.description,
                parent: props.parent,
              });
              console.log(values);
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
            options={data}
            showSearch
            width='md'
          />
          <ProFormTextArea width='md' name='description' label='描述' />
        </StepsForm.StepForm>


        <StepsForm.StepForm // Second step.
          title='新建群组'
          onFinish={async (values) => {
            await waitTime(2000);
            console.log(values);
            message.success('提交成功');
            return true;
          }}
        >

          <Transfer />
        </StepsForm.StepForm>
      </StepsForm>
    </>

  );
};

export default CreateForm;
