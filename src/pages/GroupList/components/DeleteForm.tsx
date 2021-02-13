import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { deleteGroup } from '../service';
import style from './DeleteForm.css';
import { message } from 'antd';

interface DeleteFormProps {
  gid: string,
  title: string,
}

const renderLabel = (title: string) => (
  <span>为防止误操作，请键入完整组名 <div className={style.input_group_name}><em>{title}</em></div> 确认操作：</span>
);

const DeleteForm: React.FC<DeleteFormProps> = (props) => {
  const { gid, title } = props;

  return (
    <>
      <ModalForm
        title={'删除群组'}
        trigger={<span>删除</span>}
        width='25%'
        onFinish={async values => {
          if (values.identifier !== title) {
            message.error('请输入完整群组名称');
            return false;
          }
          try {
            const res = await deleteGroup({ gid });
            if (res.success) {
              message.success('删除成功');
              return true;
            }
            message.error('操作失败，请稍候再试');
            return false;
          } catch (e) {
            message.error('操作失败，请稍候再试');
            return false;
          }
        }}
      >
        <ProFormText
          width='md'
          label={renderLabel(title)}
          name='identifier'
        />
      </ModalForm>
    </>
  );
};


export default DeleteForm;
