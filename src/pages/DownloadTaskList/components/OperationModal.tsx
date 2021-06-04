import type { FC } from 'react';
import React, { useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input, Select } from 'antd';
import type { BasicListItemDataType } from '../data.d';
import styles from '../style.less';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  onCancel: () => void;
};

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  const { done, visible, current, onDone, onCancel, onSubmit } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [props.current, visible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = () => {

  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form}  onFinish={handleFinish} >
        <Form.Item
          name="title"
          label="订单号/FTP密码"
        >
          <Input placeholder="请输入"  disabled/>
        </Form.Item>
        <Form.Item
          name="pwd"
          label="FTP密码"
        >
          <Input placeholder="请输入"  disabled/>
        </Form.Item>
        <Form.Item
          name="createdAt"
          label="开始时间"
        >
          <DatePicker
            showTime
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            disabled
          />
        </Form.Item>
        <Form.Item
          name="owner"
          label="任务负责人"
        >
          <Input placeholder="请选择" disabled>
          </Input>
        </Form.Item>

      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `任务${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
