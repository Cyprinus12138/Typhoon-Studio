import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import type { Dispatch } from 'umi';
import { connect, formatMessage, FormattedMessage } from 'umi';
import React, { Component } from 'react';

import type { CurrentUser, ResponseType } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>
      <FormattedMessage id='accountandaccountsettings.basic.avatar' defaultMessage='Avatar' />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt='avatar' />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          <FormattedMessage id='accountandaccountsettings.basic.change-avatar' defaultMessage='Change avatar' />
        </Button>
      </div>
    </Upload>
  </>
);

interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

interface BaseViewProps {
  dispatch: Dispatch;
  currentUser?: CurrentUser;
  updateResponse?: ResponseType;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = (body: CurrentUser) => {
    this.props.dispatch(
      {
        type: 'accountAndAccountSettings/submitUpdate',
        payload: body,
      },
    );
    message.info(formatMessage({ id: 'accountandaccountsettings.basic.update.submit' }));
  };

  render() {
    const { currentUser, updateResponse } = this.props;

    if (updateResponse?.success != null) {
      if (updateResponse.success)
        message.success(formatMessage({ id: 'accountandaccountsettings.basic.update.success' })).then(() => {
            this.props.dispatch({
              type: 'accountAndAccountSettings/clearResponse',
            });
          },
        );
      else
        message.error(formatMessage({ id: 'accountandaccountsettings.basic.update.failed' })).then(() => {
            this.props.dispatch({
              type: 'accountAndAccountSettings/clearResponse',
            });
          },
        );
    }
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout='vertical'
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item
              name='email'
              label={formatMessage({ id: 'accountandaccountsettings.basic.email' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.email-message' }, {}),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='name'
              label={formatMessage({ id: 'accountandaccountsettings.basic.nickname' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.nickname-message' }, {}),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='signature'
              label={formatMessage({ id: 'accountandaccountsettings.basic.profile' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.profile-message' }, {}),
                },
              ]}
            >
              <Input.TextArea
                placeholder={formatMessage({ id: 'accountandaccountsettings.basic.profile-placeholder' })}
                rows={4}
              />
            </Form.Item>
            <Form.Item
              name='country'
              label={formatMessage({ id: 'accountandaccountsettings.basic.country' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.country-message' }, {}),
                },
              ]}
            >
              <Select style={{ maxWidth: 220 }}>
                <Option value='China'>中国</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='geographic'
              label={formatMessage({ id: 'accountandaccountsettings.basic.geographic' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.geographic-message' }, {}),
                },
                {
                  validator: validatorGeographic,
                },
              ]}
            >
              <GeographicView />
            </Form.Item>
            <Form.Item
              name='address'
              label={formatMessage({ id: 'accountandaccountsettings.basic.address' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.address-message' }, {}),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='phone'
              label={formatMessage({ id: 'accountandaccountsettings.basic.phone' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'accountandaccountsettings.basic.phone-message' }, {}),
                },
                { validator: validatorPhone },
              ]}
            >
              <PhoneView />
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit' type='primary'>
                <FormattedMessage
                  id='accountandaccountsettings.basic.update'
                  defaultMessage='Update Information'
                />
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ accountAndAccountSettings }: { accountAndAccountSettings: { currentUser: CurrentUser, updateResponse: ResponseType } }) => ({
    currentUser: accountAndAccountSettings.currentUser,
    updateResponse: accountAndAccountSettings.updateResponse,
  }),
)(BaseView);
