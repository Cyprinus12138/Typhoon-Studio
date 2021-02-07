import React, { useState } from 'react';
import  {
  StepsForm,
  ProFormText, ProFormTextArea, ProFormSelect,
} from '@ant-design/pro-form';

import { message, Modal, Transfer } from 'antd';
// import type { SelectValue } from 'antd/lib/select';
import { queryGroupMember } from '../service';
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
  // const lastFetchId = 0;

  const fetchUserForManager = async (/* value: string */) => {
    const users = await queryGroupMember({ getParent: false, group: props.parent });
    const res = users.data.map((user: GroupMemberData) => ({
      title: user.real_name,
      label: <span>{(user.role === 'MANAGER' )&& <UserOutlined />}{user.real_name}</span>,
      value: user.uid,
      isManager: user.role === 'MANAGER',
    }));
    setData(res);
  };


/*
  const handleChange = (value: SelectValue) => {
    console.log(value);
    setData([]);
    setFetching(false);
  };

 */

  if (data.length <= 0) fetchUserForManager();

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

        <StepsForm.StepForm
          title='新建群组'
          onFinish={async (values) => {
            await waitTime(2000);
            console.log(values);
            message.success('提交成功');
            return true;
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

          {/*
          <ProForm.Item name='manager' label='负责人'              style={{ width: '100%' }}
          >
            <Select
              // className='pro-field-md'
              // mode='multiple'
              showSearch
              labelInValue

              placeholder='Select users'
              notFoundContent={fetching ? <Spin size='small' /> : null}
              filterOption={false}
              onSearch={fetchUserForManager}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              {data.map(d => (
                <Option className='pro-field-md' key={d.value} value={d.value}>{d.text}</Option>
              ))}
            </Select>
          </ProForm.Item>
          */}
          <ProFormTextArea width='md' name='description' label='描述' />
        </StepsForm.StepForm>
        <StepsForm.StepForm
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
