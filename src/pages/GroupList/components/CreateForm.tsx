import React, { useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';

import { message, Select, Spin } from 'antd';

const { Option } = Select;

interface CreateFormProps {
  trigger: JSX.Element;
  modalVisible?: boolean;
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
  const [fetching, setFetching] = useState<boolean>(false);
  const [data, setData] = useState([]);

  let lastFetchId = 0;

  const fetchUser = async (value: string) => {
    console.log('fetching user', value);
    lastFetchId += 1;
    const fetchId = lastFetchId;
    setFetching(true);
    setData([]);
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        if (fetchId !== lastFetchId) {
          // for fetch callback order
          return;
        }
        const res = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        setData(res);
        setFetching(false);
      });
  };

  const handleChange = value => {
    console.log(value);
    setData([]);
    setFetching(false);
  };

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title='新建群组'
      trigger={
        props.trigger
      }
      modalProps={{
        onCancel: () => console.log('run'),
      }}
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
      <ProForm.Item name='manager' label='负责人' className='pro-field-md'>
        <Select
          className='pro-field-md'
          // mode='multiple'
          showSearch
          labelInValue

          placeholder='Select users'
          notFoundContent={fetching ? <Spin size='small' /> : null}
          filterOption={false}
          onSearch={fetchUser}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          {data.map(d => (
            <Option key={d.value} value={'st'}>{d.text}</Option>
          ))}
        </Select>
      </ProForm.Item>
      <ProFormTextArea width='md' name='description' label='描述' />
    </ModalForm>
  );
};

export default CreateForm;
