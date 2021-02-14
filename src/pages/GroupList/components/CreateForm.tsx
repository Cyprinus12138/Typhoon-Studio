import React, { useCallback, useEffect, useState } from 'react';
import {
  StepsForm,
  ProFormText, ProFormTextArea, ProFormSelect,
} from '@ant-design/pro-form';

import { Button, message, Modal, Result, Transfer } from 'antd';
import { queryGroupMember, createGroup, putGroupMember } from '../service';
import type { GroupMemberData, UserTransferRecord } from '../data';
import { UserOutlined } from '@ant-design/icons';

// 取两个Array并集
function union(a: any[], b: any[]) {
  return [...new Set([...new Set(a), ...new Set(b)])];
}

// 取两个Array差集
function minus(a: any[], b: any[]) {
  return a.filter(x => !new Set(b).has(x));
}

// 取两个Array交集
function intersect(a: any[], b: any[]) {
  return a.filter(x => new Set(b).has(x));
}

interface CreateFormProps {
  parent: string,
  onCancel?: () => void;
  visible?: boolean,
  onVisibleChange?: (visible: boolean) => void;
}


const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { visible, onVisibleChange } = props;

  const [managerSelectData, setManagerSelectData] = useState([]);
  const [memberTransferData, setMemberTransferData] = useState([]);

  const [targetKeys, setTargetKeys] = useState<any[]>([]);
  const [addGroupSet, setAddGroupSet] = useState<string[]>([]);
  const [quitGroupSet, setQuitGroupSet] = useState<string[]>([]);
  const [totalState, setTotal] = useState();
  const [successNumState, setSuccessNum] = useState();

  // const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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
          disabled: user.super_manager,
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
    setCurrentStep(0);
  }, [fetchUserForManager, visible]);

  useEffect(() => {
    if ((currentStep === 0) && visible) // To avoid useless fetch after form complete.
      fetchUserForManager();
    if (currentStep === 1)
      fetchUserForGroup();
  }, [currentStep, fetchUserForGroup, fetchUserForManager, visible]);

  const customSubmitter = (
    <div className='steps-action'>
      {currentStep === 0 && (
        <Button type='primary' onClick={() => {
          form_0.submit();
        }}>
          下一步
        </Button>
      )}
      {currentStep === 1 && (
        <Button type='primary' onClick={() => {
          form_1.submit();
        }}>
          下一步
        </Button>
      )}{currentStep === 2 && (
      <Button type='primary' onClick={() => {
        form_2.submit();
      }}>
        完成
      </Button>
    )}
    </div>
  );

  return (
    <>
      <StepsForm
        onFinish={async () => {
          if (onVisibleChange) {
            onVisibleChange(false);
          }
          message.success('提交成功');
        }}
        current={currentStep}
        onCurrentChange={(_) => {
          setCurrentStep(_);
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
              onCancel={() => onVisibleChange ? onVisibleChange(false) : {}}
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
              form_0.resetFields();
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
            required
          />
          <ProFormSelect
            label='负责人'
            name='manager'
            options={managerSelectData}
            showSearch
            width='md'
            required  // TODO Resolve required problem.
          />
          <ProFormTextArea width='md' name='description' label='描述' required />
        </StepsForm.StepForm>


        <StepsForm.StepForm // Second step.
          form={form_1}
          title='添加成员'
          onFinish={async () => {
            try {
              const mid = intersect(addGroupSet, quitGroupSet);
              await setAddGroupSet(prevState => minus(prevState, mid));
              await setQuitGroupSet(prevState => minus(prevState, mid));
              const { total, successNum } = await putGroupMember({
                addList: addGroupSet.map(item => ({ uid: item })),
                quitList: quitGroupSet,
                gid: newGid,
              });
              setTotal(total);
              setSuccessNum(successNum);
              message.success('提交成功');
              return true;
            } catch (e) {
              return false;
            }
          }}
        >
          <Transfer
            dataSource={memberTransferData}
            targetKeys={targetKeys}
            showSearch
            render={(value: UserTransferRecord) => (
              <span>{(value.isManager) && <UserOutlined />}{value.title}</span>
            )}
            onChange={((t, direction, moveKeys) => {
              setTargetKeys(t);
              if (direction === 'right') {
                setAddGroupSet(prevState => (union(prevState, moveKeys)));
              } else {
                setQuitGroupSet(prevState => (union(prevState, moveKeys)));
              }
            })}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm // Third step.
          form={form_2}
          title='创建完成'
          onFinish={async () => {
            return true;
          }}
        >
          <Result
            status='success'
            title={'创建完成'}
            subTitle={`共添加${totalState}人，成功${successNumState}人。`}
            style={{ marginBottom: 16 }}
          >
          </Result>
        </StepsForm.StepForm>
      </StepsForm>
    </>

  );
};

export default CreateForm;
